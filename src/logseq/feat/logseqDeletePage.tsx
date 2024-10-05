import { format } from "date-fns";
import { AppConfig, DataItem } from "../../data/types";
import { logger } from "../../utils/logger";
import { ASSETS_PATH_REGEX, ASSETS_REPLACE_PATH, DEFAULT_DELETE_FORMAT, DELETE_ASSET_VERSION_NEED_DIR_HANDLER_FN, i18n_DEFAULT_DELETE_FORMAT, i8n_DELETE_FORMAT_TITLE } from "../../data/constants";
import { escapeRegExp, objectTemplateFromat } from "../../utils/objectUtil";
import { getI18nConstantByPreLang } from "../../i18n/utils";
import { removePageFromDB } from "../../data/db";
import { DocFormat } from "../../data/enums";

export const deleteLogseqAsset = async (record: DataItem, userConfig: AppConfig, assetdirHandler: FileSystemDirectoryHandle | null): Promise<Array<string>> => {
    const refBlocks = await deleteLogseqAssetRefs(record.alias, record, userConfig)

    if (DELETE_ASSET_VERSION_NEED_DIR_HANDLER_FN()) {
        await dirhandlerRemoveFile(record.name, assetdirHandler)
    } else {
        await dirhandlerRemoveFile2(record.name)
    }

    removePageFromDB(userConfig.currentGraph, record.name)
    return refBlocks
}

export const dirhandlerRemoveFile = async (fileName: string, assetdirHandler: FileSystemDirectoryHandle | null) => {
    if (!assetdirHandler) {
        throw Error('assetDirectoryHandler is null')
    }
    await assetdirHandler.removeEntry(fileName)
}

export const dirhandlerRemoveFile2 = async (fileName: string) => {
    await logseq.caller.callAsync(`api:call`, {
        method: 'unlink-plugin-storage-file',
        args: ["../../", fileName, true]
    })
}

export const deleteLogseqAssetRefs = async (name: string, record: DataItem, userConfig: AppConfig): Promise<Array<string>> => {
    const deleteFormart = userConfig?.pluginSettings?.deleteFormart
    if (!deleteFormart) {
        return []
    }
    try {
        const refBolckUids = [] as string[]
        const related = record.related

        const deleteString = formatDeleteString(deleteFormart, { name, date: format(Date.now(), userConfig.preferredDateFormat), time: format(Date.now(), 'HH:mm') });
        logger.debug('deleteLogseqPage,deleteString:', deleteString, 'name', name)

        for (const refItem of related || []) {
            if (refItem.relatedBlockContent && refItem.relatedItemUuid) {
                const block = await logseq.Editor.getBlock(refItem.relatedItemUuid)
                if (!block) {
                    throw Error(`block(${refItem.relatedItemUuid}) not found`)
                }

                const filePath = escapeRegExp(record.path?.replace(ASSETS_PATH_REGEX, ASSETS_REPLACE_PATH) || "");
                const assetRef = new RegExp(`!?\\[.*?\\]\\(${filePath}\\)`);
                let newContent = block.content.replace(assetRef, deleteString);
                await logseq.Editor.updateBlock(refItem.relatedItemUuid, newContent);
                refBolckUids.push(block.uuid)
            }
        }

        return refBolckUids
    } catch (error) {
        // 这里可以记录日志或者做其他错误处理
        logger.error(`Failed to delete Logseq page: ${name}`, error);
        throw error; // 可以选择重新抛出异常或者处理它
    }
}

export const deleteLogseqPage = async (name: string, userConfig: AppConfig): Promise<Array<string>> => {
    logger.debug('deleteLogseqPage start,', 'name', name)

    // 删除日志或页面的其他相关数据
    const refBlocks = await deleteLogseqPageRefs(name, userConfig)
    // 删除页面
    await logseq.Editor.deletePage(name);
    removePageFromDB(userConfig.currentGraph, name + DocFormat.toFileExt(userConfig.preferredFormat))

    return refBlocks
}

export const deleteLogseqPageRefs = async (name: string, userConfig: AppConfig): Promise<Array<string>> => {
    try {
        const deleteFormart = userConfig?.pluginSettings?.deleteFormart || DEFAULT_DELETE_FORMAT
        const refBolckUids = [] as string[]
        const refs = await logseq.Editor.getPageLinkedReferences(name);
        logger.debug('deleteLogseqPage,refs:', refs, 'name', name)
        if (!refs || refs.length === 0) {
            return refBolckUids
        }

        const deleteString = formatDeleteString(deleteFormart, { name, date: format(Date.now(), userConfig.preferredDateFormat), time: format(Date.now(), 'HH:mm') });
        logger.debug('deleteLogseqPage,deleteString:', deleteString, 'name', name)

        for (const refItem of refs || []) {
            const blocks = refItem[1];
            if (!blocks || blocks.length === 0) {
                return refBolckUids
            }
            for (const block of blocks) {
                let newContent = block.content.replace(`[[${name}]]`, deleteString);

                await logseq.Editor.updateBlock(block.uuid, newContent);
                logger.debug('deleteLogseqPage,updateBlock:', newContent)
                refBolckUids.push(block.uuid)
            }
        }

        return refBolckUids
    } catch (error) {
        // 这里可以记录日志或者做其他错误处理
        logger.error(`Failed to delete Logseq page: ${name}`, error);
        throw error; // 可以选择重新抛出异常或者处理它
    }
}

const formatDeleteString = (temp: string, data: { name?: string, date?: string, time?: string, [key: string]: any }): string => {
    try {
        return ` ${objectTemplateFromat(temp, data)} `
    } catch (error) {
        logseq.UI.showMsg(`get ${getI18nConstantByPreLang(i8n_DELETE_FORMAT_TITLE)} error,error:${error}`)
        return ` ${objectTemplateFromat(getI18nConstantByPreLang(i18n_DEFAULT_DELETE_FORMAT), data)} `
    }
}
