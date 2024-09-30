import { BlockEntity, BlockUUIDTuple, PageEntity } from '@logseq/libs/dist/LSPlugin.user';
import { getLogseqFiles, getLogseqPageBlocksTree } from '../logseq/logseqCommonProxy';
import { getAllLogseqPages, getAllLogseqPagesAndFile } from '../logseq/logseqGetAllPage';
import { DataType, DocFormat, RelatedType } from './enums';
import { logger } from '../utils/logger';
import { encodeLogseqFileName, formatFileName, formatFilePath, formatFileSize, formatJournalPageName, getFileInfo } from '../utils/fileUtil';
import { DB } from './db';
import { AppConfig, DataItem } from './types';
import { GRAPH_PREFIX, REG_ASSETS, REG_SPLIT, REG_TAG } from './constants';
import { objUnderlineToSmallCamel } from '../utils/objectUtil';

// 准备页面数据的函数
const preparePagesData = async ({ appConfig, dirHandle }: { appConfig: AppConfig; dirHandle: FileSystemDirectoryHandle | undefined; }) => {
    let v = '2'
    if (v === '1') {
        // 获取当前图的所有页面
        const pages = await getAllLogseqPages();
        if (!pages) return;
        // 过滤掉日记和目录页面
        const validPages = pages.filter(page => page.originalName !== 'Contents'); //  日记页面也收录到管理中  
        // 处理每个页面的异步操作
        const promises = validPages.map(pageE => processPage({ pageE, dirHandle, appConfig }));
        await Promise.all(promises);
    }
    if (v == '2') {
        const data = await getAllLogseqPagesAndFile();
        if (!data || data.length === 0) return;
        const promises = data.map(entity => {
            const [fileE, pageE] = entity
            // @ts-ignore
            processPage({ pageE: ({ ...objUnderlineToSmallCamel(pageE), path: fileE.path } as PageEntity), dirHandle, appConfig })
        });
        await Promise.all(promises);
    }
}

export interface processPageProps { pageE: PageEntity, dirHandle: any, appConfig: AppConfig, updated?: boolean }

// 处理单个页面的函数
export const processPage = async ({ pageE, dirHandle, appConfig, updated }: processPageProps) => {
    const isJournal = pageE['journal?'];
    const graph = appConfig.currentGraph
    const dateFormat = appConfig.preferredDateFormat
    const docFormat = appConfig.preferredFormat as DocFormat
    const pagesDir = appConfig.pagesDirectory!
    const journalsDir = appConfig.journalsDirectory!
    const journalFileTem = appConfig.journalFileNameFormat!
    // logger.debug('processPage', 'processPageProps', { pageE, dirHandle, appConfig, updated })

    // 获取页面的最新更新时间
    const [updatedTime, size] = await getFileInfo(
        encodeLogseqFileName(isJournal
            ? formatJournalPageName(pageE.journalDay, pageE.originalName, journalFileTem, dateFormat)
            : pageE.originalName),
        await dirHandle?.getDirectoryHandle(isJournal ? journalsDir : pagesDir),
        docFormat,
        [pageE.updatedAt ?? 0, undefined])
    if (!updatedTime) {
        logger.warn(`page no updatetime,page:${pageE.name}`)
        return;
    }
    if (!pageE.uuid) {
        logger.warn(`page no uuid,page:${pageE.name}`)
        return;
    }

    // 获取页面的所有块
    const blocks = await getLogseqPageBlocksTree(pageE.uuid);
    if (!blocks || blocks.length === 0) return;

    // 获取页面的摘要和图片
    const [summary, image, imageUuid] = extractSummary(blocks);
    const originalName = (isJournal
        ? formatJournalPageName(pageE.journalDay, pageE.originalName, journalFileTem, dateFormat)
        : encodeLogseqFileName(pageE.originalName))
        + DocFormat.toFileExt(docFormat);
    await DB.data.put({ // put 操作：新增或更新，等同于upsert
        graph,
        dataType: isJournal ? DataType.JOURNAL : DataType.PAGE,
        alias: pageE.originalName,
        name: originalName,
        uuid: pageE.uuid,
        updatedTime,
        summary,
        image,
        size,
        path: pageE.path ? `${graph.replace(GRAPH_PREFIX, '')}/${pageE.path}` : `${graph.replace(GRAPH_PREFIX, '')}/${isJournal ? journalsDir : pagesDir}/${originalName}`,
        related: [{
            relatedType: RelatedType.BLOCK,
            relatedItemUuid: imageUuid
        }],
        createdTime: pageE.properties?.createdTime,
        icon: pageE.properties?.icon
    });

    // 提取页面块中的资产和标签
    const assetsAndTags = extractAssetsAndTagsFromPage(pageE, blocks);
    if (updated) {
        assetsAndTags.forEach(async asset => {
            const item = await DB.data.get([asset.name]);
            if (item) {
                logger.debug(`processPage update asset,asset:${asset.name}`)
                await DB.data.update([asset.name], {
                    graph, updatedTime, dataType: asset.dataType,
                    alias: asset.alias,
                    related: asset.related,
                });
            } else {
                logger.debug(`processPage add asset,asset:${asset.name}`)
                await DB.data.put({
                    graph, updatedTime,
                    dataType: asset.dataType,
                    alias: asset.alias,
                    related: asset.related,
                    name: asset.name,
                    path: `${graph.replace(GRAPH_PREFIX, '')}/assets/${asset.name}`,
                    uuid: '',
                    extName: asset.extName,
                });
            }
        })

    } else {
        await Promise.all(assetsAndTags.map(asset => {
            DB.data.update([asset.name], {  // 将提取到的资产和标签并行添加到数据库中 
                dataType: asset.dataType,
                alias: asset.alias,
                related: asset.related,
            });
        }))
    }
};

interface ParentBlocks {
    blocks: BlockEntity[];
    index: number;
}

/**
 * 获取块的摘要和图片信息
 * @param blocks 块数组
 * @returns 包含摘要数组和图片路径的元组
 */
export const extractSummary = (blocks: BlockEntity[]): [string[], string, string] => {
    const maxContentLength = 100;
    let totalContentLength = 0;
    const summary: string[] = [];
    let image: string = '';
    let imageBlockUuid: string = ''
    const parentStack: ParentBlocks[] = [{ blocks, index: 0 }];

    // 处理块，收集摘要和图片
    const processBlocks = () => {
        while (totalContentLength < maxContentLength && parentStack.length > 0) {
            const currentParent = parentStack[parentStack.length - 1];
            while (currentParent.index < currentParent.blocks.length) {
                const block = currentParent.blocks[currentParent.index++];
                if (block.id != null) {
                    let content = block.content.substring(0, maxContentLength - totalContentLength);
                    // 跳过特定格式的行
                    if (!content.startsWith(':: ') && !content.startsWith('---\n')) {
                        // 根据层级添加缩进
                        const indentation = '  '.repeat(parentStack.length - 1);
                        content = indentation + (parentStack.length > 1 ? `* ${content}` : content);
                        summary.push(content);
                        totalContentLength += content.length;
                    }

                    // 检查内容中是否包含图片
                    if (!image) {
                        const match = content.match(/[[(]..\/assets\/(.+\.(png|jpg|jpeg))[\])]/i);
                        if (match) {
                            image = match[1];
                            imageBlockUuid = block.uuid
                            break; // 找到图片后退出循环
                        }
                    }

                    // 如果块有子块，则将其加入栈中
                    if (block.children && block.children.length > 0) {
                        parentStack.push({ blocks: block.children as BlockEntity[], index: 0 });
                    }
                }
            }
            // 如果当前层的块已处理完毕，则弹出栈
            if (currentParent.index >= currentParent.blocks.length) {
                parentStack.pop();
            }
        }
    };

    // 首次处理块，收集摘要
    processBlocks();

    // 重置栈，重新处理块，收集图片信息
    parentStack.length = 0;
    parentStack.push({ blocks, index: 0 });
    processBlocks();

    return [summary, image, imageBlockUuid];
};

// 从页面的所有块中提取资产和标签信息。
const extractAssetsAndTagsFromPage = (page: PageEntity, blocks: BlockEntity[]): DataItem[] => {
    logger.debug(`extractAssetsAndTagsFromPage start, page: ${page.originalName}`);
    const relatedAssets: DataItem[] = [];

    extractAssetsAndTagsFromProperties(page.properties || {}, page.originalName, relatedAssets);
    (blocks || []).forEach(block => extractAssetsAndTagsFromBlock(page.originalName, block, relatedAssets));

    return relatedAssets;
};

// 处理单个页面块，提取其中的资产和标签信息。
const extractAssetsAndTagsFromBlock = (pageName: string, block: BlockEntity, relatedAssets: DataItem[]): void => {
    if (!block) {
        return
    }

    // 忽略特定前缀的块，这些前缀通常用于格式化或隐藏内容
    if (block.content && !block.content.startsWith(':: ') && !block.content.startsWith('---')) {

        const tags = (block.content.match(REG_TAG) || []).map(tag => tag.trim().slice(1));// 提取标签
        const assetMatchers = block.content.matchAll(REG_ASSETS);       // 提取资产

        for (const assetMatcher of assetMatchers) {
            let [match, alias, assetName, extName] = assetMatcher;
            if (match) {
                block.content = block.content.replace(match, alias).trim(); // 替换掉所有匹配的asset
            }
            [, alias] = formatFileName(alias);

            if (assetName && extName) {
                relatedAssets.push({
                    dataType: DataType.fileExtToDataType(extName),
                    name: `${assetName}.${extName}`,
                    alias: alias,
                    related: [
                        ...tags.map(tag => ({
                            relatedType: RelatedType.TAG,
                            relatedTag: tag,
                        })),
                        {
                            relatedType: RelatedType.BLOCK,
                            relatedItemUuid: block.uuid,
                            relatedBlockContent: block.content,
                            relatedBlockPage: pageName
                        },
                    ],
                    uuid: '',
                    updatedTime: 0,
                    graph: ''
                });
            }
        }
    }

    if (block.properties) {
        extractAssetsAndTagsFromProperties(block.properties, pageName, relatedAssets, block.uuid, block.content)
    }

    // 递归处理子块
    block.children?.forEach((subBlock: BlockEntity | BlockUUIDTuple) => {
        (subBlock as BlockEntity).content && extractAssetsAndTagsFromBlock(pageName, subBlock as BlockEntity, relatedAssets)
    });
};

// 工具函数：提取和格式化标签
const extractAndFormatTagsFromProperty = (properties: Record<string, any>): string[] => {
    // 提供默认值以确保即使 properties.tag 为 undefined 或 null，也不会导致错误 
    const tagString = typeof properties.tag === 'string' ? properties.tag ?? '' : '';
    const tagsString = typeof properties.tags === 'string' ? properties.tags ?? '' : '';

    // 使用正则表达式分割字符串，并去除多余的空格和空字符串
    return [tagString, tagsString]
        .map(str => str.split(REG_SPLIT).map((tag: string) => tag.trim()).filter((tag: string | any[]) => tag.length > 0))
        .flat();
};

// 工具函数：格式化资产信息
const extractAssetFromProperty = (properties: Record<string, any>): [string, string, string] => {
    let [match, alias, assetName, extName] = properties.file?.match(REG_ASSETS) || [];
    [, alias] = formatFileName(alias); // 格式化文件名

    // 如果没有匹配到，并且 block.properties.filePath 存在，则格式化文件路径
    if (!match && properties?.filePath) {
        [, assetName, alias, extName] = formatFilePath(properties.filePath);// 使用格式化后的文件路径信息更新变量 
    }
    return [assetName, extName, alias];
};

// 工具函数：处理块属性并添加相关资产
const extractAssetsAndTagsFromProperties = (properties: Record<string, any>, pageName: string, relatedAssets: DataItem[], blockUUID?: string, blockContent?: string): void => {
    if (!properties) return;
    logger.debug(`extractAssetsAndTagsFromProperties,page:${pageName},property:${JSON.stringify(properties)}`);

    const tags = extractAndFormatTagsFromProperty(properties);
    const [assetName, extName, alias] = extractAssetFromProperty(properties);

    logger.debug(`extractAssetsAndTagsFromProperties,assetName:${assetName},extName:${extName}`)
    if (assetName && extName) {
        relatedAssets.push({
            dataType: DataType.fileExtToDataType(extName),
            name: `${assetName}.${extName}`,
            alias: alias,
            related: [
                ...tags.map(tag => ({
                    relatedType: RelatedType.TAG,
                    relatedTag: tag,
                })),
                {
                    relatedType: blockUUID ? RelatedType.BLOCK : RelatedType.PAGE,
                    relatedBlockPage: pageName,
                    relatedItemUuid: blockUUID,
                    relatedBlockContent: blockContent
                },
            ],
            uuid: '',
            updatedTime: 0,
            graph: ''
        });
    }
};

// 准备资产数据的函数
const prepareAssetsData = async ({ graph }: { graph: string }) => {
    logger.debug(`prepareAssetsData start, graph: ${graph}`);

    const files = await getLogseqFiles();
    if (!files) return;

    // 规范化并存储资产数据 
    await Promise.all(files.map(normalizeDataItem).map((asset) => {
        if (asset && asset.name) {
            DB.data.put({
                graph,
                name: asset.name,
                dataType: DataType.fileExtToDataType(asset.extName!),
                uuid: asset.uuid,
                updatedTime: asset.updatedTime,
                alias: asset.alias,
                path: asset.path,
                extName: asset.extName,
                size: asset.size
            });
        }
    }))
};

// 规范化 AssetFile 数据  
const normalizeDataItem = (item: any): DataItem | undefined => {
    if (!item.path) return;

    const [path, name, alias, extName] = formatFilePath(item.path);
    if (!name) return; // 如果没有有效的文件名，则返回 undefined

    // 规范化文件大小
    if (typeof item.size === 'number') {
        item.size = formatFileSize(item.size);
    }

    // 格式化修改时间
    if (typeof item.modifiedTime === 'number') {
        item.updatedTime = item.modifiedTime;
    }

    return {
        ...item,
        path,
        name,
        alias,
        extName,
    } as unknown as DataItem;
};


export { preparePagesData, prepareAssetsData };

