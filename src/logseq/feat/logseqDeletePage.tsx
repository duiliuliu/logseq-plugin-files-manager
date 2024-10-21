import { format } from "date-fns";
import { AppConfig, DataItem } from "../../data/types";
import { logger } from "../../utils/logger";
import { ASSETS_PATH_REGEX, ASSETS_REPLACE_PATH, DEFAULT_DELETE_FORMAT, DELETE_ASSET_VERSION_NEED_DIR_HANDLER_FN, i18n_DEFAULT_DELETE_FORMAT, i18n_DELETE_FORMAT_TITLE } from "../../data/constants";
import { escapeRegExp, objectTemplateFromat } from "../../utils/objectUtil";
import { getI18nConstantByPreLang } from "../../i18n/utils";
import { removePageFromDB } from "../../data/db";
import { DocFormat } from "../../data/enums";
import { dirhandlerRemoveFile, dirhandlerRemoveFile2, dirhandlerRemoveFile3 } from "./logseqFile";


// 删除 Logseq 资产的函数，接受一个数据项、用户配置和一个文件系统目录处理器。
// 返回一个包含被删除引用块 UUID 的数组。
export const deleteLogseqAsset = async (record: DataItem, userConfig: AppConfig, assetdirHandler: FileSystemDirectoryHandle | null): Promise<Array<string>> => {
    // 调用 deleteLogseqAssetRefs 函数删除资产引用，并等待结果。
    const refBlocks = await deleteLogseqAssetRefs(record.alias, record, userConfig);

    // 根据函数 DELETE_ASSET_VERSION_NEED_DIR_HANDLER_FN 的返回值决定使用哪个删除文件的函数。
    if (DELETE_ASSET_VERSION_NEED_DIR_HANDLER_FN()) {
        await dirhandlerRemoveFile(record.name, assetdirHandler);
    } else {
        await dirhandlerRemoveFile2(record.name);
        await dirhandlerRemoveFile3(record.name);
    }

    // 从数据库中移除页面信息。
    removePageFromDB(userConfig.currentGraph, record.name);
    // 返回被删除引用块的 UUID 数组。
    return refBlocks;
};

// 删除 Logseq 资产引用的函数，接受资产名称、数据项和用户配置。
// 返回一个包含被删除引用块 UUID 的数组。
const deleteLogseqAssetRefs = async (name: string, record: DataItem, userConfig: AppConfig): Promise<Array<string>> => {
    // 获取用户配置中的删除格式，如果不存在则返回空数组。
    const deleteFormart = userConfig?.pluginSettings?.deleteFormart;
    if (!deleteFormart) {
        return [];
    }
    // 初始化一个数组来存储被删除的块的 UUID。
    const refBlockUids: string[] = [];
    // 获取与当前资产相关的数据。
    const related = record.related;
    // 调用 Logseq API 搜索与资产名称相关的块。
    const search = await logseq.caller.callAsync(`api:call`, { method: 'search', args: [name] });

    // 使用删除格式和当前时间格式化删除字符串。
    const deleteString = formatDeleteString(deleteFormart, { name, date: format(Date.now(), userConfig.preferredDateFormat), time: format(Date.now(), 'HH:mm') });
    logger.debug('deleteLogseqPage,deleteString:', deleteString, 'name', name);

    // 构建一个用于匹配资产引用的正则表达式。
    const filePath = escapeRegExp(record.path?.replace(ASSETS_PATH_REGEX, ASSETS_REPLACE_PATH) || "");
    const assetRefPattern = new RegExp(`!?\\[.*?\\]\\(${filePath}\\)`);

    // 遍历相关块，替换内容中的资产引用，并更新块。
    for (const refItem of related || []) {
        if (refItem.relatedBlockContent && refItem.relatedItemUuid) {
            const block = await logseq.Editor.getBlock(refItem.relatedItemUuid);
            if (!block) {
                throw Error(`block(${refItem.relatedItemUuid}) not found`);
            }
            let newContent = block.content.replace(assetRefPattern, deleteString);
            await logseq.Editor.updateBlock(refItem.relatedItemUuid, newContent);
            refBlockUids.push(block.uuid);
        }
    }

    // 遍历搜索结果中的块，替换内容中的资产引用，并更新块。
    for (const block of search?.blocks || []) {
        if (!refBlockUids.includes(block["block/uuid"])) {
            let newContent = block["block/content"].replace(assetRefPattern, deleteString);
            await logseq.Editor.updateBlock(block["block/uuid"], newContent);
            refBlockUids.push(block["block/uuid"]);
        }
    }

    // 返回被删除引用块的 UUID 数组。
    return refBlockUids;
};

// 删除 Logseq 页面的函数，接受页面名称和用户配置。
// 返回一个包含被删除引用块 UUID 的数组。
export const deleteLogseqPage = async (name: string, userConfig: AppConfig): Promise<Array<string>> => {
    logger.debug('deleteLogseqPage start', 'name', name);

    // 调用 deleteLogseqPageRefs 函数删除页面引用，并等待结果。
    const refBlocks = await deleteLogseqPageRefs(name, userConfig);
    // 调用 Logseq API 删除页面。
    await logseq.Editor.deletePage(name);
    // 从数据库中移除页面信息。
    removePageFromDB(userConfig.currentGraph, name + DocFormat.toFileExt(userConfig.preferredFormat));

    // 返回被删除引用块的 UUID 数组。
    return refBlocks;
};

// 删除 Logseq 页面引用的函数，接受页面名称和用户配置。
// 返回一个包含被删除引用块 UUID 的数组。
const deleteLogseqPageRefs = async (name: string, userConfig: AppConfig): Promise<Array<string>> => {
    // 获取用户配置中的删除格式，如果不存在则使用默认格式。
    const deleteFormat = userConfig?.pluginSettings?.deleteFormart || DEFAULT_DELETE_FORMAT;
    const refBlockUids: string[] = [];
    // 获取与页面名称关联的所有块。
    const refBlocks = (await logseq.Editor.getPageLinkedReferences(name))?.map(item => item[1]).reduce((prevBlocks, curr) => [...prevBlocks, ...curr], []);
    // 调用 Logseq API 搜索与页面名称相关的块。
    const search = await logseq.caller.callAsync(`api:call`, { method: 'search', args: [name] });
    logger.debug('deleteLogseqPage,refs:', refBlocks, 'name', name);
    // 如果没有找到关联的块，则返回空数组。
    if (!refBlocks || refBlocks.length === 0) {
        return refBlockUids;
    }

    // 使用删除格式和当前时间格式化删除字符串。
    const deleteString = formatDeleteString(deleteFormat, { name, date: format(Date.now(), userConfig.preferredDateFormat), time: format(Date.now(), 'HH:mm') });
    logger.debug('deleteLogseqPage,deleteString:', deleteString, 'name', name);

    // 遍历关联的块，替换内容中的页面引用，并更新块。
    for (const block of refBlocks || []) {
        let newContent = block.content.replace(`[[${name}]]`, deleteString);
        newContent = newContent.replace(`#${name}`, deleteString);

        await logseq.Editor.updateBlock(block.uuid, newContent);
        logger.debug('deleteLogseqPage,updateBlock:', newContent);
        refBlockUids.push(block.uuid);
    }

    // 遍历搜索结果中的块，替换内容中的页面引用，并更新块。
    for (const block of search?.blocks || []) {
        if (!refBlockUids.includes(block["block/uuid"])) {
            let newContent = block["block/content"].replace(`[[${name}]]`, deleteString);
            newContent = newContent.replace(`#${name}`, deleteString);

            await logseq.Editor.updateBlock(block["block/uuid"], newContent);
            logger.debug('deleteLogseqPage,updateBlock:', newContent);
            refBlockUids.push(block["block/uuid"]);
        }
    }

    // 返回被删除引用块的 UUID 数组。
    return refBlockUids;
};

// 格式化用于删除操作的字符串，接受模板字符串和数据对象。
const formatDeleteString = (temp: string, data: { name?: string, date?: string, time?: string, [key: string]: any }): string => {
    try {
        // 使用模板格式化字符串，并返回结果。
        return ` ${objectTemplateFromat(temp, data)} `;
    } catch (error) {
        // 如果格式化过程中出现错误，显示错误信息，并使用默认的删除格式。
        logseq.UI.showMsg(`get ${getI18nConstantByPreLang(i18n_DELETE_FORMAT_TITLE)} error,error:${error}`);
        return ` ${objectTemplateFromat(getI18nConstantByPreLang(i18n_DEFAULT_DELETE_FORMAT), data)} `;
    }
};

