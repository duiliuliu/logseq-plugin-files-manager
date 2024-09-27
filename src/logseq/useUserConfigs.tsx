import { useState, useEffect } from "react";
import i18n from "../i18n/configs";
import { mockUserConfigs } from "../mock/logseqUserCfg";
import { logger } from "../utils/logger";
import { setupFileManagerNav } from "./logseqPluginInit";
import { AppConfig } from "../data/types";
import { parseEDNString } from "edn-data";
import { USER_CONFIG_FILE } from "../data/constants";
import { initLspSettingSchema } from "./logseqSetting";

const fetchUserConfigs = async (setUserConfigs: (arg0: AppConfig) => void) => {
    logger.debug(`useUserConfigs update`)
    try {
        // 在开发环境中使用 mock 数据
        if (import.meta.env.DEV) {
            setUserConfigs(mockUserConfigs);
            i18n.changeLanguage(mockUserConfigs.preferredLanguage);
        } else {
            const userCfg = await logseq.App.getUserConfigs();

            await fetchAppConfig(userCfg)
            setUserConfigs(userCfg);
            i18n.changeLanguage(userCfg.preferredLanguage);
            document.querySelector('html')?.setAttribute('lang', userCfg.preferredLanguage);
            // logger.debug(`useUserConfigs update,userConfigs:`, userCfg)
        }
    } catch (error) {
        logger.error('Failed to fetch user configs:', error);
    }
};


const fetchAppConfig = async (appConfig: AppConfig) => {

    try {
        const script = `[:find (pull ?e [*])
            :where
            [?e :file/path ?file]
            [(= ?file "${USER_CONFIG_FILE}")]]`
        const result = await logseq.DB.datascriptQuery(script);

        // 检查 result 是否为空，或者 result 的第一个元素是否为空
        if (result && result.length > 0 && result[0] && result[0].length > 0 && result[0][0]) {
            const configObj: any = parseEDNString(result[0][0].content ?? '')
            appConfig.hiddenDir = configObj['hidden'] ?? []
            appConfig.pagesDirectory = configObj['pages-directory'] ?? 'pages'
            appConfig.journalsDirectory = configObj['journals-directory'] ?? 'journals'
            appConfig.journalFileNameFormat = configObj['journal/file-name-format'] ?? 'yyyy_MM_dd'
            appConfig.assetsDirectory = 'assets'
        } else {
            logger.error("No content found or the result is empty. file:", USER_CONFIG_FILE);
        }
    } catch (error) {
        logger.error("read config failed", 'error', error);
    }
}

// 工具函数：获取用户配置
export const useUserConfigs = (userConfigUpdated: number) => {
    const [userConfigs, setUserConfigs] = useState<AppConfig>({} as AppConfig);

    useEffect(() => {
        fetchUserConfigs(setUserConfigs);

        const graphChangeListen = (e: any) => {
            logger.debug(`onCurrentGraphChanged:${JSON.stringify(e)}`)
            fetchUserConfigs(setUserConfigs);
        };
        logseq.App.onCurrentGraphChanged(graphChangeListen);

        return () => {
            logseq.App.offCurrentGraphChanged(graphChangeListen);
        }
    }, [userConfigUpdated]);


    useEffect(() => {
        // 设置监听器以监听html元素的lang属性变化
        const observer = new MutationObserver(async mutations => {
            for (let mutation of mutations) {
                if (mutation.attributeName === 'lang') {
                    const { preferredLanguage } = await logseq.App.getUserConfigs()
                    if (preferredLanguage != userConfigs.preferredLanguage) {
                        await fetchUserConfigs(setUserConfigs)
                        await setupFileManagerNav(preferredLanguage)
                        await initLspSettingSchema(preferredLanguage)
                    }
                }
            }
        });
        observer.observe(parent.document.documentElement, { attributes: true });

        return () => {
            observer.disconnect(); // 清除MutationObserver
        }
    }, [])

    return userConfigs
};