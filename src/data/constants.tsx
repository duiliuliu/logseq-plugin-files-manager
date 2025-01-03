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

export const DELETE_ASSET_VERSION = '2'
export const DELETE_ASSET_VERSION_NEED_DIR_HANDLER_FN = () => DELETE_ASSET_VERSION != '2'


// 定义主内容容器的 ID，用于在 DOM 中定位主内容区域
export const PARENT_MAIN_CONTAINER_ID = 'main-content-container';
export const PARENT_OPEN_BUTTON_ID = 'files-manager-open'
export const PARENT_BACK_TOP = 'kef-tocgen-backtop'
export const PARENT_BACK_BOTTOM = 'kef-tocgen-godown' // Deprecate，该问题是为正确使用 logseq-another-embed 插件导致
export const EXTERNAL_PLUGIN_AWESOME_PROPS = 'logseq-awesome-props'
export const DATA_REF_SELECTOR = 'span.page-property-key:not([data-ref]):not(.page-ref)'
export const ICON_PARENT_STYLE_KEY = 'icon-enhance-lsp-filesm'

export const PLUGIN_ROUTE = '/page/files-manager'
export const SETTING_ROUTE = '/page/files-manager-setting'
export const LOG_ROUTE = '/page/files-manager-log'
export const CALENDAR_ROUTE = '/page/calendar'

export const LOG_PAGE = 'files-manager-log';
export const HOME_PAGE = 'files-manager';
export const SETTING_PAGE = 'files-manager-setting';

export const OPERATE_SUCCESS = 'success'
export const OPERATE_FAILED = 'failed'

export const DEFAULT_DELETE_FORMAT = '<div class="tooltip"><s>${name}</s><span class="tooltiptext">${name} has deledted in time ${date} ${time}</span> </div>'

// 图表前缀
export const GRAPH_PREFIX = 'logseq_local_';
export const USER_CONFIG_FILE = 'logseq/config.edn'

// 标签文本常量
export const __i18n_LOAD_MARK = 'i18n_mark'; // 1
export const i18n_ALL_LABEL = 'All';
export const i18n_DOCUMENTS_LABEL = 'Documents';
export const i18n_IMAGES_LABEL = 'Images';
export const i18n_VIDEOS_LABEL = 'Videos';
export const i18n_AUDIOS_LABEL = 'Audios';
export const i18n_PAGES_LABEL = 'Pages';
export const i18n_JOURNALS_LABEL = 'Journals';
export const i18n_SETTINGS_LABEL = 'Settings';

export const i18n_OPEN_FILE_MANAGER_LABEL = 'Open File Manager'; // Open Files Manager
export const i18n_FILE_MANAGER_LABEL = 'File Manager'; // Files Manager
export const i18n_FILE_MANAGER_FEATURE = 'File Manager Feature'; // 本插件专为提高您管理日常文档和附件的效率而设计，帮助您轻松处理和组织与Logseq相关的文件。
export const i18n_FILE_MANAGER_CHANGE_LOG = 'File Manager Change Log' // 新插件版本引入了许多新功能。查看详情
export const i18n_FILE_MANAGER_CHANGE_LOG_LINK = 'File Manager Change Log Link' // https://github.com/duiliuliu/logseq-plugin-files-manager/releases

export const i18n_OPEN_FILE_MANAGER_TIP = 'Click here' // 👉👉请点击这儿 
export const i18n_FILE_MANAGER_USE_TIP = 'Quickly use the plugin' // 快速使用插件

// 搜索占位符文本
export const i18n_SEARCH_PLACEHOLDER = 'Search pages';

// 页面常量
export const i18n_VIEW_CARD_MODE = 'Card View';
export const i18n_VIEW_LIST_MODE = 'List View';
export const i18n_REBUILD_DATA = 'Rebuild Data';
export const i18n_BUILDING = 'Building';

// 工具提示文本常量
export const i18n_AUTHORIZE = 'Authorize';
export const i18n_LOG_TOOLTIP = 'View log';
export const i18n_COPY_PATH_TOOLTIP = 'Copy block';
export const i18n_COPY_TITLE_TOOLTIP = 'Copy title';
export const i18n_PREVIEW_TOOLTIP = 'Preview file';
export const i18n_DEV_DATA_INFO = 'Dev show data info';
export const i18n_OPEN_FILE_TOOLTIP = 'Open the file';
export const i18n_OPEN_FILE_WITH_DEFAULT_TOOLTIP = 'Open the file with default app';
export const i18n_OPEN_IN_SIDEBAR_TOOLTIP = 'Open in sidebar';
export const i18n_OPEN_FOLDER_TOOLTIP = 'Open the folder';
export const i18n_OPEN_FOLDER_ERROR = 'Open the folder failed';
export const i18n_DELETE_TOOLTIP = 'Delete the file';
export const i18n_RENAME_TOOLTIP = 'Rename the file';
export const i18n_OPEN_PLUGN_SETTING_TOOLTIP = 'Open plugin setting';
export const i18n_DELETE_SUCCESS = 'Delete the file success';
export const i18n_DELETE_ERROR = 'Delete the file failed';
export const i18n_FILE_DENY = 'Deny the file operate'; // The request is not allowed by the user agent
export const i18n_COPY_SUCCESS = 'Copied to clipboard success';
export const i18n_OPEN_WITH_OS = 'Open the folder with the Logseq';
export const i18n_AUTHORIZE_TOOLTIP = 'Authorize Tip' //请点击选择logseq文档目录进行授权,授权后文件会进行索引操作,请耐心等待片刻
export const i18n_AUTHORIZE_TOOLTIP_PATH = 'Authorize Tip PATH' //您的Logseq路劲
export const i18n_HERE = 'Here'; // 点击这儿
export const i18n_PAGE_MENU_DELETE_PAGE = 'Delete page with files-manager'


// 配置
export const i18n_GET_PLUGIN_CONFIG_ERROR = 'Get plugin config error' // 获取插件配置失败，请检查您的插件配置格式

// export const i18n_FILES_MANAGER_SETTINGS_TITLE = '' // 文件管理基础功能
// export const i18n_FILES_MANAGER_SETTINGS_DESC = '' // 文件管理基本功能

export const i18n_DEFAULT_DELETE_FORMAT = 'Delete format' // '<div class="tooltip"><s>${name}</s><span class="tooltiptext">${name} has deledted in time ${date} ${time}</span> </div>'
export const i18n_DELETE_FORMAT_TITLE = 'Delete format title'  // 删除操作配置
export const i18n_DELETE_FORMAT_DESC = 'Delete format desc' // 配置指定模板，可替换被删除的文章名称
export const i18n_DELETE_FORMAT_VAR_DESC = 'Delete format var desc' // 支持以下变量

export const i18n_PROPS_ICON_TITLE = 'Props icon enhance config'  // 属性图标强化配置
export const i18n_PROPS_ICON_DESC = 'Props icon enhance config desc' // 对插件【Awesome-links】的优化，当logseq配置 :property-pages/enabled?=false 时，【Awesome-links】插件的属性图标不再显示，本功能对此优化，开启后会支持图标继续显示

export const i18n_UI_TOOLBAR_DROPDOWN_TITLE = 'UI toolbar dropdown enhance'  // logseq UI toolbar优化
export const i18n_UI_TOOLBAR_DROPDOWN_DESC = 'UI toolbar dropdown enhance desc' // 优化目前logseq UI toolbar下拉无法滚动到最底部问题

export const i18n_PAGE_DEFAULT_PROPS_TITLE = 'Default page properties'  // 页面默认属性
export const i18n_PAGE_DEFAULT_PROPS_VISIBLE_DESC = 'Default page properties visible desc' // 页面新建时，可配置默认属性,配置的默认属性是否可见
export const i18n_PAGE_DEFAULT_PROPS_DESC = 'Default page properties desc' // 新建页面时，您可以设置默认属性。空值属性将被忽略。如需添加默认为空的属性，请将其值设置为空格。请确保不要与系统属性发生冲突。对于属性'createTime'，我们建议您将其固定设置为`'createdTime': '${getDatetime()}'`，因为本插件将使用此属性
export const i18n_PAGE_DEFAULT_PROPS_VAR_DESC = 'Default page properties var desc' // 您可以参照示例进行配置。整个配置遵循JSON结构，其中JSON的值可以设置为常量，也可以按照以下方式使用变量进行配置

export const i18n_CUSTOMS_VARIABLE_TITLE = 'Custom variable config'  // 自定义变量配置
export const i18n_CUSTOMS_VARIABLE_TIMEOUT_DESC = 'Custom variable timeout config'  // 变量加载的超时配置，单位毫秒
export const i18n_CUSTOMS_VARIABLE_ERROR_HANDLER_DESC = 'Custom variable error handler config'  // 变量加载的异常处理
export const i18n_CUSTOMS_VARIABLE_DESC = 'Custom variable config desc' // 支持自定义变量，用于上方模板，变量类型为：`type CustomVariable = (input?: any) => string`
export const i18n_CUSTOMS_VARIABLE_VAR_DESC = 'Custom variable config var desc' // 已支持变量
export const i18n_CUSTOMS_VARIABLE_RANDOMICON_DESC = 'Custom variable config ${randomIcon} desc' // randomIcon()变量说明：${randomIcon()}会返回一个随机的Tabler icon, ${randomIcon(page)}仅会在非journal页面返回Tabler icon
export const i18n_CUSTOMS_VARIABLE_DATE_DESC = 'Custom variable config ${date} desc' // date变量说明：${date}会返回当前graph日期格式的日期
export const i18n_CUSTOMS_VARIABLE_TIME_DESC = 'Custom variable config ${time} desc' // time变量说明：${date}会返回当前时间，格式固定为'HH:mm'


export const i18n_META_BLOCK_CUSTOMS_COMMANDS_HEADING = 'Custom Commands Heading' // 自定义命令功能 
export const i18n_META_BLOCK_CUSTOMS_COMMANDS_DESC = 'Custom Commands Desc' // 定义自定义命令，支持其他插件调用使用，比如Text Wrapper插件, 可by`logseq-files-manager.models.test`调用命令并执行
export const i18n_META_BLOCK_CUSTOMS_COMMAND_CONFIG = 'Custom Command Configuration'  // 自定义命令配置
export const i18n_META_BLOCK_CUSTOMS_COMMANDS = 'Custom Commands' // 根据配置生成的自定义命令

export const i18n_HIDDEN_EMPTY_JOURNALS = 'Hidden empty journals' // 主页\日记页隐藏空白journals
export const i18n_HIDDEN_EMPTY_JOURNALS_SWITCH = 'Hidden empty journals switch'  // 隐藏空白journals开关，开启后，在日记页面会隐藏掉空白journals，您可通过手动创建日记页并跳转，或者by dayjs插件、calendar插件跳转空白的journals
export const i18n_HIDDEN_EMPTY_JOURNALS_DAYS = 'Hidden empty journal days' // 隐藏最近x天的日期

export const i18n_TRAIN_TICKET_CARD_HEADING = 'Train Ticket Card' // 火车票
export const i18n_TRAIN_TICKET_CARD_DESC = 'Train Ticket Card desc'  // 支持将block渲染成为火车票
export const i18n_TRAIN_TICKET_CARD_HIDDEN_PROPS_DESC = 'Train Ticket Card Hide Props desc'  // 隐藏卡片block的properties，true标识隐藏


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