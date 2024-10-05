import { useState, useEffect } from 'react';
import i18n from '../i18n/configs';
import { mockUserConfigs } from '../mock/logseqUserCfg';
import { logger } from '../utils/logger';
import { setupFileManagerNav } from './logseqPluginInit';
import { AppConfig } from '../data/types';
import { parseEDNString } from 'edn-data';
import { USER_CONFIG_FILE } from '../data/constants';
import { getPluginSettings, initLspSettingsSchema } from './logseqSetting';
import { enhanceLsp } from './feat/logseqEnhancePropsIcon';
import { logseq as lsp } from '../../package.json';


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
            setUserConfigs && setUserConfigs(userCfg);
            i18n.changeLanguage(userCfg.preferredLanguage);
            document.querySelector('html')?.setAttribute('lang', userCfg.preferredLanguage);
            // logger.debug(`useUserConfigs update,userConfigs:`, userCfg)
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

const fetchPluginSettings = async (setUserConfigs: any) => {
    const settings = await getPluginSettings()
    setUserConfigs((prev: AppConfig) => ({ ...prev, pluginSettings: settings }))
}

// 工具函数：获取用户配置
export const useUserConfigs = (userConfigUpdated: number) => {
    const [userConfigs, setUserConfigs] = useState<AppConfig>({} as AppConfig);


    // 用户APP配置
    useEffect(() => {
        fetchUserConfigs(setUserConfigs);
        setupFileManagerNav(userConfigs.preferredLanguage)
        initLspSettingsSchema(userConfigs.preferredLanguage)
        const graphChangeListen = (_e: any) => { fetchUserConfigs(setUserConfigs); };
        logseq.App.onCurrentGraphChanged(graphChangeListen);

        return () => {
            logseq.App.offCurrentGraphChanged(graphChangeListen);
        }
    }, [userConfigUpdated]);


    // 用户PLUGIN配置
    useEffect(() => {
        fetchPluginSettings(setUserConfigs)
        const settingListen = () => { fetchPluginSettings(setUserConfigs) }
        logseq.on('settings:changed', settingListen)

        return () => {
            logseq.off('settings:changed', settingListen)
        }
    }, [])

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
    enhanceLsp(userConfigs)

    return userConfigs
};