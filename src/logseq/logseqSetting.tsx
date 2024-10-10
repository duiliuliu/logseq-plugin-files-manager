import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin';
import { EXTERNAL_PLUGIN_AWESOME_PROPS, i18n_DEFAULT_DELETE_FORMAT, i18n_GET_PLUGIN_CONFIG_ERROR, i18n_OPEN_PLUGN_SETTING_TOOLTIP, i18n_CUSTOMS_VARIABLE_DATE_DESC, i18n_CUSTOMS_VARIABLE_DESC, i18n_CUSTOMS_VARIABLE_RANDOMICON_DESC, i18n_CUSTOMS_VARIABLE_TIME_DESC, i18n_CUSTOMS_VARIABLE_TITLE, i18n_CUSTOMS_VARIABLE_VAR_DESC, i18n_DELETE_FORMAT_DESC, i18n_DELETE_FORMAT_TITLE, i18n_DELETE_FORMAT_VAR_DESC, i18n_PAGE_DEFAULT_PROPS_DESC, i18n_PAGE_DEFAULT_PROPS_TITLE, i18n_PAGE_DEFAULT_PROPS_VAR_DESC, i18n_PAGE_DEFAULT_PROPS_VISIBLE_DESC, i18n_PROPS_ICON_DESC, i18n_PROPS_ICON_TITLE, i18n_UI_TOOLBAR_DROPDOWN_DESC, i18n_UI_TOOLBAR_DROPDOWN_TITLE, SETTING_ROUTE, i18n_CUSTOMS_VARIABLE_TIMEOUT_DESC, i18n_CUSTOMS_VARIABLE_ERROR_HANDLER_DESC } from '../data/constants';
import getI18nConstant, { PRE_LANGUAGE } from '../i18n/utils';
import { stringToVarArr, stringToObject } from '../utils/objectUtil';
import { logger } from '../utils/logger';

interface Notification {
    previousPluginVersion: string;
    previousNotifyTime: number;
}

export interface PluginSettings {
    disabled: boolean;
    notifications: Notification;
    deleteFormart: string;
    defaultPagePropsSwitch: boolean;
    defaultPagePropsVisible: boolean;
    defaultPageProps: { properties?: { [K: string]: any }, visible?: boolean };
    customVariable: Array<CustomVariable>;
    customVariableTimeout: number;
    customVariableErrorHandler: string;
    propsIconConfig: boolean;
    enhanceUIToolbarDropdown: boolean;
}

const DEFAULT_SETTINGS = {
    disabled: false,
    notifications: {
        previousPluginVersion: '0',
        previousNotifyTime: 0
    },
    deleteFormart: getI18nConstant('en', i18n_DEFAULT_DELETE_FORMAT),
    defaultPagePropsSwitch: false,
    defaultPagePropsVisible: false,
    defaultPageProps: {},
    customVariable: [] as Array<CustomVariable>,
    customVariableTimeout: 1000,
    customVariableErrorHandler: '',
    propsIconConfig: false,
    enhanceUIToolbarDropdown: false
}


export const initLspSettingsSchema = async (lang?: string,) => {

    !lang && ({ preferredLanguage: lang } = await logseq.App.getUserConfigs())

    const schemas: SettingSchemaDesc[] = [
        // {
        //     key: 'filesManagerSettingsHeading',
        //     title: getI18nConstant(lang, i18n_DELETE_FORMAT_TITLE),
        //     description: '',
        //     type: 'heading',
        //     default: null,
        // },
        // {
        //     key: 'filesManagerSettings',
        //     title: '',
        //     type: 'string',
        //     default: getI18nConstant(lang, i18n_DEFAULT_DELETE_FORMAT),
        //     description: `${getI18nConstant(lang, i18n_DELETE_FORMAT_DESC)}
        //                   ${getI18nConstant(lang, i18n_DELETE_FORMAT_VAR_DESC)} ':\`\${name},\${date},\${time}\`'`,
        //     inputAs: undefined,
        // },
        {
            key: 'deleteFormartHeading',
            title: getI18nConstant(lang, i18n_DELETE_FORMAT_TITLE),
            description: '',
            type: 'heading',
            default: null,
        },
        {
            key: 'deleteFormart',
            title: '',
            type: 'string',
            default: getI18nConstant(lang, i18n_DEFAULT_DELETE_FORMAT),
            description: `${getI18nConstant(lang, i18n_DELETE_FORMAT_DESC)}
                          ${getI18nConstant(lang, i18n_DELETE_FORMAT_VAR_DESC)} ':\`\${name},\${date},\${time}\`'`,
            inputAs: 'textarea',
        },
        {
            key: 'defaultPagePropsHeading',
            title: getI18nConstant(lang, i18n_PAGE_DEFAULT_PROPS_TITLE),
            description: '',
            type: 'heading',
            default: null,
        },
        {
            key: 'defaultPagePropsSwitch',
            title: '',
            type: 'boolean',
            default: false,
            description: getI18nConstant(lang, i18n_PAGE_DEFAULT_PROPS_DESC),
            enumPicker: 'checkbox',
        },
        {
            key: 'defaultPagePropsVisible',
            title: '',
            type: 'boolean',
            default: false,
            description: getI18nConstant(lang, i18n_PAGE_DEFAULT_PROPS_VISIBLE_DESC),
        },
        {
            key: 'defaultPageProps',
            title: '',
            type: 'string',
            default: '{}',
            description: getI18nConstant(lang, i18n_PAGE_DEFAULT_PROPS_VAR_DESC) + ', e.g.</br>`{"createdTime":"${getDatetime()}","icon":"${randomIcon(page)}","test1":"${await testAsync()}","temperature":"${await getTemperature()}"}` ',
            inputAs: 'textarea',
        },
        {
            key: 'customVariableHeading',
            title: getI18nConstant(lang, i18n_CUSTOMS_VARIABLE_TITLE),
            description: '',
            type: 'heading',
            default: null,
        },
        {
            key: 'customVariable',
            title: '',
            type: 'string',
            default: '[function test() { return "test" },function getDatetime() { return Date.now() }]',
            description: `${getI18nConstant(lang, i18n_CUSTOMS_VARIABLE_DESC)},  e.g.</br><code> 
            [ </br>
            &nbsp; &nbsp; function test() { return 'test' },</br>
            &nbsp; &nbsp; async function testAsync() { return 'test' },</br>
            &nbsp; &nbsp; async function getTemperature() { </br>
            &nbsp; &nbsp; &nbsp; &nbsp; try { </br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; const result = await timeoutPromise(fetch('https://example.com/data'), 500); </br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; return await response.text(); </br>
            &nbsp; &nbsp; &nbsp; &nbsp; } catch (error) { </br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; return "" </br>
            &nbsp; &nbsp; &nbsp; &nbsp; } </br>
            &nbsp; &nbsp; }, </br>
            &nbsp; &nbsp; function getDatetime() { return Date.now() },</br>
            &nbsp; &nbsp; function getDatetimeSkipDaily(page) { </br>
            &nbsp; &nbsp; &nbsp; &nbsp; if (page?.["journal?"]) { </br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; return "" </br>
            &nbsp; &nbsp; &nbsp; &nbsp; } </br>
            &nbsp; &nbsp; &nbsp; &nbsp; return Date.now() </br>
            &nbsp; &nbsp; } </br>
            ] </code> , </br>
            ${getI18nConstant(lang, i18n_CUSTOMS_VARIABLE_VAR_DESC)}, e.g.</br>
            \` \${randomIcon(page)} \`,\` \${randomIcon()} \`:${getI18nConstant(lang, i18n_CUSTOMS_VARIABLE_RANDOMICON_DESC)},</br>
            \` \${date} \`:${getI18nConstant(lang, i18n_CUSTOMS_VARIABLE_DATE_DESC)},</br>
            \` \${time} \`:${getI18nConstant(lang, i18n_CUSTOMS_VARIABLE_TIME_DESC)}.
            `,
            inputAs: 'textarea',
        },
        {
            key: 'customVariableTimeout',
            title: '',
            type: 'number',
            default: 1000,
            description: getI18nConstant(lang, i18n_CUSTOMS_VARIABLE_TIMEOUT_DESC),
        },
        {
            key: 'customVariableErrorHandler',
            title: '',
            type: 'enum',
            default: '',
            description: getI18nConstant(lang, i18n_CUSTOMS_VARIABLE_ERROR_HANDLER_DESC),
            enumChoices: ['EmptyString', 'Blank space', 'eror', 'error=${error}'],
            enumPicker: 'select'
        },
        {
            key: 'propsIconHeading',
            title: getI18nConstant(lang, i18n_PROPS_ICON_TITLE),
            description: '',
            type: 'heading',
            default: null,
        },
        {
            key: 'propsIconConfig',
            title: '',
            type: 'boolean',
            default: false,
            description: getI18nConstant(lang, i18n_PROPS_ICON_DESC),
            enumPicker: 'checkbox',
        },
        {
            key: 'enhanceUIToolbarDropdownHeading',
            title: getI18nConstant(lang, i18n_UI_TOOLBAR_DROPDOWN_TITLE),
            description: '',
            type: 'heading',
            default: null,
        },
        {
            key: 'enhanceUIToolbarDropdown',
            title: '',
            type: 'boolean',
            default: false,
            description: getI18nConstant(lang, i18n_UI_TOOLBAR_DROPDOWN_DESC),
            enumPicker: 'checkbox',
        },
    ]

    logseq.useSettingsSchema(schemas)
}

export const getPluginSettings = async (): Promise<PluginSettings> => {
    const lspSettings = await logseq.settings

    if (!lspSettings) {
        return DEFAULT_SETTINGS
    }

    return {
        disabled: lspSettings.disabled,
        notifications: lspSettings.notifications,
        deleteFormart: lspSettings.deleteFormart,
        defaultPagePropsSwitch: lspSettings.defaultPagePropsSwitch,
        defaultPagePropsVisible: lspSettings.defaultPagePropsVisible,
        defaultPageProps: await getLspDefaultPageProps(lspSettings),
        customVariable: await getLspCustomVariable(lspSettings),
        customVariableTimeout: lspSettings.customVariableTimeout,
        customVariableErrorHandler: lspSettings.customVariableErrorHandler,
        propsIconConfig: await getPropsIconConfig(lspSettings),
        enhanceUIToolbarDropdown: lspSettings.enhanceUIToolbarDropdown,
    }
}

export const getLspDeleteFormat = async (lang?: string): Promise<string> => {
    const settings = await logseq.settings
    return settings?.deleteFormart ?? getI18nConstant(lang || 'en', i18n_DEFAULT_DELETE_FORMAT)
}

const getPropsIconConfig = async (lspSettings?: any) => {
    const settings = lspSettings || await logseq.settings
    const awesomePropsActive = await isAwesomePropsActive()
    const propsIconConfig = settings.propsIconConfig
    if (!awesomePropsActive && propsIconConfig) {
        // todo msg notify user
        return false
    }
    return propsIconConfig
}

const isAwesomePropsActive = async (): Promise<boolean> => {
    const awesomePropsPlugin = await logseq.App.getExternalPlugin(EXTERNAL_PLUGIN_AWESOME_PROPS)
    // @ts-ignore
    return !awesomePropsPlugin?.settings?.disabled || false
}

const getLspDefaultPageProps = async (lspSettings?: any): Promise<{ properties?: { [K: string]: any }, visible?: boolean }> => {
    const settings = lspSettings || await logseq.settings
    logger.debug('getLspDefaultPageProps start')
    if (settings?.defaultPagePropsSwitch) {
        try {
            const defaultPageProps = settings?.defaultPageProps?.trim()
            if (!defaultPageProps || defaultPageProps === '' || defaultPageProps === '{}') {
                return {}
            }
            return { properties: stringToObject(settings?.defaultPageProps), visible: settings?.defaultPagePropsVisible }
        } catch (error) {
            showGetConfigError(i18n_PAGE_DEFAULT_PROPS_TITLE, error)
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

const getLspCustomVariable = async (lspSettings?: any): Promise<Array<CustomVariable>> => {
    const settings = lspSettings || await logseq.settings
    try {
        return stringToVarArr(settings?.customVariable)
    } catch (error) {
        showGetConfigError(i18n_CUSTOMS_VARIABLE_TITLE, error)
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