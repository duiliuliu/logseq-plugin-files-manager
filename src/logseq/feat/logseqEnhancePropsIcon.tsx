import { useEffect } from "react";
import { CALENDAR_ROUTE, DATA_REF_SELECTOR, ICON_PARENT_STYLE_KEY, LOG_ROUTE, PARENT_MAIN_CONTAINER_ID, PLUGIN_ROUTE, SETTING_ROUTE } from "../../data/constants";
import { AppConfig } from "../../data/types"
import { logger } from "../../utils/logger"

// 定义全局的 MutationObserver 和其配置对象
let propsIconObserver: MutationObserver;
let propsIconObserverConfig: MutationObserverInit;

/**
 * 增强LSP插件图标显示
 * @param userConfigs 用户配置对象
 */
export const enhanceLsp = (userConfigs: AppConfig) => {
    logger.debug('enhanceLspPropsIcon start')
    const settings = userConfigs?.pluginSettings

    useEffect(() => {
        // 如果启用了propsIconConfig并且没有启用propertyPages，则初始化并运行观察者
        if (settings?.propsIconConfig && !userConfigs.propertyPagesEnable) {
            initPropsIconObserver()
            runPropsIconObserver()
        }
        return () => { stopPropsIconObserver() }
    }, [userConfigs.propertyPagesEnabled, settings?.propsIconConfig])

    useEffect(() => {
        if (settings?.enhanceUIToolbarDropdown) {
            runEnhanceLspPluginDropdown()
        }
        return () => { stopEnhanceLspPluginDropdown() }
    }, [settings?.enhanceUIToolbarDropdown])

    return
}

/**
 * 初始化属性图标观察者
 */
const initPropsIconObserver = () => {
    if (!propsIconObserver) {
        propsIconObserverConfig = { childList: true };
        propsIconObserver = new MutationObserver(PropsIconObserverCallback);
    }
}

/**
 * 运行属性图标观察者
 */
const runPropsIconObserver = () => {
    logger.debug('runPropsIconObserver start');
    const appContainer = parent?.document?.getElementById(PARENT_MAIN_CONTAINER_ID);
    if (appContainer && propsIconObserver) {
        propsIconObserver.observe(appContainer, propsIconObserverConfig);
    }
}

/**
 * 停止属性图标观察者
 */
const stopPropsIconObserver = () => {
    propsIconObserver?.disconnect();
}

const validRoutes = new Set([PLUGIN_ROUTE, SETTING_ROUTE, LOG_ROUTE, CALENDAR_ROUTE]);

/**
 * MutationObserver的回调函数，用于处理DOM变化
 * @param mutationsList - 变化列表
 */
const PropsIconObserverCallback: MutationCallback = (mutationsList) => {
    const route = parent?.document?.location.hash;
    if (route && route.startsWith('#/page') && !validRoutes.has(route.slice(1))) {
        requestAnimationFrame(() => {
            mutationsList.forEach((mutation) => {
                const addedNode = mutation.addedNodes[0] as HTMLElement;
                if (addedNode && addedNode.childNodes.length) {
                    const nodes = Array.from(addedNode.querySelectorAll(DATA_REF_SELECTOR));
                    // 为每个节点设置data-ref属性
                    nodes.forEach((node) => node.setAttribute('data-ref', (node as HTMLSpanElement).innerText));
                }
            });
        });
    }
};

/**
 * 优化插件下拉菜单滚动问题
 */
const runEnhanceLspPluginDropdown = () => {
    logger.debug('runEnhanceLspPluginDropdown')
    const style = `
    div.relative.ui__dropdown-trigger.toolbar-plugins-manager-trigger > div.dropdown-wrapper {
        overflow-y: auto;
        min-height: 50px;
    }
    `;
    if (!document.querySelector(`style[data-injected-style^=${ICON_PARENT_STYLE_KEY}]`)) {
        logseq.provideStyle({ key: `${ICON_PARENT_STYLE_KEY}`, style: style });
    }
}

/**
 * 关闭优化插件下拉菜单滚动问题
 */
const stopEnhanceLspPluginDropdown = () => {
    const node = parent?.document?.head.querySelector(`style[data-injected-style^="${ICON_PARENT_STYLE_KEY}"]`)
    node && node.remove()
}
