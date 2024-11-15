
import { isImage, isDoc, isBook, isVedio, isAudio } from '../utils/fileUtil'


// ===================================================================================
// 枚举类型定义
// ===================================================================================


// 数据类型枚举，用于定义不同种类的数据
enum DataType {
    PAGE = 'page',
    JOURNAL = 'journal',
    BOOK_ASSET = 'book',
    DOC_ASSET = 'document',
    IMG_ASSET = 'image',
    VIDEO_ASSET = 'video',
    AUDIO_ASSET = 'audio',
}

// 文档格式枚举，用于定义不同种类的文档格式
enum DocFormat {
    MD = 'markdown',
    ORG = 'org',
}

// 显示模式枚举，用于定义不同的显示模式
enum DisplayMode {
    CARD = 'card',
    LIST = 'list',
    TABLE = 'table'
}

// 标签页枚举，用于定义不同的标签页
enum TabEnum {
    ALL = 'all',
    DOCUMENTS = 'documents',
    IMAGES = 'images',
    VIDEOS = 'videos',
    AUDIOS = 'audios',
    PAGES = 'pages',
    JOURNALS = 'journal',
    SETTINGS = 'settings'
}

// 关联类型枚举，用于定义不同种类的关联
enum RelatedType {
    BLOCK = 'block',
    PAGE = 'page',
    TAG = 'tag'
}

/**
 * 枚举：定义了文件操作的类型。
 * - CREATE：表示文件创建操作。
 * - MODIFIED：表示文件修改操作。
 * - DELETE：表示文件删除操作。
 */
export enum OperationType {
    CREATE = 'create',
    MODIFIED = 'modified',
    CONFIG_MODIFIED = 'config_modified',
    DELETE = 'delete',
    RENAME = 'rename',
    PLUGIN_MODIFIED = 'plugin_modified'
}

// ===================================================================================
// DataType 命名空间
// ===================================================================================

namespace DataType {
    /**
     * 根据文件扩展名返回对应的数据类型。
     * @param extName 文件扩展名。
     * @returns 对应的数据类型。
     */
    export function fileExtToDataType(extName: string): DataType {
        if (isImage(extName)) return DataType.IMG_ASSET
        if (isDoc(extName)) return DataType.DOC_ASSET
        if (isBook(extName)) return DataType.DOC_ASSET
        if (isVedio(extName)) return DataType.VIDEO_ASSET
        if (isAudio(extName)) return DataType.AUDIO_ASSET
        return 'unknown DataType' as DataType
    }

    /**
     * 检查给定的数据类型是否有效。
     * @param dataType 数据类型。
     * @returns 是否有效。
     */
    export function isDataType(dataType: DataType): boolean {
        return Object.values(DataType).includes(dataType);
    }

    /**
     * 检查数据类型是否为资产文件。
     * @param dataType 数据类型。
     * @returns 是否为资产文件。
     */
    export function isAssetFile(dataType: DataType): boolean {
        return dataType !== DataType.PAGE && dataType !== DataType.JOURNAL;
    }

    /**
     * 将数据类型转换为标签页枚举。
     * @param dataType 数据类型。
     * @returns 对应的标签页枚举。
     */
    export function toTabEnum(dataType: DataType): TabEnum {
        switch (dataType) {
            case DataType.BOOK_ASSET:
            case DataType.DOC_ASSET:
                return TabEnum.DOCUMENTS;
            case DataType.IMG_ASSET:
                return TabEnum.IMAGES;
            case DataType.VIDEO_ASSET:
                return TabEnum.VIDEOS;
            case DataType.AUDIO_ASSET:
                return TabEnum.AUDIOS;
            case DataType.PAGE:
                return TabEnum.PAGES;
            case DataType.JOURNAL:
                return TabEnum.JOURNALS;
            default:
                return TabEnum.ALL;
        }
    }
}

// ===================================================================================
// DisplayMode 命名空间
// ===================================================================================

namespace DisplayMode {
    /**
     * 检查给定的模式是否为卡片模式。
     * @param mode 显示模式。
     * @returns 是否为卡片模式。
     */
    export const isCard = (mode: DisplayMode | string): boolean => {
        return mode === DisplayMode.CARD;
    }
}


// ===================================================================================
// DocFormat 命名空间
// ===================================================================================

namespace DocFormat {
    /**
     * 根据文档格式返回相应的文件扩展名。
     * 
     * @param mode - 要检查的文档格式。可以是DocFormat枚举中的一个值，或者是表示文档格式的字符串。
     * @returns 返回与给定文档格式相对应的文件扩展名。如果格式无效或未定义，返回空字符串。
     */
    export function toFileExt(mode: DocFormat | string): string {
        switch (mode) {
            case DocFormat.MD: return '.md';
            case DocFormat.ORG: return '.org';
            default: return '';
        }
    }
}


// ===================================================================================
// TabEnum 命名空间
// ===================================================================================

namespace TabEnum {
    /**
     * 将标签页枚举转换为数据类型。
     * @param tabEnum 标签页枚举。
     * @returns 对应的数据类型。
     */
    export function toDataType(tabEnum: TabEnum): DataType {
        switch (tabEnum) {
            case TabEnum.DOCUMENTS:
                return DataType.DOC_ASSET;
            case TabEnum.IMAGES:
                return DataType.IMG_ASSET;
            case TabEnum.VIDEOS:
                return DataType.VIDEO_ASSET;
            case TabEnum.AUDIOS:
                return DataType.AUDIO_ASSET;
            case TabEnum.PAGES:
                return DataType.PAGE;
            case TabEnum.JOURNALS:
                return DataType.JOURNAL;
            default:
                return 'unknown DataType' as DataType;
        }
    }

    /**
     * 检查给定的标签是否为页面标签。
     * @param tabKey 标签键。
     * @returns 是否为页面标签。
     */
    export const isPagesTab = (tabKey: string): boolean => tabKey.toLowerCase() === TabEnum.PAGES;

    /**
     * 检查给定的标签是否为设置标签。
     * @param key 标签键。
     * @returns 是否为设置标签。
     */
    export const isSettingsTab = (key: string): boolean => key.toLowerCase() === TabEnum.SETTINGS;

    /**
     * 检查给定的标签是否为全部标签。
     * @param key 标签键。
     * @returns 是否为全部标签。
     */
    export const isAllTab = (key: string): boolean => key.toLowerCase() === TabEnum.ALL;
}

// ===================================================================================
// 导出
// ===================================================================================

export {
    DataType,
    DocFormat,
    DisplayMode,
    TabEnum,
    RelatedType
};