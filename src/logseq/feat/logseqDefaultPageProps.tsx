import { PageEntity } from "@logseq/libs/dist/LSPlugin";
import { logger } from "../../utils/logger";
import { AppConfig } from "../../data/types";
import { getCustomVariables, resolveProperties } from "./logseqCustomVariable";
import { kebab } from "name-styles";

/**
 * 为指定页面添加 Logseq 默认页面属性。
 * @param name 页面名称。
 */
export const addLogseqDefaultPageProps = async (appConfig: AppConfig, page: string | PageEntity) => {
    const name = typeof page === 'string' ? page : page.originalName;

    try {
        // 获取页面对象，如果不存在则返回
        const pageE = typeof page === 'string' ? await logseq.Editor.getPage(name) : page;
        if (!pageE) {
            logger.warn(`Page ${name} not found`);
            return;
        }

        // 获取默认页面属性和可见性设置
        const { properties: defaultProps, visible } = await getLogseqDefaultPageProps(appConfig, pageE);
        if (!defaultProps || Object.keys(defaultProps).length === 0) {
            logger.debug('No default properties to apply');
            return;
        }
        logger.debug('Adding default properties to the first block', defaultProps, visible);

        // 获取页面的区块树，并检查是否存在第一个区块
        const blocks = await logseq.Editor.getPageBlocksTree(name);
        const firstBlock = blocks.at(0);

        // 更新页面和第一个区块的属性
        await updateBlockProperties(pageE.uuid, defaultProps);
        const newBlock = visible && await logseq.Editor.appendBlockInPage(name, '', { properties: { ...pageE.properties, ...defaultProps } });
        // 检查是否存在第一个区块
        firstBlock && newBlock && await logseq.Editor.moveBlock(newBlock.uuid, firstBlock.uuid, { before: true, children: true })
        // 删除重复的快 
        propertiesToStr(firstBlock?.properties).includes(firstBlock?.content || '') && firstBlock?.uuid && logseq.Editor.removeBlock(firstBlock?.uuid)
        logseq.Editor.exitEditingMode()
    } catch (error) {
        // 捕获并显示错误消息
        const errorMsg = `Adding default properties to page [${name}] failed: ${error}`;
        logger.error(errorMsg);
        logseq.UI.showMsg(errorMsg, 'error');
    }
};

/**
 * 更新区块的属性
 * @param block 区块对象
 * @param properties 要更新的属性对象
 */
const updateBlockProperties = async (blockUid: string, properties: { [s: string]: unknown; }) => {
    await Promise.all(
        Object.entries(properties).map(([key, value]) =>
            logseq.Editor.upsertBlockProperty(blockUid, key, value)
        )
    );
};

/**
 * 获取 Logseq 默认页面属性。
 * 这个函数从 LSP 获取自定义变量，并将其转换为一个对象，然后获取默认页面属性，并应用这些变量。
 */
const getLogseqDefaultPageProps = async (appConfig: AppConfig, page: PageEntity) => {

    if (!appConfig || !appConfig.pluginSettings) {
        return {}
    }

    // 从 LSP 获取默认页面属性和可见性设置。
    const { properties, visible } = appConfig.pluginSettings.defaultPageProps
    logger.debug('getLspDefaultPageProps', 'properties', properties, 'visible', visible);

    // 从 LSP 获取变量数据。
    const varsData = getCustomVariables({ appConfig, page })

    // 如果存在属性，应用对象模板格式化函数。
    if (properties) {
        const objDest = await resolveProperties(properties, varsData, appConfig.pluginSettings?.customVariableTimeout, appConfig.pluginSettings?.customVariableErrorHandler)

        logger.debug('getLspDefaultPageProps', 'properties', objDest,);
        return { properties: objDest, visible };
    }

    // 如果没有属性，返回一个空对象。
    return {};
};

export const propertiesToStr = (properties?: { [s: string]: any }): [string, string, string] => {
    if (!properties || Object.keys(properties).length === 0) {
        return ['', '', '']
    }
    // @ts-ignore
    const v1 = Object.entries(properties).map(([k, v]) => `${k}:: ${v}`).reduce((prev, curr) => prev + "\n" + curr)
    const v3 = Object.entries(properties).map(([k, v]) => `${kebab(k)}:: ${v}`).reduce((prev, curr) => prev + "\n" + curr)

    return [v1, '---\n' + v1 + '\n---', v3]
}