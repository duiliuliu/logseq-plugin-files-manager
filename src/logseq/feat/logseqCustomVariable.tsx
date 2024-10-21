import { PageEntity } from '@logseq/libs/dist/LSPlugin';
import { logger } from '../../utils/logger';
import tablerIconsListJSON from './icons.json';
import logseqIconsListJSON from './iconsLogseq.json';
import { AppConfig } from '../../data/types';
import { CustomVariable } from '../logseqSetting';
import { format } from 'date-fns';
import { asyncFuncTmpl, objectTemplateFromatAsync, timeoutPromise } from '../../utils/objectUtil';

type iconItem = {
    n: string;
    t: string;
    u: string;
    c: string;
}

// 定义一个类型，表示一个对象，其键是字符串，值是可调用的函数，这些函数返回一个字符串。
type VariableListObject = {
    [K: string]: CustomVariable;
};

let ICON_LIST: iconItem[] = [];

export const initIconList = async () => {
    ICON_LIST = tablerIconsListJSON.filter((item: iconItem) => logseqIconsListJSON.includes(item.u));
}

// 插件内置变量
// ${date}\${time}\${randomIcon()}\${randomIcon(page)}
export const getCustomVariables = ({ appConfig, page }: { appConfig: AppConfig, [K: string]: any }) => {

    if (!appConfig || !appConfig.pluginSettings) {
        return {}
    }

    // 获取 LSP 自定义变量。
    const varList = appConfig.pluginSettings.customVariable;

    // 将变量列表转换为一个对象，其中每个变量的名称是键，变量本身是值。
    const data: VariableListObject = varList.reduce((acc, item) => {
        // @ts-ignore
        acc[item.name] = item; // 将变量添加到累加器对象中。
        return acc;
    }, {});

    // 添加内部插件支持变量
    // 生成随机图标。
    data.randomIcon = randomIcon;
    data.randomIconSkipNameSpace = randomIconSkipNameSpace;

    logger.debug('getCustomVariables', appConfig)
    return {
        ...data,
        appConfig,
        page,
        date: format(Date.now(), appConfig.preferredDateFormat),
        time: format(Date.now(), 'HH:mm'),
        asyncFuncTmpl, timeoutPromise,
        selectedText
    }
}

export const selectedText = () => {
    const activeElement = parent.document.activeElement
    if (activeElement?.nodeName.toLowerCase() != "textarea") {
        return
    }

    const textarea = activeElement // @ts-ignore
    const start = textarea.selectionStart     // @ts-ignore
    const end = textarea.selectionEnd // @ts-ignore
    const before = textarea.value.substring(0, start)     // @ts-ignore
    const selection = textarea.value.substring(start, end)
    return selection
}

export const selectedOffset = () => {
    const activeElement = parent.document.activeElement
    if (activeElement?.nodeName.toLowerCase() != "textarea") {
        return
    }

    const textarea = activeElement // @ts-ignore
    return textarea.selectionStart
}



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

/**
 * 生成一个随机图标的文本表示。
 * @param page 可选的页面对象，包含页面名称。
 * @returns 返回一个随机图标的Unicode字符。
 */
const randomIconSkipNameSpace = (page?: PageEntity): string => {
    logger.debug('randomIcon page:', page)

    if (page?.["journal?"]) {
        return ''
    }
    if (page?.namespace) {
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

/**
 * 解析属性对象中的每个属性，并应用变量替换。
 * @param properties 要解析的属性对象。
 * @param varsData 变量数据对象，用于替换属性中的变量。
 * @param customVariableTimeout 自定义变量的超时时间（可选）。
 * @param customVariableErrorHandler 自定义错误处理方式（可选）。
 * @returns 解析后的属性对象。
 */
export const resolveProperties = async (
    properties: { [key: string]: any },
    varsData: { [key: string]: any },
    customVariableTimeout?: number,
    customVariableErrorHandler?: string
): Promise<{ [key: string]: any }> => {
    // 准备一个空对象来存储最终的属性。
    const resolvedProperties: { [key: string]: any } = {};
    // 并行处理所有属性。
    properties && await Promise.all(
        Object.entries(properties).map(async ([key, value]) => {
            const resolvedValue = await resolveProperty(value, varsData, customVariableTimeout, customVariableErrorHandler);
            resolvedValue && (resolvedProperties[key] = resolvedValue);
        })
    );

    deleteDatePropsWithJournal(varsData.page, resolvedProperties)
    return resolvedProperties;
};

/**
 * 解析单个属性，并应用变量替换。
 * @param propertyValue 要解析的属性值。
 * @param varsData 变量数据对象，用于替换属性中的变量。
 * @param customVariableTimeout 自定义变量的超时时间（可选）。
 * @param customVariableErrorHandler 自定义错误处理方式（可选）。
 * @returns 解析后的属性值。
 */
export const resolveProperty = async (
    propertyValue: string,
    varsData: { [key: string]: any },
    customVariableTimeout?: number,
    customVariableErrorHandler?: string
): Promise<string> => {
    let itemValue = '';
    propertyValue = propertyValue.trim()
    try {
        // 使用对象模板格式化函数处理属性值。
        propertyValue && (itemValue = await timeoutPromise(
            objectTemplateFromatAsync(propertyValue, varsData),
            customVariableTimeout
        ));
    } catch (error) {
        // 根据自定义错误处理方式处理错误。
        itemValue = handleCustomVariableError(customVariableErrorHandler, error);
    }

    return itemValue;
};

/**
 * 根据自定义错误处理方式处理错误。
 * @param customVariableErrorHandler 自定义错误处理方式。
 * @param error 捕获到的错误。
 * @returns 根据错误处理方式返回的字符串。
 */
export const handleCustomVariableError = (
    customVariableErrorHandler?: string,
    error?: Error | any
): string => {
    switch (customVariableErrorHandler) {
        case 'EmptyString':
            return '';
        case 'Blank space':
            return ' ';
        case 'error':
            return 'error';
        case 'error=${error}':
            return error ? error.message : '';
        default:
            return '';
    }
};

export const deleteDatePropsWithJournal = (pageE: PageEntity, properties: { [K: string]: any }) => {
    if (!(pageE && properties)) {
        return
    }
    if (pageE.journalDay && `${pageE.journalDay}` === format(Date.now(), 'yyyyMMdd')) {
        delete properties['date']
    }
}