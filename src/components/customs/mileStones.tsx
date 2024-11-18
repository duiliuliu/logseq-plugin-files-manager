import { Status } from "./statusBadge"
import { format, parseISO } from 'date-fns'

export interface Milestone {
    id: string
    content: string
    date: string
    status: Status
    hidden?: boolean
    originalContent?: string
    tags?: string[]
    links?: Array<{
        type: 'url' | 'page' | 'tag'
        text: string
        href: string
    }>
}

export interface MilestoneViewProps {
    milestones: Milestone[]
    isEmbedded?: boolean
    isWideMode?: boolean
    onUpdate?: (milestone: Milestone) => void
    onToggleHidden?: (id: string) => void
    onReset?: () => void
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

    return {
        tags,
        links: [...pageLinks, ...urlLinks]
    }
}

export const formatDate = (date: string, formatStr = 'yyyy-MM-dd HH:mm:ss') => {
    return format(parseISO(date), formatStr)
}

export const truncateText = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}
