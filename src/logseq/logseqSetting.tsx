import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin';
import { i18n_DEFAULT_DELETE_FORMAT, i18n_GET_PLUGIN_CONFIG_ERROR, i18n_OPEN_PLUGN_SETTING_TOOLTIP, i8n_CUSTOMS_VARIABLE_DESC, i8n_CUSTOMS_VARIABLE_TITLE, i8n_CUSTOMS_VARIABLE_VAR_DESC, i8n_DELETE_FORMAT_DESC, i8n_DELETE_FORMAT_TITLE, i8n_DELETE_FORMAT_VAR_DESC, i8n_PAGE_DEFAULT_PROPS_DESC, i8n_PAGE_DEFAULT_PROPS_TITLE, i8n_PAGE_DEFAULT_PROPS_VAR_DESC, i8n_PAGE_DEFAULT_PROPS_VISIBLE_DESC, i8n_PROPS_ICON_DESC, i8n_PROPS_ICON_TITLE, SETTING_ROUTE } from '../data/constants';
import getI18nConstant, { PRE_LANGUAGE } from '../i18n/utils';
import { stringToVarArr, stringToObject } from '../utils/objectUtil';
import { logger } from '../utils/logger';

interface Notification {
    previousPluginVersion: string;
    previousNotifyTime: number;
}

export interface Settings {
    disabled: boolean;
    notifications: Notification;
    deleteFormart: string
    propsIconConfig: boolean
    defaultPagePropsSwitch: boolean,
    defaultPageProps: Object
    customVariable: Array<CustomVariable>
}


export const initLspSettingSchema = async (lang?: string,) => {

    !lang && ({ preferredLanguage: lang } = await logseq.App.getUserConfigs())
 
    const schemas: SettingSchemaDesc[] = [
        {
            key: 'deleteFormartHeading',
            title: getI18nConstant(lang, i8n_DELETE_FORMAT_TITLE),
            description: '',
            type: 'heading',
            default: null,
        },
        {
            key: 'deleteFormart',
            title: '',
            type: 'string',
            default: getI18nConstant(lang, i18n_DEFAULT_DELETE_FORMAT),
            description: getI18nConstant(lang, i8n_DELETE_FORMAT_DESC) + ',' + getI18nConstant(lang, i8n_DELETE_FORMAT_VAR_DESC) + ':`${name},${date},${time}`',
            inputAs: 'textarea',
        },
        {
            key: 'defaultPagePropsHeading',
            title: getI18nConstant(lang, i8n_PAGE_DEFAULT_PROPS_TITLE),
            description: '',
            type: 'heading',
            default: null,
        },
        {
            key: 'defaultPagePropsSwitch',
            title: '',
            type: 'boolean',
            default: false,
            description: getI18nConstant(lang, i8n_PAGE_DEFAULT_PROPS_DESC) + ', ' + getI18nConstant(lang, i8n_PAGE_DEFAULT_PROPS_VAR_DESC) + '',
            enumPicker: 'checkbox',
        },
        {
            key: 'defaultPagePropsVisible',
            title: '',
            type: 'boolean',
            default: false,
            description: getI18nConstant(lang, i8n_PAGE_DEFAULT_PROPS_VISIBLE_DESC),
        },
        {
            key: 'defaultPageProps',
            title: '',
            type: 'string',
            default: '{}',
            description: ' e.g.: {"createdTime":"${getDatetime()}"}',
            inputAs: 'textarea',
        },
        {
            key: 'customVariableHeading',
            title: getI18nConstant(lang, i8n_CUSTOMS_VARIABLE_TITLE),
            description: '',
            type: 'heading',
            default: null,
        },
        {
            key: 'customVariable',
            title: '',
            type: 'string',
            default: '[function test() { return "test" },function getDatetime() { return Date.now() }]',
            description: `${getI18nConstant(lang, i8n_CUSTOMS_VARIABLE_DESC)},  e.g.\` 
            [
                function test() { return 'test' },
                function getDatetime() { return Date.now() }
            ] \` 
            , ${getI18nConstant(lang, i8n_CUSTOMS_VARIABLE_VAR_DESC)}, e.g.\` \${randomIcon(page)} \`
            `,
            inputAs: 'textarea',
        },
        {
            key: 'propsIconHeading',
            title: getI18nConstant(lang, i8n_PROPS_ICON_TITLE),
            description: '',
            type: 'heading',
            default: null,
        },
        {
            key: 'propsIconConfig',
            title: '',
            type: 'boolean',
            default: false,
            description: getI18nConstant(lang, i8n_PROPS_ICON_DESC),
            enumPicker: 'checkbox',
        },
    ]

    logseq.useSettingsSchema(schemas)
}


export const getLspDeleteFormat = async (lang?: string): Promise<string> => {
    const setting = await logseq.settings
    return setting?.deleteFormart ?? getI18nConstant(lang || 'en', i18n_DEFAULT_DELETE_FORMAT)
}

export const getLspPropsIconCfg = async (): Promise<boolean> => {
    const setting = await logseq.settings
    return setting?.propsIconConfig
}

export const getLspDefaultPageProps = async (): Promise<{ properties?: { [K: string]: any }, visible?: boolean }> => {
    const setting = await logseq.settings
    logger.debug('getLspDefaultPageProps start', 'setting', setting)
    if (setting?.defaultPagePropsSwitch) {
        try {
            const defaultPageProps = setting?.defaultPageProps?.trim()
            if (!defaultPageProps || defaultPageProps === '' || defaultPageProps === '{}') {
                return {}
            }
            return { properties: stringToObject(setting?.defaultPageProps), visible: setting?.defaultPagePropsVisible }
        } catch (error) {
            showGetConfigError(i8n_PAGE_DEFAULT_PROPS_TITLE, error)
            return {}
        }
    }
    return {}
}

/**
 * 自定义变量类型，用于动态生成字符串值。
 * 这种类型的函数可以根据输入参数生成一个字符串，
 * 或者返回一个对象，该对象包含一个字符串值和一个布尔值，
 * 指示是否在值为空时跳过写入操作。
 * @param input - 传递给自定义变量函数的可选参数，用于生成字符串值。
 * @returns 如果有值则返回字符串，否则返回一个对象，
 * 对象包含字符串值和是否跳过写入的布尔标志。
 */
export type CustomVariable = (input?: any) => string;

export const getLspCustomVariable = async (): Promise<Array<CustomVariable>> => {
    const setting = await logseq.settings
    try {
        return stringToVarArr(setting?.customVariable)
    } catch (error) {
        showGetConfigError(i8n_CUSTOMS_VARIABLE_TITLE, error)
        return []
    }
    return []
}

const showGetConfigError = (title: string, error: any) => {
    const lang = PRE_LANGUAGE
    logseq.UI.showMsg(`[:p "【${getI18nConstant(lang, title)}】" 
    [:span "${getI18nConstant(lang, i18n_GET_PLUGIN_CONFIG_ERROR)}" ] [:br]
    [:span "error:${error}"] [:br]
    [:a {:href "#${SETTING_ROUTE}"} "${getI18nConstant(lang, i18n_OPEN_PLUGN_SETTING_TOOLTIP)}"]
                            ]`, 'error')
}