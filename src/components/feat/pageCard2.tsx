
import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronDown, ChevronUp, FileIcon, Clock, RefreshCw, HardDrive } from "lucide-react"
import { PageCardProps } from './pageCard'
import { getColor } from './color'
import { logger } from '@/utils/logger'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const PageCard2 = function Component({
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
        logger.debug('PageCard handleDoubleClick',onSummaryUpdate)
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
                        <CardHeader className="flex flex-row items-center gap-2">
                            {icon ? <span className='page-icon' date-ref={icon} /> : <FileIcon className="w-6 h-6 text-primary" data-ref={icon} />}
                            <CardTitle>{title || "Untitled Page"}</CardTitle>
                        </CardHeader>
                        <CardContent>
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
                                        className="text-xs text-muted-foreground mb-4 cursor-text"
                                        onDoubleClick={handleDoubleClick}
                                    >
                                        {summary}
                                    </p>
                                )
                            )}
                            {propertyEntries.length > 0 && (
                                <div className="space-y-2">
                                    {visibleProperties.map(([key, value]) => (
                                        <div key={key} className="flex justify-between text-xs text-gray-300">
                                            <span className="font-medium page-property-key" data-ref={key}>{key}:</span>
                                            <span className="text-muted-foreground ">{value}</span>
                                        </div>
                                    ))}
                                    {propertyEntries.length > 4 && (
                                        <button
                                            onClick={toggleExpand}
                                            className="flex items-center text-primary text-sm mt-2 text-gray-200"
                                            style={{ color: "#d1c5c5", fontSize: 'xx-small' }}
                                        >
                                            {isExpanded ? (
                                                <>
                                                    Show less <ChevronUp className="ml-1 w-4 h-4" />
                                                </>
                                            ) : (
                                                <>
                                                    Show more <ChevronDown className="ml-1 w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TooltipTrigger>
                <TooltipContent className="w-64">
                    <div className="space-y-2">
                        {createdTime && (
                            <div className="flex items-center" data-ref='createdTime'>
                                <Clock className="w-4 h-4 mr-2" />
                                <span className="text-sm">Created: {createdTime}</span>
                            </div>
                        )}
                        {updatedTime && (
                            <div className="flex items-center" data-ref='updatedTime'>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                <span className="text-sm">Updated: {updatedTime}</span>
                            </div>
                        )}
                        {size && (
                            <div className="flex items-center" data-ref='size'>
                                <HardDrive className="w-4 h-4 mr-2" />
                                <span className="text-sm">Size: {size}</span>
                            </div>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default PageCard2