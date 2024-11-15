import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Clock, RefreshCw, HardDrive, FileIcon } from "lucide-react"
import { getColor } from '../customs/color'
import { logger } from '@/utils/logger'

export const getdefaultPageCardProps = (): PageCardProps => {
    return {
        icon: "📄",
        title: "Technical Specifications",
        summary: "Detailed technical specifications including system architecture, data models, and API documentation.",
        properties: {
            "Version": "2.3",
            "Last Reviewed": "2023-06-01",
            "Approved By": "Tech Lead",
            "Framework": "React",
            "Database": "PostgreSQL",
            "API Type": "RESTful",
        },
        createdTime: "2023-02-05 10:15 AM",
        updatedTime: "2023-06-10 11:45 AM",
        size: "3.7 MB",
    }
}

export const pageCardStyles = ` 
.page-icon::before {
  content: attr(data-ref); 
}
`

export interface TodoItem {
    id: string;
    text: string;
    maker: string
    completed: boolean;
}


export interface PageCardProps {
    icon?: string
    title?: string
    summary?: string
    properties?: { [K: string]: any }
    createdTime?: string
    updatedTime?: string
    size?: string
    color?: string
    cover?: string
    source?: string
    todoList?: TodoItem[]
    onTodoUpdate?: (updatedTodo: TodoItem) => void
    onSummaryUpdate?: (newSummary: string) => void
}

const PageCard = function Component({
    icon,
    title,
    summary,
    properties = {},
    createdTime,
    updatedTime,
    size,
    color,
    onSummaryUpdate
}: PageCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editedSummary, setEditedSummary] = useState(summary)
    const inputRef = useRef<HTMLInputElement>(null)
    const toggleExpand = () => setIsExpanded(!isExpanded)
    const propertyEntries = Object.entries(properties)
    const visibleProperties = isExpanded ? propertyEntries : propertyEntries.slice(0, 4)

    const handleDoubleClick = () => {
        logger.debug('PageCard handleDoubleClick', onSummaryUpdate)
        if (onSummaryUpdate) {
            setIsEditing(true)
        }
    }

    const handleSummaryUpdate = () => {
        logger.debug('PageCard handleSummaryUpdate')

        if (onSummaryUpdate) {
            onSummaryUpdate(editedSummary || '')
        }
        setIsEditing(false)
    }

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing])

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Card className="w-full max-w-md mx-auto hover:shadow-lg transition-shadow duration-300" style={{ backgroundColor: getColor(color) }}>
                        <CardHeader className="flex flex-row items-center gap-2 p-4">
                            {icon ? <span className='page-icon' date-ref={icon} /> : <FileIcon className="w-6 h-6 text-primary" data-ref={icon} />}
                            <CardTitle>{title || "Untitled Page"}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            {isEditing ? (
                                <div className="flex items-center space-x-2 mb-2">
                                    <Input
                                        ref={inputRef}
                                        value={editedSummary}
                                        onChange={(e) => setEditedSummary(e.target.value)}
                                        className="text-xs"
                                    />
                                    <Button onClick={handleSummaryUpdate} size="sm">OK</Button>
                                </div>
                            ) : (
                                summary && (
                                    <p
                                        className="text-xs text-muted-foreground mb-2 cursor-text"
                                        onDoubleClick={handleDoubleClick}
                                    >
                                        {summary}
                                    </p>
                                )
                            )}
                            {propertyEntries.length > 0 && (
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-300">
                                    {visibleProperties.map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className="font-medium truncate mr-1 page-property-key" data-ref={key}>{key}:</span>
                                            <span className="text-muted-foreground truncate">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {propertyEntries.length > 4 && (
                                <button
                                    onClick={toggleExpand}
                                    className="flex items-center text-primary text-xs mt-2"
                                    style={{ color: "#d1c5c5", fontSize: 'xx-small' }}
                                >
                                    {isExpanded ? (
                                        <>
                                            Show less <ChevronUp className="ml-1 w-3 h-3" />
                                        </>
                                    ) : (
                                        <>
                                            Show more <ChevronDown className="ml-1 w-3 h-3" />
                                        </>
                                    )}
                                </button>
                            )}
                        </CardContent>
                    </Card>
                </TooltipTrigger>
                <TooltipContent className="w-48">
                    <div className="space-y-1 text-xs">
                        {createdTime && (
                            <div className="flex items-center" data-ref='createdTime'>
                                <Clock className="w-3 h-3 mr-1" />
                                <span>Created: {createdTime}</span>
                            </div>
                        )}
                        {updatedTime && (
                            <div className="flex items-center" data-ref='updatedTime'>
                                <RefreshCw className="w-3 h-3 mr-1" />
                                <span>Updated: {updatedTime}</span>
                            </div>
                        )}
                        {size && (
                            <div className="flex items-center" data-ref='size'>
                                <HardDrive className="w-3 h-3 mr-1" />
                                <span>Size: {size}</span>
                            </div>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default PageCard;
