import { CALENDAR_ROUTE, DATA_REF_SELECTOR, ICON_PARENT_STYLE_KEY, LOG_ROUTE, PARENT_MAIN_CONTAINER_ID, PLUGIN_ROUTE, SETTING_ROUTE } from "../../data/constants";
import { logger } from "../../utils/logger"

// 定义全局的 MutationObserver 和其配置对象
let propsIconObserver: MutationObserver;
let propsIconObserverConfig: MutationObserverInit;

/**
 * 初始化属性图标观察者
 */
export const initPropsIconObserver = () => {
    if (!propsIconObserver) {
        logger.debug('initPropsIconObserver start');
        propsIconObserverConfig = { childList: true, subtree: true, };
        propsIconObserver = new MutationObserver(PropsIconObserverCallback);
        logger.debug('initPropsIconObserver end');
    }
}

/**
 * 运行属性图标观察者
 */
export const runPropsIconObserver = () => {
    logger.debug('runPropsIconObserver start');
    const appContainer = parent?.document?.getElementById(PARENT_MAIN_CONTAINER_ID);
    if (appContainer && propsIconObserver) {
        logger.debug('runPropsIconObserver observe');
        propsIconObserver.observe(appContainer, propsIconObserverConfig);
    }
}

/**
 * 停止属性图标观察者
 */
export const stopPropsIconObserver = () => {
    logger.debug('stopPropsIconObserver start')
    propsIconObserver?.disconnect();
}

export const inValidRoutes = new Set([PLUGIN_ROUTE, SETTING_ROUTE, LOG_ROUTE, CALENDAR_ROUTE]);
export const validRoutes = new Set(['#/', '#/homepage', '#/home_page', '#/all-journals']);

/**
 * MutationObserver的回调函数，用于处理DOM变化
 * @param mutationsList - 变化列表
 */
export const PropsIconObserverCallback: MutationCallback = (mutationsList) => {
    logger.debug('PropsIconObserverCallback start')
    const route = parent?.document?.location.hash;
    logger.debug(`PropsIconObserverCallback route:${route}`)
    if (route && (route.startsWith('#/page') || validRoutes.has(route)) && !inValidRoutes.has(route.slice(1))) {
        mutationsList.forEach((mutation) => {
            const addedNode = mutation.addedNodes[0] as HTMLElement;
            if (addedNode && addedNode.childNodes.length) {
                const nodes = Array.from(addedNode.querySelectorAll(DATA_REF_SELECTOR));
                // 为每个节点设置data-ref属性
                nodes.forEach((node) => node.setAttribute('data-ref', (node as HTMLSpanElement).innerText));
            }
        });
    }
};

/**
 * 优化插件下拉菜单滚动问题
 */
export const runEnhanceLspPluginDropdown = () => {
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
export const stopEnhanceLspPluginDropdown = () => {
    try {
        logger.debug('stopEnhanceLspPluginDropdown')
        const node = parent?.document?.head.querySelector(`style[data-injected-style^="${ICON_PARENT_STYLE_KEY}"]`)
        node && node.remove()
    } catch (error) {

    }
}
