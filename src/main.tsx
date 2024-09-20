import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/roboto';
import '@fontsource/noto-sans-jp';
import './main.css';
import '@logseq/libs';
import './i18n/configs';
import App from './App';
import { registerCommands, setupStyles, setupFileManagerNav, handleClickOutside, openFileManager, openFileManagerListener } from './logseq/logseqPluginInit';

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
  await registerCommands();
  await setupStyles();
  await setupFileManagerNav();
  await handleClickOutside();
  await renderApp();
  await openFileManagerListener()
};

if (import.meta.env.DEV) {
  renderApp();
} else {
  // 当日志序列准备就绪时，执行主函数
  logseq.ready({ openFileManager, hide() { logseq.hideMainUI(); } }, main).catch(console.error);
}

export default main;