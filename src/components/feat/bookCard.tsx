import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Book, Tag, Link as LinkIcon, ChevronDown, ChevronUp, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getColor, getColorBg } from './color'


export const getdefaultBookCardProps = () => {
    const defaultProps: BookCardProps = {
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
        source: ""
    }
    return defaultProps
}


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
}

const BookCard = function Component({
    cover = "https://www.ibs.it/images/9788804739036_0_536_0_75.jpg",
    title = "测试数据",
    description = "La coscienza, la vita. i computer e la nostra natura",
    author = "测试作家",
    categories = "Philosophy,Science",
    tags = "#📖/周末闲读,#AI",
    completed = "2023-12-18",
    time = "12:35",
    readlater,
    recommendation,
    source,
    color
}: BookCardProps) {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

    const toggleDescription = () => setIsDescriptionExpanded(!isDescriptionExpanded)

    const truncateDescription = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text
        return text.slice(0, maxLength) + '...'
    }

    const categoryList = categories.split(',').map(cat => cat.trim())
    const tagList = tags.split(',').map(tag => tag.trim())

    return (
        <TooltipProvider>
            <Card className={`w-full max-w-md mx-auto overflow-hidden ${getColorBg(color)}`} style={{ backgroundColor: getColor(color) }}>
                <div className="flex p-4">
                    {cover && (
                        <div className="relative w-20 h-20 mr-4 flex-shrink-0">
                            {cover.startsWith('http')
                                ? <img src={cover}
                                    alt={`${title} cover`} />
                                : <Image
                                    src={cover}
                                    alt={`${title} cover`}
                                    layout="fill"
                                    objectFit="cover" />
                            }
                        </div>
                    )}
                    <div className="flex flex-col justify-between flex-grow">
                        <CardHeader className="p-0">
                            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                            {description && (
                                <div className="relative">
                                    <p className="text-sm text-muted-foreground">
                                        {isDescriptionExpanded ? description : truncateDescription(description, 100)}
                                    </p>
                                    {description.length > 100 && (
                                        <button
                                            onClick={toggleDescription}
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
                        <div className="flex items-center justify-between">
                            <CardContent className="p-0 grid gap-2 mt-2">
                                {author && (
                                    <div className="flex items-center">
                                        <Book className="mr-2 h-4 w-4 opacity-70" />
                                        <span className="text-sm">{author}</span>
                                    </div>
                                )}
                                {categoryList.length > 0 && categoryList[0].trim() && (
                                    <div className="flex flex-wrap gap-2">
                                        {categoryList.map((category, index) => (
                                            <Badge key={index} variant="secondary">{category}</Badge>
                                        ))}
                                    </div>
                                )}
                                {tagList.length > 0 && tagList[0].trim() && (
                                    <div className="flex items-center flex-wrap gap-2">
                                        <Tag className="h-4 w-4 opacity-70" />
                                        {tagList.map((tag, index) => (
                                            <span key={index} className="text-sm">{tag}</span>
                                        ))}
                                    </div>
                                )}
                                {source && (
                                    <div className="flex items-center">
                                        <LinkIcon className="mr-2 h-4 w-4 opacity-70" />
                                        <Link href={source} className="text-sm text-primary hover:underline">
                                            查看资源
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                            {(completed || time) && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Clock className="h-4 w-4 opacity-70 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {completed && <p>完成于: {completed}</p>}
                                        {time && <p>时间: {time}</p>}
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>

                    </div>
                </div>
                <div className="px-4 pb-2 flex justify-between items-center">
                    {(readlater || recommendation) && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="w-2 h-2 bg-primary/50 rounded-full cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                {readlater && <p>稍后阅读: {readlater}</p>}
                                {recommendation && <p>推荐: {recommendation}</p>}
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </Card>
        </TooltipProvider>
    )
}

export default BookCard