import { useEffect, useState } from 'react';
import { logger } from '../utils/logger';
import { BlockEntity, IDatom, } from '@logseq/libs/dist/LSPlugin.user';
import { processPage } from './prepareData';
import { decodeLogseqFileName, encodeLogseqFileName, formatFilePath, parseAndFormatJournal } from '../utils/fileUtil';
import { HOME_PAGE, LOG_PAGE, SETTING_PAGE, USER_CONFIG_FILE } from './constants';
import { DocFormat, OperationType } from './enums';
import { getLogseqPageBlocksTree, getPageDetails } from '../logseq/logseqCommonProxy';
import { removePageFromDB } from './db';
import { AppConfig } from './types';
import { addLogseqDefaultPageProps } from '../logseq/feat/logseqDefaultPageProps';

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
    const [operation, originalName, alias] = parseOperation(changes, appConfig);
    // logger.debug(`handleFileChanged,operation:${operation},changes:`, changes, 'file', originalName)

    if (alias === SETTING_PAGE || alias === LOG_PAGE || alias === HOME_PAGE) {
        operation === OperationType.PLUGIN_MODIFIED
        return { fileMotified: false }
    }


    if (operation === OperationType.CONFIG_MODIFIED) return { configUpdated: true };
    if (operation === OperationType.CREATE) {
        addLogseqDefaultPageProps(alias)
        return { fileMotified: false }
    };
    if (operation === OperationType.MODIFIED) {
        const blocks = await getLogseqPageBlocksTree(encodeLogseqFileName(alias)).catch(err => {
            logger.error(`Failed to get blocks: ${alias}`, err);
            return null;
        });

        if (!blocks) {
            logger.warn(`handleFileChanged file[${alias}], query blocks no data`)
            return { fileMotified: false };
        }

        const pageE = await getPageDetails(encodeLogseqFileName(alias))
        if (!pageE) {
            logger.warn(`handleFileChanged file[${alias}], query page no data`)
            return { fileMotified: false };
        }

        processPage({ pageE, dirHandle: directoryHandle, appConfig, updated: true })
    }
    if (operation === OperationType.DELETE) {
        logger.debug(`Would remove page from DB: graph=${appConfig.currentGraph}, name=${originalName}`);
        removePageFromDB(appConfig.currentGraph, originalName);
    }
    return { configUpdated: true };
};

// 工具函数：解析操作类型
const parseOperation = (changes: FileChanges, { pagesDirectory, journalsDirectory, journalFileNameFormat, preferredDateFormat, preferredFormat }: AppConfig): [OperationType, string, string] => {
    let operation = '' as OperationType;
    let originalName = '';
    let alias = ''

    if (changes.txMeta?.outlinerOp === 'create-page') {
        operation = OperationType.CREATE;
        originalName = decodeLogseqFileName(changes.blocks[0].originalName)
        return [operation, originalName + DocFormat.toFileExt(preferredFormat), originalName];
    }

    for (const block of changes.blocks) {
        if (block.path) {
            if (changes.txData.length === 0) continue;
            if (changes.txData[0][1] === 'file/last-modified-at') {
                const path = block.path;
                const [, , , , originalName] = formatFilePath(path)
                if (path.startsWith(pagesDirectory)) {
                    return [OperationType.MODIFIED, originalName + DocFormat.toFileExt(preferredFormat), originalName];
                }
                if (path.startsWith(journalsDirectory)) {
                    alias = parseAndFormatJournal(originalName, journalFileNameFormat!, preferredDateFormat)
                    return [OperationType.MODIFIED, originalName + DocFormat.toFileExt(preferredFormat), alias];
                }
                if (path === USER_CONFIG_FILE) {
                    return [OperationType.CONFIG_MODIFIED, originalName + DocFormat.toFileExt(preferredFormat), originalName];
                }
            }
        }
    }

    for (const data of changes.txData) {
        if (data.length === 5 && data[1] === 'block/original-name') {
            originalName = decodeLogseqFileName(data[2]);
            operation = data[4] === false ? OperationType.DELETE : OperationType.CREATE;
            return [operation, originalName + DocFormat.toFileExt(preferredFormat), originalName];
        }
    }

    return [operation, originalName + DocFormat.toFileExt(preferredFormat), originalName];
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
