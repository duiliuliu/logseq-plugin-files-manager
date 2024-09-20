import { useEffect } from 'react';
import { logger } from '../utils/logger';
import { AppUserConfigs, BlockEntity, IDatom, } from '@logseq/libs/dist/LSPlugin.user';
import { processPage } from './prepareData';
import { decodeLogseqFileName } from '../utils/fileUtil';
import { REGEX_PAGE_PATH } from './constants';
import { DocFormat, OperationType } from './enums';
import { getLogseqPageBlocksTree, getPageDetails } from '../logseq/utils';
import { removePageFromDB } from './db';

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
const handleFileChanged = async (changes: FileChanges, graph: string, dateFormat: string, docFormat: string, directoryHandle: any) => {
    const [operation, originalName] = parseOperation(changes, dateFormat);
    logger.debug(`handleFileChanged,operation:${operation},changes:`, changes)

    if (operation === OperationType.CREATE) return;

    if (operation === OperationType.MODIFIED) {
        const blocks = await getLogseqPageBlocksTree(originalName).catch(err => {
            logger.error(`Failed to get blocks: ${originalName}`, err);
            return null;
        });

        if (!blocks) return;

        const pageEntity = await getPageDetails(originalName)
        if (pageEntity) {
            processPage(pageEntity, graph, directoryHandle, docFormat as DocFormat, false) // todo dirhandler
        }
    }

    if (operation === OperationType.DELETE) {
        logger.debug(`Would remove page from DB: graph=${graph}, name=${originalName}`);
        removePageFromDB(graph, originalName);
    }
};

// 工具函数：解析操作类型
const parseOperation = (changes: FileChanges, _dateFormat: string): [OperationType, string] => {
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
                const matchResult = path.match(REGEX_PAGE_PATH);
                if (matchResult) {
                    originalName = decodeLogseqFileName(matchResult[2]);
                    operation = OperationType.MODIFIED;
                    return [operation, originalName];
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
export const useFileChangeListener = (userConfig: AppUserConfigs, directoryHandle: any) => {
    useEffect(() => {
        const onFileChanged = async (changes: FileChanges) => {
            await handleFileChanged(changes, userConfig.currentGraph, userConfig.preferredDateFormat, userConfig.preferredFormat, directoryHandle);
        };

        const removeOnChanged = logseq.DB.onChanged(onFileChanged);
        return () => {
            removeOnChanged();
        };
    }, [userConfig.currentGraph, userConfig.preferredDateFormat, userConfig.preferredFormat, directoryHandle]);
};
