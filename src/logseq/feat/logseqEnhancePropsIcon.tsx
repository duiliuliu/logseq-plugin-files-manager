import { LOG_ROUTE, PARENT_MAIN_CONTAINER_ID, PLUGIN_ROUTE, SETTING_ROUTE } from "../../data/constants";
import { AppConfig } from "../../data/types"
import { logger } from "../../utils/logger"
import { getLspPropsIconCfg } from "../logseqSetting"

const routes = [SETTING_ROUTE, PLUGIN_ROUTE, LOG_ROUTE]

export const enhanceLspPropsIcon = async (userConfigs: AppConfig) => {
    let container = parent?.document?.getElementById(PARENT_MAIN_CONTAINER_ID);

    // 定义变量来跟踪是否已经执行了首次滚动的逻辑
    let isInitialScroll = true;
    let lastScrollTop = 0;

    // 获取元素的可视高度
    const visibleHeight = container?.clientHeight ?? window.innerHeight;

    // 定义滚动触发的间隔，这里假设每个元素的高度为 elementHeight
    const scrollInterval = 2 * visibleHeight; // 两倍的可视高度

    const handleRoute = (e: { path: string; }) => {
        if (routes.includes(e.path)) {
            return
        }
        if (e.path === '/all-pages' || e.path === '/page/calendar') {
            return
        }
        isInitialScroll = true
        doEnhanceLspPropsIcon()
    }
    const handleScroll = () => {
        if (!container) return
        let currentScrollTop = container.scrollTop;
        // 检查是否是首次滚动
        if (isInitialScroll) {
            logger.debug('首次滚动触发');
            isInitialScroll = false; // 更新标志
            doEnhanceLspPropsIcon()
        } else {
            // 检查滚动距离是否至少是两个元素的可视高度
            if (Math.abs(currentScrollTop - lastScrollTop) >= scrollInterval) {
                logger.debug('滚动了至少两个元素的可视高度');
                doEnhanceLspPropsIcon()
                // 更新上次滚动的顶部位置
                lastScrollTop = currentScrollTop;
            }
        }
    }


    if ((await getLspPropsIconCfg()) && !userConfigs.propertyPagesEnabled) {
        logseq.App.onRouteChanged(handleRoute)
        container?.addEventListener('scroll', handleScroll); // 监听滚动事件

    } else {
        logseq.App.offRouteChanged(handleRoute)
        container?.removeEventListener('scroll', handleScroll); // 去除监听
    }
}

const doEnhanceLspPropsIcon = async () => {
    logger.debug('doEnhanceLspPropsIcon start')
    const nodes = parent?.document?.querySelectorAll('span.page-property-key')
    nodes?.forEach(node => node.setAttribute('data-ref', (node as HTMLSpanElement).innerText))
}