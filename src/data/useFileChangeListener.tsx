import { useEffect } from 'react';
import { logger } from '../utils/logger';
import { AppUserConfigs, BlockEntity, IDatom, } from '@logseq/libs/dist/LSPlugin.user';
import { processPage } from './prepareData';
import { decodeLogseqFileName } from '../utils/fileUtil';
import { REGEX_PAGE_PATH } from './constants';
import { DocFormat, OperationType } from './enums';
import { getLogseqPageBlocksTree, getPageDetails } from '../logseq/utils';
import { format, parse } from 'date-fns';
import { isValidDate } from '../utils/timeUtil';
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
    logger.debug(`handleFileChanged,changes:${changes}`)

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
    } else if (operation === OperationType.DELETE) {
        logger.debug(`Would remove page from DB: graph=${graph}, name=${originalName}`);
        removePageFromDB(graph, originalName);
    }
};

// 工具函数：解析操作类型
const parseOperation = (changes: FileChanges, dateFormat: string): [OperationType, string] => {
    let operation = '' as OperationType;
    let originalName = '';

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
            originalName = data[2];
            operation = data[4] === false ? OperationType.DELETE : OperationType.CREATE;

            if (isValidDate(originalName, dateFormat)) {
                originalName = format(parse(originalName, dateFormat, new Date()), 'yyyy_MM_dd')
            }
        }
        return [operation, originalName];
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
