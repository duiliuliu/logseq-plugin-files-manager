
import { SimpleCommandKeybinding } from "@logseq/libs/dist/LSPlugin";
import { HOME_PAGE, i18n_FILE_MANAGER_LABEL, i18n_OPEN_FILE_MANAGER_LABEL, i18n_PAGE_MENU_DELETE_PAGE, PARENT_OPEN_BUTTON_ID, PLUGIN_ROUTE, SETTING_PAGE } from "../data/constants";
import getI18nConstant from "../i18n/utils";
import { logger } from "../utils/logger";
import { deleteLogseqPage } from "./feat/logseqDeletePage";
import { fetchUserConfigs } from "./useUserConfigs";
import { showMainUI } from "./logseqUI";


// 打开文件管理器的函数
export const openFileManager = () => {
    logger.debug(`openFileManager`)
    showMainUI()
};

/**
 * 如果当前页面是 'files-manager'，则显示主 UI。
 * 
 * @returns {Promise<void>} 完成操作时解析的 Promise。
 */
export const showMainUIIfFilesManager = async (): Promise<void> => {
    // 从 Logseq 获取当前页面
    const currPage = await logseq.Editor.getCurrentPage();

    // 检查当前页面的原始名称是否为 'files-manager'
    if (currPage?.originalName === HOME_PAGE) {
        // 如果条件满足，则显示主 UI
        showMainUI()
    }
    if (currPage?.originalName === SETTING_PAGE) {
        showMainUI()
        logseq.showSettingsUI();
    }
}


// 打开文件管理器的函数
export const openFileManagerListener = () => {
    parent.document.querySelector(`#${PARENT_OPEN_BUTTON_ID}`)?.addEventListener('click', openFileManager)
};

// 注册命令到日志序列
export const registerCommands = async () => {
    const command: {
        key: string;
        keybinding: SimpleCommandKeybinding
        label: string;
    } = {
        key: 'fileManager:open', // 命令的键名
        keybinding: { binding: 'mod+shift+enter', mode: 'global' }, // 命令的快捷键
        label: i18n_OPEN_FILE_MANAGER_LABEL, // 命令显示的标签
    };
    logseq.App.registerCommandPalette(command, openFileManager);
};


// 设置样式
export const setupStyles = () => {
    logseq.provideStyle(`
      @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
    `);
    logseq.setMainUIInlineStyle({
        zIndex: 1,
    });


    logseq.provideStyle(String.raw`
        /* Tooltip container */

        .tooltip {
        position: relative;
        display: inline-block;
        border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
        cursor: pointer; /* 鼠标指针变为手形 */
        }

        /* Tooltip text */
        .tooltip .tooltiptext {
        visibility: hidden; 
        background-color: black;
        color: #fff;
        text-align: center;
        padding: 5px 0;
        border-radius: 6px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2); /* 轻微的阴影效果 */
        
        /* Position the tooltip text - see examples below! */
        position: absolute;
        z-index: 3;

        /* 动画效果 */
        transition: opacity 0.3s;
        opacity: 0;

        /* 宽度设置 */
        min-width: 120px; /* 设置最小宽度 */
        max-width: 60vw; /* 设置最大宽度为视口宽度的60% */
        width: max-content; /* 宽度根据内容自动调整 */
        word-wrap: break-word; /* 确保长单词可以换行 */
        } 

        /* Show the tooltip text when you mouse over the tooltip container */
        .tooltip:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
        }
     `)
};

export const setupPageMenuIten = async (lang?: string) => {
    !lang && ({ preferredLanguage: lang } = await logseq.App.getUserConfigs())
    logseq.App.registerPageMenuItem(i18n_PAGE_MENU_DELETE_PAGE, async ({ page: pageName }) => { deleteLogseqPage(pageName, await fetchUserConfigs()) })
}


// 设置文件管理器导航
export const setupFileManagerNav = async (lang?: string) => {
    !lang && ({ preferredLanguage: lang } = await logseq.App.getUserConfigs())
    const fileManagerDiv = document.createElement('div');
    fileManagerDiv.innerHTML = `
      <a href="#${PLUGIN_ROUTE}" class='item group flex items-center text-sm font-medium rounded-md'>
        <span class='ui__icon ti ls-icon-calendar'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'><rect width='20' height='20' fill='none'/><rect x='32' y='48' width='192' height='160' rx='8' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='16'/><circle cx='68' cy='84' r='12'/><circle cx='108' cy='84' r='12'/></svg>      </span>
        <span class='flex-1'>${getI18nConstant(lang, i18n_FILE_MANAGER_LABEL)}</span>
      </a>
    `;
    fileManagerDiv.className = `fileManager-nav`;
    fileManagerDiv.addEventListener('click', openFileManager);

    const navHeader = window.parent.document.querySelector('.nav-header');
    if (navHeader) {
        const fileManagerNav = navHeader.querySelector('.fileManager-nav');
        if (fileManagerNav) navHeader.removeChild(fileManagerNav);
        navHeader.insertBefore(fileManagerDiv, navHeader.lastChild);
    }
};


