import { PageEntity } from '@logseq/libs/dist/LSPlugin';
import { logger } from '../../utils/logger';
import tablerIconsListJSON from './icons.json';
import logseqIconsListJSON from './iconsLogseq.json';
import { AppConfig } from '../../data/types';
import { CustomVariable } from '../logseqSetting';
import { format } from 'date-fns';

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
export const getCustomVariables = ({ appConfig, page }: { appConfig: AppConfig, page: PageEntity }) => {

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

    return {
        ...data,
        page,
        date: format(Date.now(), appConfig.preferredDateFormat),
        time: format(Date.now(), 'HH:mm')
    }
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