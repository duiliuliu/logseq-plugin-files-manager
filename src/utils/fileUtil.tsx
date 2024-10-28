import normalizePath from 'normalize-path';
import { logger } from './logger';
import { DocFormat } from '../data/enums';
import { format, parse } from 'date-fns';

const imageFormats = ['png', 'jpg', 'jpeg', 'webp', 'gif']
// 电子书常见的文件格式
const bookFormats = [
    'pdf',  // 便携式文档格式
];
const documentFormats = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'md', 'txt', 'html', 'htm', 'csv', 'rtf',
    'mobi', // 亚马逊 Kindle 电子书格式
    'azw3', // 亚马逊 Kindle 电子书格式 (较新的版本)
    'fb2',  // FictionBook 电子书格式
    'cbz',  // 漫画书档案格式
    'chm',  // Microsoft 压缩 HTML 帮助文件
    'lit',  // Microsoft 阅读器格式
    'pdb',  // PalmOS 电子书格式
    'prc',  // 掌上电脑阅读器格式 
    'epub', // 电子出版标准
]
const videoFormats = ['mp4', 'avi', 'mov', 'wmv', 'flv', '3gp', 'mpeg', 'mpg', 'ts', 'm4v']
const audioFormats = ['mp3', 'wav', 'ogg', 'flac', 'wma', 'aac']


export const isImage = (ext: string): boolean => {
    return imageFormats.includes(ext?.toLowerCase());
}

export const isBook = (ext: string): boolean => {
    return bookFormats.includes(ext?.toLowerCase());
}

export const isMD = (ext: string): boolean => {
    return ext?.toLowerCase() === 'md';
}

export const isDoc = (ext: string): boolean => {
    return bookFormats.includes(ext?.toLowerCase()) || documentFormats.includes(ext?.toLowerCase());
}

export const isVedio = (ext: string): boolean => {
    return videoFormats.includes(ext?.toLowerCase());
}

export const isAudio = (ext: string): boolean => {
    return audioFormats.includes(ext?.toLowerCase());
}

export const encodeLogseqFileName = (name: string): string => {
    if (!name) return '';
    return name
        .replace(/\/$/, '') // Remove trailing slash
        .replace(/^(CON|PRN|AUX|NUL|COM1|COM2|COM3|COM4|COM5|COM6|COM7|COM8|COM9|LPT1|LPT2|LPT3|LPT4|LPT5|LPT6|LPT7|LPT8|LPT9)$/, '$1___')
        .replace(/\.$/, '.___')
        .replace(/_\/_/g, '%5F___%5F')
        .replace(/</g, '%3C')
        .replace(/>/g, '%3E')
        .replace(/:/g, '%3A')
        .replace(/"/g, '%22')
        .replace(/\//g, '___')
        .replace(/\\/g, '%5C')
        .replace(/\|/g, '%7C')
        .replace(/\?/g, '%3F')
        .replace(/\*/g, '%2A')
        .replace(/#/g, '%23')
        .replace(/^\./, '%2E');
};

export const decodeLogseqFileName = (name: string) => {
    if (!name) return '';

    // Cannot restore trailing slash because it is not saved in local file.
    return name
        .replace(/^(CON|PRN|AUX|NUL|COM1|COM2|COM3|COM4|COM5|COM6|COM7|COM8|COM9|LPT1|LPT2|LPT3|LPT4|LPT5|LPT6|LPT7|LPT8|LPT9)___$/, '$1')
        .replace(/\.___$/, '.')
        .replace(/%5F___%5F/g, '_/_')
        .replace(/%3C/g, '<')
        .replace(/%3E/g, '>')
        .replace(/%3A/g, ':')
        .replace(/%22/g, '"')
        .replace(/___/g, '/')
        .replace(/%5C/g, '\\')
        .replace(/%7C/g, '|')
        .replace(/%3F/g, '?')
        .replace(/%2A/g, '*')
        .replace(/%23/g, '#')
        .replace(/%2E/g, '.');
};


export const getFileInfo = async (fileName: string, handle: FileSystemDirectoryHandle, preferredFormat: DocFormat, defaultV: [number, string | undefined]): Promise<[number, string | undefined]> => {
    const path = fileName + DocFormat.toFileExt(preferredFormat);
    const fileHandle = await handle?.getFileHandle(path).catch(() => {
        console.debug(`Failed to get file handle: ${handle.name}/${path}`);
        return null;
    });

    if (!fileHandle) { return defaultV; }

    const file = await fileHandle.getFile();

    logger.debug(`getFileInfo,fileName:${fileName},file.size:${file.size}`)
    return [new Date(file.lastModified).getTime(), formatFileSize(file.size)];
};

/**
 * 处理文件名，提取扩展名并生成别名。 
 */
export function formatFileName(fileName: string): [extName: string, alias: string, originName: string] {
    if (!fileName) {
        return ['', '', '']
    }
    const extDotLastIdx = fileName.lastIndexOf('.');
    const extName = extDotLastIdx !== -1 ? fileName.substring(extDotLastIdx + 1) : '';
    const nameWithoutExt = extDotLastIdx !== -1 ? fileName.substring(0, extDotLastIdx) : fileName;
    const alias = nameWithoutExt.length > 24 ? nameWithoutExt.substring(0, 24).replace(/[0-9_.]{5,}(\.|$)/g, '$1') : nameWithoutExt;

    return [extName, alias, nameWithoutExt];
}

// 工具函数：提取文件路径、名称、别名和扩展名
export const formatFilePath = (itemPath: string): [path: string, name: string, alias: string, extName: string, originName: string] => {
    if (!itemPath) {
        return ['', '', '', '', ''];
    }
    const normalath = normalizePath(itemPath);
    const name = normalath?.substring(normalath.lastIndexOf('/') + 1) ?? '';
    if (name.startsWith('.')) return ['', '', '', '', '']; // 忽略隐藏文件

    const [extName, alias, originName] = formatFileName(name);
    return [normalath ?? '', name, alias, extName, originName];
};

// 工具函数：格式化文件大小
export const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    else if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const getGraphDirName = (graph: string) => {
    // 使用split方法按路径分隔符分割路径
    const parts = graph.split('/');
    // 使用pop方法获取数组的最后一个元素
    return parts.pop();
}

export async function verifyPermission(dirHandle: FileSystemHandle | FileSystemDirectoryHandle, readWrite: boolean) {
    if (!dirHandle) {
        return false
    }
    const options = {};
    if (readWrite) {
        // @ts-ignore
        options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    if ((await dirHandle.queryPermission(options)) === 'granted') {
        return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await dirHandle.requestPermission(options)) === 'granted') {
        return true;
    }
    // The user didn't grant permission, so return false.
    return false;
}

export const formatJournalPageName = (journalDay: number | undefined, originalName: string, journalFileTem: string, dateFormat: string): string => {
    return journalDay
        ? parseAndFormatJournal(journalDay.toString(), 'yyyyMMdd', journalFileTem)
        : parseAndFormatJournal(originalName, dateFormat, journalFileTem)
}

export const parseAndFormatJournal = (str: string, parseFormat: string, dateFormat: string) => {
    return format(parse(str, parseFormat, new Date()), dateFormat)
}