import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/roboto';
import '@fontsource/noto-sans-jp';
import './main.css';
import '@logseq/libs';
import './i18n/configs';
import App from './App';
import { registerCommands, setupStyles, setupFileManagerNav, openFileManager, openFileManagerListener, showMainUIIfFilesManager, setupPageMenuIten } from './logseq/logseqPluginInit';
import { version as __VERSION } from '../package.json'
import { PLUGIN_ROUTE, SETTING_ROUTE } from './data/constants';
import { initLogCfg } from './logseq/feat/logseqAddOptLog';
import { initLspSettingsSchema } from './logseq/logseqSetting';
import { logger } from './utils/logger';
import { initIconList } from './logseq/feat/logseqCustomVariable';

// 渲染 React 应用
export const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// 主函数，初始化并注册必要的命令和样式
const main = async (_e: any) => {

  logseq.App.onRouteChanged((e) => {
    logger.debug('onRouteChanged', e)

    if (e.path === PLUGIN_ROUTE) {
      logseq.showMainUI()
    } else if (e.path === SETTING_ROUTE) {
      logseq.showSettingsUI()
      logseq.showMainUI()
    } else {
      logseq.hideMainUI()
    }
  })

  initIconList()
  await registerCommands();
  await setupStyles();
  await setupFileManagerNav();
  setupPageMenuIten();
  initLspSettingsSchema();
  renderApp();
  openFileManagerListener();
  await showMainUIIfFilesManager();
  await initLogCfg(true)

 


};

if (import.meta.env.DEV) {
  renderApp();
} else {
  // 当日志序列准备就绪时，执行主函数
  logseq.ready({ openFileManager, hide() { logseq.hideMainUI(); } }, main).catch(console.error);
}

export default main;
