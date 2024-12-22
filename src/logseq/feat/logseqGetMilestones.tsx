import { parse } from "date-fns";
import { getGloableUserConfigs } from "../useUserConfigs";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin";

export const getMilestones = async (pageName: string, blockUid: string) => {

    const result1 = await getMilestonesWithContent(pageName, blockUid)
    const result2 = await getMilestonesWithJournal(pageName)

    return [...result1, ...result2]
}

async function getMilestonesWithJournal(pageName: string) {
    const days = new Map()
    const result: { id: string; content: string; date: Date }[] = []
    const block = await logseq.Editor.getPage(pageName)
    let journals
    try {
        journals = (
            await logseq.DB.datascriptQuery(
                `[:find (pull ?j [:block/journal-day]) (pull ?b [*])
          :in $ ?uuid
          :where
          [?t :block/uuid ?uuid]
          [?b :block/refs ?t]
          [?b :block/page ?j]
          ]`,
                // [?j :block/journal? true]
                // @ts-ignore
                `#uuid "${block.uuid}"`,
            )
            // @ts-ignore
        ).map(([journal, block]) => ({ ...journal, ...block }))
    } catch (err) {
        console.error(err)
        return result
    }

    for (const journal of journals) {
        if (journal["journal-day"]) {
            // @ts-ignore
            const date = new Date(parse(`${journal["journal-day"]}`, "yyyymmdd", new Date()))
            const ts = date.getTime()
            if (!days.has(ts)) {
                days.set(ts, { uuid: journal.uuid })
                // @ts-ignore
                result.push({
                    id: journal.uuid,
                    content: journal.content,
                    date: date,
                })
            }
        } else {
            // @ts-ignore 
            result.push({
                id: journal.uuid,
                content: journal.content,
                date: getDateFromText(journal.content),
            })
        }
    }
    return result
}


const getMilestonesWithContent = async (pageName: string, blockUid: string) => {
    const blocks = await logseq.Editor.getPageBlocksTree(pageName)

    const milestones = blocks?.find(item => (item as BlockEntity)?.content === 'milestones') || (await logseq.Editor.getBlock(blockUid))
    return ((milestones as BlockEntity)?.children)?.map(milestone => {
        const content = (milestone as BlockEntity)?.content
        return {
            id: (milestone as BlockEntity).uuid,
            content: content,
            date: getDateFromText(content),
        }
    }) || []
}


const getDateFromText = (text: string): Date => {
    const last = text?.match(/\[\[(.+?)\]\]/g)?.slice(-1)[0]
    return parse(last?.replace(/^(\[\[)|(\]\])$/g, '') || '', getGloableUserConfigs().preferredDateFormat, new Date())
}
