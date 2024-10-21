
import { PageEntity } from "@logseq/libs/dist/LSPlugin";
import { mockLogseqPages90 } from "../mock/logseqPages";
import { logger } from "../utils/logger";


// 获取所有Logseq页面
export const getAllLogseqPages = async (): Promise<PageEntity[] | null> => {
    if (import.meta.env.DEV) {
        // 在开发环境中返回 mock 数据
        logger.debug(`getAllLogseqPages mock,dataLength:${mockLogseqPages90.length}`);
        return mockLogseqPages90;
    } else {
        try {
            const data = await logseq.Editor.getAllPages();
            logger.debug(`getAllLogseqPages end`);

            return data
        } catch (error) {
            logger.error('Failed to get all pages:', error);
            return null
        }
    }
};

export interface FileEntity {
    id: number;
    content: string;
    created_at: number;
    path: string;
}

// 获取所有Logseq页面
export const getAllLogseqPagesAndFile = async (): Promise<Array<[FileEntity, PageEntity]>> => {
    try {
        const script = `[:find (pull ?f [*]) (pull ?b [*])
                        :where
                        [?f :file/path _]
                        [?b :block/file ?f]]`
        const data = await logseq.DB.datascriptQuery(script);
        logger.debug(`getAllLogseqPages end`);
        return data;
    } catch (error) {
        logger.error('Failed to get all pages:', error);
        return [];
    }
};
