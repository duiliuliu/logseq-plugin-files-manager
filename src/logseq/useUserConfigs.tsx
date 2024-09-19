import { AppUserConfigs } from "@logseq/libs/dist/LSPlugin.user";
import { useState, useEffect } from "react";
import i18n from "../i18n/configs";
import { mockUserConfigs } from "../mock/logseqUserCfg";
import { logger } from "../utils/logger";
import { refreshLogseqInit } from "./logseqPluginInit";

// 工具函数：获取用户配置
export const useUserConfigs = () => {
    const [userConfigs, setUserConfigs] = useState<AppUserConfigs>({} as AppUserConfigs);

    const fetchUserConfigs = async () => {
        logger.debug(`useUserConfigs update`)
        try {
            // 在开发环境中使用 mock 数据
            if (import.meta.env.DEV) {
                setUserConfigs(mockUserConfigs);
                i18n.changeLanguage(mockUserConfigs.preferredLanguage);
            } else {
                const userCfg = await logseq.App.getUserConfigs();
                setUserConfigs(userCfg);
                i18n.changeLanguage(userCfg.preferredLanguage);
                document.querySelector('html')?.setAttribute('lang', userCfg.preferredLanguage);
                logger.debug(`useUserConfigs update,userConfigs:${JSON.stringify(userCfg)}`)
            }
        } catch (error) {
            logger.error('Failed to fetch user configs:', error);
        }
    };

    useEffect(() => {
        fetchUserConfigs();

        const listen = (e: any) => {
            logger.debug(`onCurrentGraphChanged:${JSON.stringify(e)}`)
            fetchUserConfigs();
        };
        logseq.App.onCurrentGraphChanged(listen);

        // 设置监听器以监听html元素的lang属性变化
        const observer = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                if (mutation.attributeName === 'lang') {
                    logger.debug('Language changed', mutation);
                    fetchUserConfigs()
                    refreshLogseqInit()
                }
            }
        });
        observer.observe(parent.document.documentElement, { attributes: true });

        return () => {
            logseq.App.offCurrentGraphChanged(listen);
            observer.disconnect(); // 清除MutationObserver
        }
    }, []);

    return userConfigs
};