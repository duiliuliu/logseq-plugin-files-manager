import { format } from "date-fns";
import { PARENT_MAIN_CONTAINER_ID } from "../../data/constants";
import { DB } from "../../data/db";
import { DataType } from "../../data/enums";
import { logger } from "../../utils/logger";
import { AppConfig } from "../../data/types";


let emptyJournals: string[] = []
let currentDay = -1
let graph_cache = ''
let dateFormat_cahce = ''
let days_cache = 0
let hasHiddenJournals = 0
// 定义全局的 MutationObserver 和其配置对象
let hiddenEmptyJournalObserver: MutationObserver;
let hiddenEmptyJournalObserverConfig: MutationObserverInit;

/**
 * MutationObserver的回调函数，用于处理DOM变化
 * @param mutationsList - 变化列表
 */
const hiddenEmptyJournalCallBack: MutationCallback = (mutationsList) => {
    logger.debug('hiddenEmptyJournalCallBack start')
    const route = parent?.document?.location.hash;

    if (route && (route === '#/all-journals' || route === '#/' || route === '#/homepage')) {
        if (hasHiddenJournals === emptyJournals.length && emptyJournals.length != 0) {
            return
        }
        mutationsList.forEach(async (mutation) => {
            const addedNode = mutation.addedNodes[0] as HTMLElement;
            if (addedNode && addedNode.childNodes.length) {
                await doHiddenEmptyJournal()
            }
        });
    } else {
        hasHiddenJournals = 0
    }
};

const doHiddenEmptyJournal = async () => {
    if (currentDay != new Date().getDay() || emptyJournals.length === 0) {
        currentDay = new Date().getDay()
        emptyJournals = await getEmptyJournal(graph_cache, dateFormat_cahce, days_cache)
    }

    const appContainer = parent?.document?.getElementById(PARENT_MAIN_CONTAINER_ID);
    appContainer && emptyJournals.forEach(item => {
        const id = "#" + CSS.escape(item)
        const divEl = appContainer?.querySelector(id)?.closest('div.journal-item.content') as HTMLDivElement
        if (divEl && divEl.style.display != 'none') {
            divEl.style.display = 'none';
            hasHiddenJournals++
        }
    })
}

/**
 * 优化插件下拉菜单滚动问题
 */
export const openHiddenEmptyJournal = async (appConfig: AppConfig) => {
    logger.debug('openHiddenEmptyJournal')

    if (!hiddenEmptyJournalObserver) {
        hiddenEmptyJournalObserverConfig = { childList: true, subtree: true, };
        hiddenEmptyJournalObserver = new MutationObserver(hiddenEmptyJournalCallBack);
        if (!appConfig.pluginSettings?.hiddenEmptyJournalDays) {
            return
        }
        emptyJournals = await getEmptyJournal(appConfig.currentGraph, appConfig.preferredDateFormat, appConfig.pluginSettings?.hiddenEmptyJournalDays)
        currentDay = new Date().getDay()

        await doHiddenEmptyJournal()
    }

    const appContainer = parent?.document?.getElementById(PARENT_MAIN_CONTAINER_ID);
    if (appContainer && hiddenEmptyJournalObserver) {
        logger.debug('hiddenEmptyJournalObserver observe');
        hiddenEmptyJournalObserver.observe(appContainer, hiddenEmptyJournalObserverConfig);
    }

    if (appConfig.currentGraph && appConfig.currentGraph != graph_cache) {
        graph_cache = appConfig.currentGraph
        dateFormat_cahce = appConfig.preferredDateFormat
        days_cache = appConfig.pluginSettings?.hiddenEmptyJournalDays || 14
    }
}

/**
 * 关闭优化插件下拉菜单滚动问题
 */
export const stopHiddenEmptyJournal = () => {
    emptyJournals = []
    currentDay = -1
    logger.debug('stopPropsIconObserver start')
    hiddenEmptyJournalObserver?.disconnect();
}

const getEmptyJournal = async (graph: string, dateFormat: string, days: number,) => {
    if (!graph) {
        return []
    }

    const dataType = DataType.JOURNAL.toString()
    const data = await DB.data
        // .where( { graph, dataType } )
        .where({ graph, dataType })
        .reverse()
        .limit(30)
        .sortBy('createdTime');
    const hasDataJournalSet = new Set(data.map(item => item.alias))
    const last30Days = generateLast30DaysDates(dateFormat, days,)
    const result = last30Days.filter(item => !hasDataJournalSet.has(item))
    return result;

}

const generateLast30DaysDates = (dateFormat: string, days: number,) => {
    const currentDate = new Date(); // 获取当前日期
    const dates = []; // 存储日期的数组

    // 向后构造最近30天的日期
    for (let i = 1; i < days; i++) {
        const dayDate = new Date(currentDate.getTime() - (i * 24 * 60 * 60 * 1000)); // 当前天减去i天 
        // 将日期格式化为'yyyy-MM-dd'格式并添加到数组中
        dates.push(format(dayDate, dateFormat));
    }

    return dates;
}
