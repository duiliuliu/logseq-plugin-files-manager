import { useEffect, useState } from 'react';
import { logger } from '../utils/logger';
import { BlockEntity, IDatom, } from '@logseq/libs/dist/LSPlugin.user';
import { processPage } from './prepareData';
import { decodeLogseqFileName, formatFilePath } from '../utils/fileUtil';
import { USER_CONFIG_FILE } from './constants';
import { OperationType } from './enums';
import { getLogseqPageBlocksTree, getPageDetails } from '../logseq/utils';
import { removePageFromDB } from './db';
import { AppConfig } from './types';

type FileChanges = {
    blocks: BlockEntity[];
    txData: IDatom[];
    txMeta?: {
        outlinerOp: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
}

// 工具函数：处理文件变化
const handleFileChanged = async (changes: FileChanges, appConfig: AppConfig, directoryHandle: any): Promise<{ configUpdated?: boolean, fileMotified?: boolean }> => {
    const [operation, originalName] = parseOperation(changes, appConfig.pagesDirectory!, appConfig.journalsDirectory!);
    logger.debug(`handleFileChanged,operation:${operation},changes:`, changes, 'file', originalName)

    if (operation === OperationType.CONFIG_MODIFIED) return { configUpdated: true };
    if (operation === OperationType.CREATE) return { fileMotified: false };

    if (operation === OperationType.MODIFIED) {
        const blocks = await getLogseqPageBlocksTree(originalName).catch(err => {
            logger.error(`Failed to get blocks: ${originalName}`, err);
            return null;
        });

        if (!blocks) {
            logger.warn(`handleFileChanged file${originalName}, query blocks no data`)
            return { fileMotified: false };
        }

        const pageEntity = await getPageDetails(originalName)
        if (!pageEntity) {
            logger.warn(`handleFileChanged file${originalName}, query page no data`)
            return { fileMotified: false };
        }

        processPage(pageEntity, directoryHandle, appConfig, true) // todo dirhandler

    }

    if (operation === OperationType.DELETE) {
        logger.debug(`Would remove page from DB: graph=${appConfig.currentGraph}, name=${originalName}`);
        removePageFromDB(appConfig.currentGraph, originalName);
    }
    return { configUpdated: true };
};

// 工具函数：解析操作类型
const parseOperation = (changes: FileChanges, pagesDirectory: string, journalsDirectory: string): [OperationType, string] => {
    let operation = '' as OperationType;
    let originalName = '';

    if (changes.txMeta?.outlinerOp === 'create-page') {
        operation = OperationType.CREATE;
        return [operation, decodeLogseqFileName(changes.blocks[0].originalName)];
    }

    for (const block of changes.blocks) {
        if (block.path) {
            if (changes.txData.length === 0) continue;
            if (changes.txData[0][1] === 'file/last-modified-at') {
                const path = block.path;
                const [, , , , originalName] = formatFilePath(path)
                if (path.startsWith(pagesDirectory) || path.startsWith(journalsDirectory)) {
                    return [OperationType.MODIFIED, originalName];
                }
                if (path === USER_CONFIG_FILE) {
                    return [OperationType.CONFIG_MODIFIED, originalName];
                }
            }
        }
    }

    for (const data of changes.txData) {
        if (data.length === 5 && data[1] === 'block/original-name') {
            originalName = decodeLogseqFileName(data[2]);
            operation = data[4] === false ? OperationType.DELETE : OperationType.CREATE;
            return [operation, originalName];
        }
    }

    return [operation, originalName];
};

// 使用Effect监听文件变化
export const useFileChangeListener = (appConfig: AppConfig, directoryHandle: any, setUserConfigUpdated: (arg0: number) => void) => {
    const [fileMotified, setFileMotified] = useState<number>(Date.now())
    useEffect(() => {
        const onFileChanged = async (changes: FileChanges) => {
            const { configUpdated, fileMotified: fileMotifiedT } = await handleFileChanged(changes, appConfig, directoryHandle);
            if (configUpdated) {
                setUserConfigUpdated(Date.now())
            }
            if (fileMotifiedT) {
                setFileMotified(prev => Math.round((Date.now() - prev) / 24 * 60 * 60 * 1000)) // 每天一刷新
            }
        };

        const removeOnChanged = logseq.DB.onChanged(onFileChanged);
        return () => {
            removeOnChanged();
        };
    }, [appConfig.currentGraph
        , appConfig.preferredDateFormat
        , appConfig.journalFileNameFormat
        , appConfig.journalsDirectory
        , appConfig.pagesDirectory
        , appConfig.preferredFormat
        , directoryHandle]);

    return fileMotified;
};
