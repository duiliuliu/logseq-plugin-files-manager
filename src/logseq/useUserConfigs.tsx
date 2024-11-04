import { useState, useEffect } from 'react';
import i18n from '../i18n/configs';
import { mockUserConfigs } from '../mock/logseqUserCfg';
import { logger } from '../utils/logger';
import { setupFileManagerNav } from './logseqPluginInit';
import { AppConfig } from '../data/types';
import { parseEDNString } from 'edn-data';
import { USER_CONFIG_FILE } from '../data/constants';
import { getPluginSettings, initLspSettingsSchema } from './logseqSetting';
import { initPropsIconObserver, runEnhanceLspPluginDropdown, runPropsIconObserver, stopEnhanceLspPluginDropdown, stopPropsIconObserver } from './feat/logseqEnhancePropsIcon';
import { logseq as lsp } from '../../package.json';
import { initMetaBlock } from './feat/logseqMetaBlock';
import { openHiddenEmptyJournal, stopHiddenEmptyJournal } from './feat/logseqHiddenEmptyJournal';
import { initTicketFeat } from './feat/logseqTicketCard';

let gloableUserConfig: AppConfig

export const getGloableUserConfigs = () => {
    return gloableUserConfig
}

export const fetchUserConfigs = async (setUserConfigs?: (arg0: AppConfig) => void): Promise<AppConfig> => {
    logger.debug(`useUserConfigs update`)
    try {
        // 在开发环境中使用 mock 数据
        if (import.meta.env.DEV) {
            setUserConfigs && setUserConfigs(mockUserConfigs);
            i18n.changeLanguage(mockUserConfigs.preferredLanguage);
            return mockUserConfigs
        } else {
            const userCfg = await logseq.App.getUserConfigs();
            await fetchAppConfig(userCfg)
            userCfg && (userCfg.pluginSettings = await getPluginSettings())
            i18n.changeLanguage(userCfg.preferredLanguage);
            document.querySelector('html')?.setAttribute('lang', userCfg.preferredLanguage);

            userCfg && (gloableUserConfig = userCfg)
            setUserConfigs && userCfg && setUserConfigs(userCfg);
            return userCfg
        }
    } catch (error) {
        logger.error('Failed to fetch user configs:', error);
    }
    return {} as AppConfig
};

const fetchAppConfig = async (appConfig: AppConfig) => {
    appConfig.pluginId = lsp.id
    appConfig.pluginTitle = lsp.title

    try {
        const script = `[:find (pull ?e [*])
            :where
            [?e :file/path "${USER_CONFIG_FILE}"]]` // **注意**：这儿必须用双引号
        const result = await logseq.DB.datascriptQuery(script);

        // 检查 result 是否为空，或者 result 的第一个元素是否为空
        if (result && result.length > 0 && result[0] && result[0].length > 0 && result[0][0]) {
            const configObj: any = parseEDNString(result[0][0].content ?? '', { mapAs: 'object', keywordAs: 'string' })
            appConfig.hiddenDir = configObj['hidden'] ?? []
            appConfig.pagesDirectory = configObj['pages-directory'] ?? 'pages'
            appConfig.journalsDirectory = configObj['journals-directory'] ?? 'journals'
            appConfig.journalFileNameFormat = configObj['journal/file-name-format'] ?? 'yyyy_MM_dd'
            appConfig.assetsDirectory = 'assets'
            appConfig.propertyPagesEnabled = configObj['property-pages/enabled?'] ?? true
            appConfig.defaultJournalTemplateName = (configObj['default-templates'] ?? {}).journals ?? ''
        } else {
            logger.error('No content found or the result is empty. file:', USER_CONFIG_FILE);
        }
    } catch (error) {
        logger.error('read config failed', 'error', error);
    }
}

// 工具函数：获取用户配置
export const useUserConfigs = (userConfigUpdated: number) => {
    const [userConfigs, setUserConfigs] = useState<AppConfig>({} as AppConfig);

    // 用户APP配置
    useEffect(() => {
        const init = async () => {
            const userCfg = await fetchUserConfigs(setUserConfigs);
            logger.debug('userCfg', userCfg, userConfigs)
            setupFileManagerNav(userCfg.preferredLanguage)
            initLspSettingsSchema(userCfg.preferredLanguage)
            initTicketFeat(userCfg)
        }

        init()
        logseq.App.onCurrentGraphChanged(init);
        return () => {
            logseq.App.offCurrentGraphChanged(init);
        }
    }, [userConfigUpdated]);


    // 用户PLUGIN配置
    useEffect(() => {
        const settingListen = async () => {
            const settings = await getPluginSettings()
            !gloableUserConfig && (gloableUserConfig = userConfigs)
            gloableUserConfig && (gloableUserConfig.pluginSettings = settings)
            setUserConfigs((prev: AppConfig) => ({ ...prev, pluginSettings: settings }))
        }
        logseq.on('settings:changed', settingListen)
        return () => {
            logseq.off('settings:changed', settingListen)
        }
    }, [])


    // 用户自定义命令
    useEffect(() => {
        if (userConfigs.preferredDateFormat) {
            const commands = initMetaBlock(userConfigs)
            logseq.updateSettings({ metaBlockCustomsCommands: commands })
        }
    }, [
        userConfigs.preferredDateFormat,
        userConfigs?.pluginSettings?.customVariable.length,
        userConfigs?.pluginSettings?.customVariableErrorHandler,
        userConfigs?.pluginSettings?.customVariableTimeout,
        userConfigs?.pluginSettings?.metaBlockCustomsCommandConfig?.length
    ])


    // 用户语言配置
    useEffect(() => {
        // 设置监听器以监听html元素的lang属性变化
        const observer = new MutationObserver(async mutations => {
            for (let mutation of mutations) {
                if (mutation.attributeName === 'lang') {
                    const { preferredLanguage } = await logseq.App.getUserConfigs()
                    if (preferredLanguage != userConfigs.preferredLanguage) {
                        await fetchUserConfigs(setUserConfigs)
                        await setupFileManagerNav(preferredLanguage)
                        await initLspSettingsSchema(preferredLanguage)
                    }
                }
            }
        });
        observer.observe(parent.document.documentElement, { attributes: true });

        return () => {
            observer.disconnect(); // 清除MutationObserver
        }
    }, [])

    // 优化awesome props
    useEffect(() => {
        const settings = userConfigs?.pluginSettings

        // 如果启用了propsIconConfig并且没有启用propertyPages，则初始化并运行观察者
        if (settings?.propsIconConfig && !userConfigs.propertyPagesEnable) {
            initPropsIconObserver()
            runPropsIconObserver()
        } else {
            stopPropsIconObserver()
        }
    }, [userConfigs.propertyPagesEnabled, userConfigs?.pluginSettings?.propsIconConfig])

    // 隐藏空白journals
    useEffect(() => {
        const settings = userConfigs?.pluginSettings
        if (settings?.hiddenEmptyJournalsSwith && userConfigs.preferredDateFormat) {
            openHiddenEmptyJournal(userConfigs)
        } else {
            stopHiddenEmptyJournal()
        }
    }, [userConfigs.preferredDateFormat, userConfigs?.pluginSettings?.hiddenEmptyJournalsSwith, userConfigs?.pluginSettings?.hiddenEmptyJournalDays])

    // 优化工具栏下拉框
    useEffect(() => {
        const settings = userConfigs?.pluginSettings

        if (settings?.enhanceUIToolbarDropdown) {
            runEnhanceLspPluginDropdown()
        }
        return () => { stopEnhanceLspPluginDropdown() }
    }, [userConfigs?.pluginSettings?.enhanceUIToolbarDropdown])

    return userConfigs
};