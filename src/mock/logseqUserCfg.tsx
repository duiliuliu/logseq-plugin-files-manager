import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin.user';

// src/mocks.ts
export const mockUserConfigs: AppUserConfigs = {
    preferredThemeMode: 'dark', // 或 'light'
    preferredFormat: 'markdown', // 或 'org'
    preferredDateFormat: 'yyyy-MM-dd',
    preferredStartOfWeek: 'Monday', // 或 'Sunday'
    preferredLanguage: 'en', // 例如 'en', 'zh', 'ja' 等
    preferredWorkflow: 'default', // 根据应用的实际工作流命名
    currentGraph: 'logseq_graph',
    showBracket: true,
    enabledFlashcards: true,
    enabledJournals: true,
    // 其他可能的额外属性
    extraSetting: 'some value', // [key: string]: any 允许任何额外的属性
  };