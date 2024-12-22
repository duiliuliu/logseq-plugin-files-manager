import { checkStatusPrefix, Status } from '@/components/customs/statusBadge'
import { format, parseISO } from 'date-fns'

export interface Milestone {
    id: string
    content: string
    date: string
    status?: Status
    hidden?: boolean
    originalContent?: string
    tags?: string[]
    links?: Array<{
        type: 'url' | 'page' | 'tag' | 'block'
        text: string
        href: string
    }>
    subContent?: string[]
    properties?: { [K: string]: string }
}

export type ViewMode = 'calendar' | 'timeline' | 'heatmap' | 'fishbone' | 'table'


export const parseContent = (content: string) => {
    const tags = content.match(/#[\w-]+/g)?.map(tag => tag.slice(1)) || []
    const pageLinks = content.match(/\[\[([\w-]+)\]\]/g)?.map(link => ({
        type: 'page' as const,
        text: link.slice(2, -2),
        href: `#/page/${link.slice(2, -2)}`
    })) || []
    const urlLinks = content.match(/\[([^\]]+)\]$$([^)]+)$$/g)?.map(link => ({
        type: 'url' as const,
        text: link.match(/\[([^\]]+)\]/)?.[1] || '',
        href: link.match(/$$([^)]+)$$/)?.[1] || ''
    })) || []
    const blockLinks = content.match(/\(\(([\w-]+)\)\)/g)?.map(link => ({
        type: 'block' as const,
        text: link.slice(2, -2),
    })) || []

    const subContent: string[] = []
    const properties: { [K: string]: string } = {}
    let conetentStatus
    let mainConetnt
    content.split('\n').forEach((item, index) => {
        item = item.trim()

        if (index === 0) {
            conetentStatus = checkStatusPrefix(item)
            mainConetnt = conetentStatus ? item.replace(conetentStatus, '').trim() : item
            mainConetnt = mainConetnt.replace(/#[\w-]+/g, '')
            mainConetnt = mainConetnt.replace("[[", '').replace("]]", '')
            mainConetnt = mainConetnt.replace("((", '').replace("))", '')
        }

        if (item) {
            if (item.includes(":: ")) {
                const [key, value] = item.split("::")
                if (key.trim() === 'tags' || key.trim() === 'tag') {
                    value.split(',').forEach(item => tags.push(item))
                } else {
                    properties[key.trim()] = value?.trim() || ''
                }
            } else {
                index != 0 && subContent.push(item)
            }
        }
    })

    return {
        tags,
        links: [...pageLinks, ...urlLinks, ...blockLinks],
        subContent,
        properties,
        status: conetentStatus,
        content: mainConetnt
    }
}

export const formatDate = (date: string, formatStr = 'yyyy-MM-dd HH:mm:ss') => {
    return format(parseISO(date), formatStr)
}

export const truncateText = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}
