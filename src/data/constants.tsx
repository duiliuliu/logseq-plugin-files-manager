import { TabEnum } from './enums';
import { Tab } from './types';
import {
  ArticleNyTimes,
  Books,
  Cards,
  Faders,
  FileAudio,
  FileVideo,
  Images
} from '@phosphor-icons/react';

// ===================================================================================
// 普通字符串常量
// ===================================================================================

// 定义主内容容器的 ID，用于在 DOM 中定位主内容区域
export const PARENT_MAIN_CONTAINER_ID = 'main-content-container';
// 标签文本常量
export const i18n_ALL_LABEL = 'All';
export const i18n_DOCUMENTS_LABEL = 'Documents';
export const i18n_IMAGES_LABEL = 'Images';
export const i18n_VIDEOS_LABEL = 'Videos';
export const i18n_AUDIOS_LABEL = 'Audios';
export const i18n_PAGES_LABEL = 'Pages';
export const i18n_JOURNALS_LABEL = 'Journals';
export const i18n_SETTINGS_LABEL = 'Settings';

export const i18n_OPEN_FILE_MANAGER_LABEL = 'Open File Manager';
export const i18n_FILE_MANAGER_LABEL = 'File Manager';


// 搜索占位符文本
export const i18n_SEARCH_PLACEHOLDER = 'search pages';

// 页面常量
export const i18n_VIEW_CARD_MODE = 'Card View';
export const i18n_VIEW_LIST_MODE = 'List View';
export const i18n_REBUILD_DATA = 'Rebuild Data';
export const i18n_BUILDING = 'Building';

// 工具提示文本常量
export const i18n_COPY_TOOLTIP = 'Copy filepath';
export const i18n_OPEN_TOOLTIP = 'Open the folder';
export const i18n_COPY_SUCCESS = 'Copied to clipboard success';
export const i18n_OPEN_WITH_OS = 'Open the folder with the Logseq';

// 图表前缀
export const GRAPH_PREFIX = 'logseq_local_';

// ===================================================================================
// 正则常量
// ===================================================================================

// 提取常量
// 正则表达式：用于匹配路径中的 '/assets' 及其后面的所有内容
// 例如，对于路径 '/path/to/assets/some/image.png'，此正则表达式会匹配到 '/assets/some/image.png'
export const ASSETS_PATH_REGEX = /(.*\/assets)(.*)/;

// 替换路径模板
// 字符串模板：用于替换匹配到的路径
// 当使用字符串替换功能时，'$2' 代表正则表达式中第二个捕获组的内容
// 例如，如果原路径是 '/path/to/assets/some/image.png'，替换后的路径将是 '../assets/some/image.png'
export const ASSETS_REPLACE_PATH = '../assets$2';

// 正则表达式：匹配 Markdown 链接，不包括指向 '../assets/' 目录的链接
export const REG_LINK = /!\[.*\]\(([^(\.\.\/assets\/)].*)\)/g;

// 正则表达式：匹配 Markdown 中的资产（如图片）链接，包括可选的 '!' 字符
// 捕获资产的别名、文件名和扩展名
// 例如匹配：![alt text](../assets/image.png)
export const REG_ASSETS = /!?\[(.*?)\]\(\.\.\/assets\/(.*?)\.(\w+)\)/g;

// 正则表达式：匹配行首或行中的标签（以 '#' 开头的单词），捕获标签内容
// 例如匹配：#标签 或者 前言 #标签
export const REG_TAG = /(^|\s)(#\S+)(?=\s|$)/g;

// 正则表达式：用于分割字符串，匹配逗号后面紧跟的零个或多个空格，或匹配一个或多个空格
// 用于处理类似 'tag1, tag2, tag3' 的字符串，分割成 ['tag1', 'tag2', 'tag3']
export const REG_SPLIT = /,\s*|\s+/;

// 正则表达式：匹配页面路径，捕获页面名称和扩展名
export const REGEX_PAGE_PATH = /(pages|journals)\/(.*)\.(md|org)/;

// ===================================================================================
// Tab页
// ===================================================================================

/**
 * Tab 数据数组，定义了不同的标签页及其显示属性。
 * 每个标签对象包含一个键（key）、标签（label）和可选的图标（icon）。
 * 这些标签页用于在用户界面中提供导航。
 */
export const TAB_DATA_FN = (): Tab[] => {
  return [
    { key: TabEnum.ALL, label: i18n_ALL_LABEL },
    { key: TabEnum.DOCUMENTS, label: i18n_DOCUMENTS_LABEL, icon: <Books size={13} weight={'duotone'} /> },
    { key: TabEnum.IMAGES, label: i18n_IMAGES_LABEL, icon: <Images size={13} weight={'duotone'} /> },
    { key: TabEnum.VIDEOS, label: i18n_VIDEOS_LABEL, icon: <FileVideo size={13} weight={'duotone'} /> },
    { key: TabEnum.AUDIOS, label: i18n_AUDIOS_LABEL, icon: <FileAudio size={13} weight={'duotone'} /> },
    { key: TabEnum.PAGES, label: i18n_PAGES_LABEL, icon: <Cards size={13} weight={'duotone'} /> },
    { key: TabEnum.JOURNALS, label: i18n_JOURNALS_LABEL, icon: <ArticleNyTimes size={13} weight={'duotone'} /> },
    { key: TabEnum.SETTINGS, label: i18n_SETTINGS_LABEL, icon: <Faders size={13} weight={'duotone'} /> },
  ];
} 