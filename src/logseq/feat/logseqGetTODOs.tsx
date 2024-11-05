import { TodoItem } from "@/components/feat/pageCard";
import { logger } from "@/utils/logger";




// 获取所有Logseq TODO
export const getPageTodos2 = async (pagename: string): Promise<Array<TodoItem>> => {
    try {
        const script = `(and (task NOW LATER DOING TODO IN-PROGRESS WAIT) [[${pagename}]])`
        const data = (await logseq.DB.q(script))?.map(item => {
            return {
                id: item.uuid,
                text: item.content,
                completed: false,
                maker: item.maker
            }
        });
        return data || [];
    } catch (error) {
        logger.error('Failed to get page todos2:', error);
        return [];
    }
};


// 获取所有Logseq TODO
export const getPageTodos = async (pagename: string): Promise<Array<TodoItem>> => {
    try {
        const script = `[:find (pull ?b [:block/uuid :block/content :block/marker])
                            :where 
                            [?p :block/name "${pagename}"]
                            [?b :block/page ?p] 
                            [?b :block/marker ?marker]
                            [(contains? #{"TODO", "NOW"} ?marker)]  
                            `
        const data = await logseq.DB.datascriptQuery(script);
        return data;
    } catch (error) {
        logger.error('Failed to get page todos:', error);
        return [];
    }
};
