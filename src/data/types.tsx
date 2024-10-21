import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin.user';
import { DataType, RelatedType } from './enums';
import { PluginSettings } from '../logseq/logseqSetting';

// ===================================================================================
// 接口定义
// ===================================================================================

/**
 * DataItem 接口定义了数据项的基本结构，用于表示各种类型的数据项。
 */
interface DataItem {
    graph: string;          // 数据项所属的图
    dataType: DataType;     // 数据项的类型
    name: string;           // 数据项的名称
    uuid: string;           // 数据项的唯一标识符
    updatedTime: number;    // 数据项的更新时间
    createdTime?: number;    // 数据项的创建时间
    icon?: string;    // 数据项的创建时间
    alias: string;          // 数据项的别名
    path?: string;          // 资产的路径

    // 页面属性
    summary?: string[];     // 页面的摘要信息，可能包含多个字符串
    image?: string;         // 页面的图片链接

    // 资产属性
    extName?: string;       // 资产的扩展名
    size?: string;          // 资产的尺寸或大小

    related?: RelatedItem[]; // 与当前数据项相关联的其他项目
}

/**
 * RelatedItem 接口定义了与数据项相关联的其他项目的基本信息。
 */
interface RelatedItem {
    relatedType: RelatedType;  // 关联的类型
    relatedItemUuid?: string;  // 关联项的唯一标识符
    relatedTag?: string;       // 关联的标签
    relatedBlockContent?: string;  // 关联的区块内容
    relatedBlockPage?: string;   // 关联的页面名称
}

/**
 * Tab 接口定义了标签页的基本结构，用于在用户界面中显示不同的标签页。
 */
interface Tab {
    key: string;            // 标签页的唯一键
    label: React.ReactNode; // 标签页显示的文本或节点
    icon?: React.ReactNode; // 标签页显示的图标
    children?: React.ReactNode;  // 标签页的子内容
    count?: number;         // 标签页的计数，用于显示数量信息
}

/**
 * Size 接口定义了尺寸的结构，包括宽度和高度。
 */
interface Size {
    width: number;  // 尺寸的宽度，通常以像素为单位
    height: number; // 尺寸的高度，通常以像素为单位
}

/**
 * Position 接口定义了元素的位置
 */
interface Position {
    left: number;
    top: number;
}


/**
 * 应用程序配置接口，继承自用户配置，包含特定的目录和文件名格式设置。
 */
interface AppConfig extends AppUserConfigs {
    /**
     * 页面文件的存储目录。
     */
    pagesDirectory?: string;

    /**
     * 日志文件的存储目录。
     */
    journalsDirectory?: string;

    /**
     * 资源文件的存储目录。
     */
    assetsDirectory?: string;

    /**
     * 日志文件名的格式化字符串，可以使用模板变量。
     */
    journalFileNameFormat?: string;

    /**
     * 需要隐藏的目录数组。
     */
    hiddenDir?: string[];

    /**
     * 是否启用属性页面功能。
     */
    propertyPagesEnabled?: boolean;

    /**
     * journal 默认模板
     */
    defaultJournalTemplateName?: string;

    /**
     * 插件配置
     */
    pluginSettings?: PluginSettings;
}

type createMetaBlockProps = {
    parentBlock: string;
    parentBlockProperties: {
        [K: string]: any
    }
    metaBlockPrefix: string;
    metaBlockProperties: {
        [K: string]: any
    }
}


// ===================================================================================
// 导出
// ===================================================================================

export type {
    AppConfig,
    DataItem,
    RelatedItem,
    Tab,
    Size,
    Position,
    createMetaBlockProps,
};