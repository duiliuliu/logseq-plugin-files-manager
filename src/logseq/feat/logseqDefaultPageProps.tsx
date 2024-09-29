import { PageEntity } from "@logseq/libs/dist/LSPlugin";
import { logger } from "../../utils/logger";
import { objectTemplateFromat } from "../../utils/objectUtil";
import { CustomVariable, getLspCustomVariable, getLspDefaultPageProps } from "../logseqSetting"
import tablerIconsListJSON from './icons.json';
import logseqIconsListJSON from './iconsLogseq.json';

type iconItem = {
    n: string;
    t: string;
    u: string;
    c: string;
}

let ICON_LIST: iconItem[] = [];

export const initIconList = async () => {
    ICON_LIST = tablerIconsListJSON.filter((item: iconItem) => logseqIconsListJSON.includes(item.u));
}

/**
 * 为指定页面添加 Logseq 默认页面属性。
 * @param name 页面名称。
 */
export const addLogseqDefaultPageProps = async (name: string) => {
    try {
        // 获取 Logseq 默认页面属性。
        const page = await logseq.Editor.getPage(name);
        if (!page) {
            return
        }
        const { properties: defaultProps, visible } = await getLogseqDefaultPageProps(page);

        // 如果没有默认属性或属性为空，则不执行任何操作。
        if (!defaultProps || Object.keys(defaultProps).length === 0) {
            return;
        }
        logger.debug('addLogseqDefaultPageProps', 'properties', defaultProps, 'visible', visible);

        // 获取页面的区块树。
        const blocks = await logseq.Editor.getPageBlocksTree(name);
        const firstBlock = blocks.at(0);

        // 如果页面存在第一个区块，则更新或添加属性。
        if (firstBlock) {
            logger.debug('addLogseqDefaultPageProps update firstBlock', firstBlock)
            await Promise.all(Object.entries(defaultProps).map(([k, v]) => logseq.Editor.upsertBlockProperty(firstBlock.uuid, k, v)))
        } else {
            logger.debug('addLogseqDefaultPageProps insert firstBlock')
            // 如果页面没有区块，创建新页面并添加属性。
            page && await Promise.all(Object.entries(defaultProps).map(([k, v]) => logseq.Editor.upsertBlockProperty(page.uuid, k, v)))
            visible && await logseq.Editor.appendBlockInPage(name, '', { properties: defaultProps });
        }
    } catch (error) {
        // 显示错误消息。
        logseq.UI.showMsg(`Adding default properties to page [${name}] failed: ${error}`, 'error');
        logger.error(`Adding default properties to page [${name}] failed`, error)
    }
};

// 定义一个类型，表示一个对象，其键是字符串，值是可调用的函数，这些函数返回一个字符串。
type VariableListObject = {
    [K: string]: CustomVariable;
};

/**
 * 获取 Logseq 默认页面属性。
 * 这个函数从 LSP 获取自定义变量，并将其转换为一个对象，然后获取默认页面属性，并应用这些变量。
 */
const getLogseqDefaultPageProps = async (page: PageEntity) => {
    // 获取 LSP 自定义变量。
    const varList = await getLspCustomVariable();

    // 将变量列表转换为一个对象，其中每个变量的名称是键，变量本身是值。
    const data: VariableListObject = varList.reduce((acc, item) => {
        // @ts-ignore
        acc[item.name] = item; // 将变量添加到累加器对象中。
        return acc;
    }, {});

    // 添加额外的函数以生成随机图标。
    data.randomIcon = randomIcon;

    // 准备一个空对象来存储最终的属性。
    const objDest = {} as { [K: string]: any };

    // 从 LSP 获取默认页面属性和可见性设置。
    const { properties, visible } = await getLspDefaultPageProps();
    logger.debug('getLspDefaultPageProps', 'properties', properties, 'visible', visible);

    // 如果存在属性，应用对象模板格式化函数。
    if (properties) {
        Object.keys(properties).forEach(item => {
            // 使用对象模板格式化函数处理每个属性。 
            logger.debug('getLspDefaultPageProps', 'item', item, '{ ...data, page }', { ...data, page });

            const itemValue = objectTemplateFromat(properties[item], { ...data, page });
            // 属性值为空则忽略
            logger.debug('getLspDefaultPageProps', 'itemValue', itemValue, );

            itemValue && (objDest[item] = itemValue);
        });
        return { properties: objDest, visible };
    }

    // 如果没有属性，返回一个空对象。
    return {};
};

/**
 * 生成一个随机图标的文本表示。
 * @param page 可选的页面对象，包含页面名称。
 * @returns 返回一个随机图标的Unicode字符。
 */
const randomIcon = (page?: PageEntity): string => {
    logger.debug('randomIcon page:', page)

    if (page?.["journal?"]) {
        return ''
    }

    // 根据页面名称过滤图标列表，如果提供了页面名称，则从ICON_LIST中筛选出包含页面名称的图标。
    let icons = page?.name && ICON_LIST.filter((item: iconItem) => item.t.includes(page.name))
    if (!icons || icons?.length <= 0) {
        icons = ICON_LIST
    }

    // 从过滤后的图标列表中随机选择一个图标。
    const selectedIcon = icons[Math.floor(Math.random() * icons.length)];

    // 使用选中图标的Unicode码创建一个字符串。 
    const tempElement = document.createElement('span');
    tempElement.innerHTML = `&#x${selectedIcon.u};`;
    return tempElement.innerText;
};