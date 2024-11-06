
import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp, Clock, RefreshCw, HardDrive, FileIcon, Link, ArrowRight, ArrowLeft } from "lucide-react"
import { getColor } from './color'
import { format } from 'date-fns'
import { PageCardProps, TodoItem } from './pageCard'


export default function PageCardPro({
    icon,
    title,
    summary,
    properties = {},
    createdTime,
    updatedTime,
    size,
    color,
    cover,
    source,
    todoList = [],
    onSummaryUpdate,
    onTodoUpdate
}: PageCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editedSummary, setEditedSummary] = useState(summary)
    const [showTimeInfo, setShowTimeInfo] = useState(false)
    const [showTodoList, setShowTodoList] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const cardContentRef = useRef<HTMLDivElement>(null)
    const propertiesRef = useRef<HTMLDivElement>(null)
    const todoListRef = useRef<HTMLDivElement>(null)
    const toggleExpand = () => setIsExpanded(!isExpanded)
    const propertyEntries = Object.entries(properties)
    const visibleProperties = isExpanded ? propertyEntries : propertyEntries.slice(0, 4)

    const handleDoubleClick = () => {
        if (onSummaryUpdate) {
            setIsEditing(true)
        }
    }

    const handleSummaryUpdate = () => {
        if (onSummaryUpdate) {
            onSummaryUpdate(editedSummary || '')
        }
        setIsEditing(false)
    }

    const handleTodoToggle = (todo: TodoItem) => {
        if (onTodoUpdate) {
            onTodoUpdate({ ...todo, completed: !todo.completed })
        }
    }

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing])

    useEffect(() => {
        if (cardContentRef.current && propertiesRef.current && todoListRef.current) {
            const propertiesHeight = propertiesRef.current.scrollHeight
            const todoListHeight = todoListRef.current.scrollHeight
            const maxHeight = Math.max(propertiesHeight, todoListHeight)
            cardContentRef.current.style.height = `${maxHeight}px`
        }
    }, [showTodoList, isExpanded, properties, todoList])

    return (
        <Card className="w-full max-w-md mx-auto hover:shadow-lg transition-shadow duration-300" style={{ backgroundColor: getColor(color) }}>
            <CardHeader className="flex flex-row items-center gap-2 p-3">
                {icon ? (
                    <span className="text-2xl bg-gray-200 rounded-full p-2 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: icon }} />
                ) : (
                    <FileIcon className="w-6 h-6 text-gray-400" />
                )}
                <CardTitle className="flex-grow text-lg">{title || "Untitled Page"}
                    <Button variant="ghost" size="sm" asChild className="ml-2">
                        <a onClick={() => { logseq.App.pushState('page', { name: title, }); }}>
                            <Link className="w-4 h-4" />
                        </a>
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 transition-all duration-300" ref={cardContentRef}>
                {(cover || source) && (
                    <div className="mb-3 relative" style={{ maxHeight: '200px', overflow: 'hidden' }}>
                        {cover && <img src={cover} alt={title} className="w-full object-cover" style={{ maxHeight: '200px' }} />}
                        {source && (
                            <video controls className="w-full" style={{ maxHeight: '200px' }}>
                                <source src={source} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                )}
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
                <div className="relative overflow-hidden">
                    <div
                        ref={propertiesRef}
                        className={`properties transition-transform duration-300 ${showTodoList ? 'translate-x-0 hidden' : '-translate-x-full'}`}
                        style={{ position: showTodoList ? 'absolute' : 'relative', width: '100%' }}
                    >
                        {propertyEntries.length > 0 && (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-300">
                                {visibleProperties.map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                        <span className="font-medium truncate mr-1 page-property-key" data-ref={key}>{key}:</span>
                                        <span className="text-muted-foreground truncate text-right">{value}&nbsp;&nbsp;</span>
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
                    </div>
                    <div
                        ref={todoListRef}
                        className={`absolute top-0 left-full w-full transition-transform duration-300 ${showTodoList ? '-translate-x-full' : 'translate-x-0 hidden'}`}
                        style={{ position: showTodoList ? 'relative' : 'absolute', width: '100%' }}
                    >
                        {todoList.length > 0 && (
                            <div className="space-y-2">
                                {todoList.map((todo) => (
                                    <div key={todo.id} className="flex items-center">
                                        <Checkbox
                                            id={`todolist${todo.id}`}
                                            checked={todo.completed}
                                            onCheckedChange={() => handleTodoToggle(todo)}
                                        />
                                        <label
                                            htmlFor={`todolist${todo.id}`}
                                            className={`ml-2 text-xs ${todo.completed ? 'line-through text-gray-400' : ''}`}
                                        >
                                            {todo.text.length > 32 ? todo.text.replace(todo.maker, '').substring(0, 32) + '...' : todo.text.replace(todo.maker, '')}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex items-center p-3">
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Button variant="ghost" size="sm" onMouseEnter={() => setShowTimeInfo(true)} onMouseLeave={() => setShowTimeInfo(false)}>
                            <Clock className="w-4 h-4" />
                        </Button>
                        {showTimeInfo && (
                            <div className="absolute w-auto min-w-max bottom-full left-0 mb-2 p-2 bg-white shadow-md rounded text-xs z-10 whitespace-nowrap">
                                {createdTime && (
                                    <div className="flex items-center mb-1">
                                        <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                                        <span>Created: {format(parseInt(createdTime), "yyyy-MM-dd HH:mm:ss")}</span>
                                    </div>
                                )}
                                {updatedTime && (
                                    <div className="flex items-center mb-1">
                                        <RefreshCw className="w-3 h-3 mr-1 flex-shrink-0" />
                                        <span>Updated: {format(parseInt(updatedTime), "yyyy-MM-dd HH:mm:ss")}</span>
                                    </div>
                                )}
                                {size && (
                                    <div className="flex items-center">
                                        <HardDrive className="w-3 h-3 mr-1 flex-shrink-0" />
                                        <span>Size: {size}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {todoList.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => setShowTodoList(!showTodoList)}>
                            {showTodoList ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}