import { format } from "date-fns";
import { AppConfig, DataItem } from "../data/types";
import { logger } from "../utils/logger";
import { getLspDeleteFormat as getLspSettingDeleFormat } from "./logseqSetting"
import { ASSETS_PATH_REGEX, ASSETS_REPLACE_PATH } from "../data/constants";
import { DataType } from "../data/enums";



export const deleteLogseqAsset = async (name: string, record: DataItem, userConfig: AppConfig): Promise<Array<string>> => {
    try {
        const refBolckUids = [] as string[]
        const related = record.related

        const deleteString = formatDeleteString(await getLspSettingDeleFormat(userConfig.preferredLanguage), { name, date: format(Date.now(), userConfig.preferredDateFormat), time: format(Date.now(), 'HH:mm') });
        logger.debug('deleteLogseqPage,deleteString:', deleteString, 'name', name)

        for (const refItem of related || []) {
            if (refItem.relatedBlockContent && refItem.relatedItemUuid) {
                const block = await logseq.Editor.getBlock(refItem.relatedItemUuid)
                if (!block) {
                    throw Error(`block(${refItem.relatedItemUuid}) not found`)
                }

                const filePath = record.path?.replace(ASSETS_PATH_REGEX, ASSETS_REPLACE_PATH);
                const assetRef = DataType.IMG_ASSET === record.dataType
                    ? `![${record.alias}](${filePath})` // 图片资产使用Markdown图片语法
                    : `[${record.alias}](${filePath})`; // 其他资产使用Markdown链接语法

                let newContent = block.content.replace(`[[${assetRef}]]`, deleteString);
                await logseq.Editor.updateBlock(refItem.relatedItemUuid, newContent);
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


export const deleteLogseqPage = async (name: string, userConfig: AppConfig): Promise<Array<string>> => {
    try {
        const refBolckUids = [] as string[]

        const refs = await logseq.Editor.getPageLinkedReferences(name);
        logger.debug('deleteLogseqPage,refs:', refs, 'name', name)
        if (!refs || refs.length === 0) {
            return refBolckUids
        }

        const deleteString = formatDeleteString(await getLspSettingDeleFormat(userConfig.preferredLanguage), { name, date: format(Date.now(), userConfig.preferredDateFormat), time: format(Date.now(), 'HH:mm') });
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

const formatDeleteString = (temp: string, data: { name?: string, date?: string, time?: string }): string => {
    return new Function(...Object.keys(data), `return \` ${temp} \`;`)(...Object.values(data))
}
