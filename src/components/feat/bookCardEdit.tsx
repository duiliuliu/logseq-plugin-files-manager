import React, { useRef, useState } from 'react'
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Book, Link as LinkIcon, ChevronDown, ChevronUp, Info } from "lucide-react"
import { Question } from '@phosphor-icons/react'
import Tooltip from '../customs/tooltip'
import { renderTags } from '../customs/tags'
import CardWithEdit from '../customs/cardWithEdit'
import { formatSource } from './utils'
import { ImageDisplay } from '../customs/imageDisplay'

export const getdefaultBookCardProps = (): BookCardProps => ({
    cover: "https://www.ibs.it/images/9788804739036_0_536_0_75.jpg",
    title: "测试数据",
    description: "La coscienza, la vita. i computer e la nostra natura",
    author: "测试作家",
    categories: "Philosophy,Science",
    tags: "",
    completed: "2023-12-18",
    time: "12:35",
    readlater: "",
    recommendation: "",
    source: "",
    editable: true,
})

export interface BookCardProps {
    cover?: string
    title?: string
    description?: string
    author?: string
    categories?: string
    tags?: string
    completed?: string
    time?: string
    readlater?: string
    recommendation?: string
    source?: string
    color?: string
    editable?: boolean
    displaymode?: 'normal' | 'compact'
    onUpdate?: (data: Partial<BookCardProps>) => void
    onEditBlock?: () => void
    onAddBlock?: () => void
}

const BookCard: React.FC<BookCardProps> = ({
    displaymode = 'normal',
    editable = true,
    ...props
}) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
    const [showInfoTooltip, setShowInfoTooltip] = useState(false)
    const bookCardRef = useRef<HTMLDivElement>(null)

    const renderContent = (data: BookCardProps) => (
        data.displaymode === 'compact'
            ? <div className="flex items-center p-2">
                {data.cover && (
                    <div className="w-16 h-24 mr-3 flex-shrink-0 overflow-hidden">
                        <ImageDisplay
                            cover={data.cover || ''}
                            title={data.title || ''}
                            alt={`${data.title} cover`}
                            className="w-full h-full"
                            imageClassName="rounded-sm"
                            imageStyle={{ objectFit: 'cover', objectPosition: 'center' }}
                        />
                    </div>
                )}
                <div className="p-0 grid gap-2 mt-4">
                    <CardTitle className="text-base font-semibold truncate flex-grow">{data.title}</CardTitle>
                    {data.description && (
                        <div className="relative mt-2">
                            <p className="text-sm text-muted-foreground cursor-pointer">
                                {isDescriptionExpanded ? data.description : truncateDescription(data.description, 100)}
                            </p>
                            {data.description.length > 100 && (
                                <button
                                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                    className="text-primary text-xs mt-1 flex items-center"
                                >
                                    {isDescriptionExpanded ? (
                                        <>收起 <ChevronUp className="h-3 w-3 ml-1" /></>
                                    ) : (
                                        <>展开 <ChevronDown className="h-3 w-3 ml-1" /></>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            : <>
                <div className="flex p-4" onClick={() => setShowInfoTooltip(!showInfoTooltip)}>
                    {data.cover && (
                        <div className="w-20 h-30 mr-4 flex-shrink-0 overflow-hidden">
                            <ImageDisplay
                                cover={data.cover || ''}
                                title={data.title || ''}
                                alt={`${data.title} cover`}
                                className="w-full h-full"
                                imageClassName="rounded-md"
                                imageStyle={{ objectFit: 'cover', objectPosition: 'center' }}
                            />
                        </div>
                    )}
                    <div className="flex flex-col justify-between flex-grow">
                        <CardHeader className="p-0">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl font-semibold">{data.title}</CardTitle>
                            </div>
                            {data.description && (
                                <div className="relative mt-2">
                                    <p className="text-sm text-muted-foreground cursor-pointer">
                                        {isDescriptionExpanded ? data.description : truncateDescription(data.description, 100)}
                                    </p>
                                    {data.description.length > 100 && (
                                        <button
                                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                            className="text-primary text-xs mt-1 flex items-center"
                                        >
                                            {isDescriptionExpanded ? (
                                                <>收起 <ChevronUp className="h-3 w-3 ml-1" /></>
                                            ) : (
                                                <>展开 <ChevronDown className="h-3 w-3 ml-1" /></>
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="p-0 grid gap-2 mt-4">
                            {data.author && (
                                <div className="flex items-center">
                                    <Book className="mr-2 h-4 w-4 opacity-70" />
                                    <span className="text-sm">{data.author}</span>
                                </div>
                            )}
                            {renderTags(data.categories, data.tags)}
                            <div className="flex items-center justify-between">
                                {data.source ? (
                                    <div className="flex items-center">
                                        <LinkIcon className="mr-2 h-4 w-4 opacity-70" />
                                        <a href={formatSource(data.source)} className="text-sm text-primary hover:underline">
                                            查看资源
                                        </a>
                                    </div>
                                ) : <div></div>}
                                {(data.completed || data.time) && (
                                    <Tooltip
                                        icon={(show: boolean) => show ? <Info className="h-4 w-4 opacity-70" /> : <Question className="h-4 w-4 opacity-70" />}
                                        text={<>
                                            {data.completed && <p className="mb-1">完成于: {data.completed}</p>}
                                            {data.time && <p>时间: {data.time}</p>}
                                            {data.readlater && <p className="mb-1">稍后阅读: {data.readlater}</p>}
                                            {data.recommendation && <p>推荐: {data.recommendation}</p>}
                                        </>}
                                        containerRef={bookCardRef}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </div>
                </div>
                <div className="px-6 pb-4 flex justify-between items-center">
                    {(data.readlater || data.recommendation) && showInfoTooltip && (
                        <div className="text-xs">
                            {data.readlater && <p className="mb-1">稍后阅读: {data.readlater}</p>}
                            {data.recommendation && <p>推荐: {data.recommendation}</p>}
                        </div>
                    )}
                </div>
            </>
    )

    const truncateDescription = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text
        return text.slice(0, maxLength) + '...'
    }

    return (
        <CardWithEdit
            data={{ ...props, displaymode, editable }}
            renderContent={renderContent}
            onUpdate={props.onUpdate}
            onEditBlock={props.onEditBlock}
            onAddBlock={props.onAddBlock}
            ref={bookCardRef}
        />
    )
}

export default BookCard