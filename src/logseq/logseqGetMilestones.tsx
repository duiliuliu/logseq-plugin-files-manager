import { parse } from "date-fns";
import { getGloableUserConfigs } from "./useUserConfigs";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin";

export const getMilestones = async (pageName: string, blockUid: string) => {

    const result1 = await getMilestonesWithContent(pageName, blockUid)
    const result2 = await getMilestonesWithJournal(pageName)

    return [...result1, ...result2]
}

async function getMilestonesWithJournal(pageName: string) {
    const days = new Map()
    const result: { content: string; date: Date }[] = []
    const block = await logseq.Editor.getPage(pageName)
    let journals
    try {
        journals = (
            await logseq.DB.datascriptQuery(
                `[:find (pull ?j [:block/journal-day]) (pull ?b [:block/content])
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
            const date = new Date(parse(string(journal["journal-day"]),"yyyymmdd"))
            const ts = date.getTime()
            if (!days.has(ts)) {
                days.set(ts, { uuid: journal.uuid })
                // @ts-ignore
                result.push({
                    content: removeDateFromText(journal.content, pageName),
                    date: date,
                })
            }
        } else {
            // @ts-ignore 
            result.push({
                content: removeDateFromText(journal.content, pageName),
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
            content: removeDateFromText(content),
            date: getDateFromText(content),
        }
    }) || []
}


const getDateFromText = (text: string): Date => {
    const last = text?.match(/\[\[(.+?)\]\]/g)?.slice(-1)[0]
    return parse(last?.replace(/^(\[\[)|(\]\])$/g, '') || '', getGloableUserConfigs().preferredDateFormat, new Date())
}

const removeDateFromText = (text: string, page?: string): string => {
    page && (text = text.replace(`#${page}`, ''))
    page && (text = text.replace(`[[${page}]]`, ''))
    text = text.split('\n')[0]
    text = text.split('\n')[0]

    const last = text?.match(/\[\[(.+?)\]\]/g)?.slice(-1)[0]
    if (!last) return convertHerfData(text)
    return convertHerfData(text.replace(last, '').trim())
}


const convertHerfData = (text: string): string => {
    const idAttriReg = /id::\s+[\w-]+/ig
    text = text.replace(idAttriReg, '')

    const hredReg = /(?<!!)\[(.*?)\]\((.*?)\)/ig
    return '<p>' + text.replace(hredReg, `<a href=$2>$1</a>`) + '</p>'
}
 