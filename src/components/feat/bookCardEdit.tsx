

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Book, Tag, Link as LinkIcon, ChevronDown, ChevronUp, Edit, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getColor, getColorBg } from './color'
import { BookCardProps } from './bookCard'
import { Question } from '@phosphor-icons/react'

export default function BookCard({
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
    color,
    editable = true,
    onUpdate
}: BookCardProps) {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isFullEditing, setIsFullEditing] = useState(false)
    const [tempDescription, setTempDescription] = useState(description)
    const [tempData, setTempData] = useState<BookCardProps>({
        cover, title, description, author, categories, tags, completed, time, readlater, recommendation, source
    })
    const [showTimeTooltip, setShowTimeTooltip] = useState(false)
    const [showInfoTooltip, setShowInfoTooltip] = useState(false)

    const descriptionRef = useRef<HTMLParagraphElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const timeTooltipRef = useRef<HTMLDivElement>(null)
    const infoTooltipRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if ((isEditing || isFullEditing) && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing, isFullEditing])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (timeTooltipRef.current && !timeTooltipRef.current.contains(event.target as Node)) {
                setShowTimeTooltip(false)
            }
            if (infoTooltipRef.current && !infoTooltipRef.current.contains(event.target as Node)) {
                setShowInfoTooltip(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const toggleDescription = () => setIsDescriptionExpanded(!isDescriptionExpanded)

    const truncateDescription = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text
        return text.slice(0, maxLength) + '...'
    }

    const handleDescriptionDoubleClick = () => {
        setIsEditing(true)
        setTempDescription(description)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setTempData(prev => ({ ...prev, [name]: value }))
    }

    const handleOk = () => {
        if (isFullEditing) {
            if (onUpdate) {
                onUpdate(tempData)
            }
            setIsFullEditing(false)
        } else {
            if (onUpdate) {
                onUpdate({ description: tempDescription })
            }
            setIsEditing(false)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setIsFullEditing(false)
        setTempDescription(description)
        setTempData({
            cover, title, description, author, categories, tags, completed, time, readlater, recommendation, source
        })
    }

    const handleFullEdit = () => {
        setIsFullEditing(true)
        setTempData({
            cover, title, description, author, categories, tags, completed, time, readlater, recommendation, source
        })
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setTempData(prev => ({ ...prev, cover: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const [isUrlInput, setIsUrlInput] = useState(true)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const toggleCoverInputType = () => {
        setIsUrlInput(!isUrlInput)
    }

    const categoryList = categories.split(',').map(cat => cat.trim())
    const tagList = tags.split(',').map(tag => tag.trim())

    if (isFullEditing) {
        return (
            <Card className={`w-full max-w-2xl mx-auto overflow-hidden ${getColorBg(color)}`} style={{ backgroundColor: getColor(color) }} >
                <CardContent className="p-6" >
                    <form className="space-y-4">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="cover" className="block text-sm font-medium text-gray-700 whitespace-nowrap" style={{ minWidth: '100px' }}>Cover</label>
                                <div className="flex items-center space-x-2 flex-grow">
                                    {isUrlInput ? (
                                        <Input
                                            id="cover"
                                            name="cover"
                                            value={tempData.cover}
                                            onChange={handleInputChange}
                                            className="w-full"
                                        />
                                    ) : (
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            ref={fileInputRef}
                                            className="w-full"
                                        />
                                    )}
                                    <Button type="button" onClick={toggleCoverInputType}>
                                        {isUrlInput ? 'Use File' : 'Use URL'}
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 whitespace-nowrap" style={{ minWidth: '100px' }}>Title</label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={tempData.title}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 whitespace-nowrap" style={{ minWidth: '100px' }}>Description</label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={tempData.description}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    rows={3}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="author" className="block text-sm font-medium text-gray-700 whitespace-nowrap" style={{ minWidth: '100px' }}>Author</label>
                                <Input
                                    id="author"
                                    name="author"
                                    value={tempData.author}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="categories" className="block text-sm font-medium text-gray-700 whitespace-nowrap" style={{ minWidth: '100px' }}>Categories</label>
                                <Input
                                    id="categories"
                                    name="categories"
                                    value={tempData.categories}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 whitespace-nowrap" style={{ minWidth: '100px' }}>Tags</label>
                                <Input
                                    id="tags"
                                    name="tags"
                                    value={tempData.tags}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="completed" className="block text-sm font-medium text-gray-700 whitespace-nowrap" style={{ minWidth: '100px' }}>Completed Date</label>
                                <Input
                                    id="completed"
                                    name="completed"
                                    type="date"
                                    value={tempData.completed}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700 whitespace-nowrap" style={{ minWidth: '100px' }}>Time</label>
                                <Input
                                    id="time"
                                    name="time"
                                    type="time"
                                    value={tempData.time}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="readlater" className="block text-sm font-medium text-gray-700 whitespace-nowrap" style={{ minWidth: '100px' }}>Read Later</label>
                                <Input
                                    id="readlater"
                                    name="readlater"
                                    value={tempData.readlater}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="recommendation" className="block text-sm font-medium text-gray-700 whitespace-nowrap" style={{ minWidth: '100px' }}>Recommendation</label>
                                <Input
                                    id="recommendation"
                                    name="recommendation"
                                    value={tempData.recommendation}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="source" className="block text-sm font-medium text-gray-700 whitespace-nowrap" style={{ minWidth: '100px' }}>Source</label>
                                <Input
                                    id="source"
                                    name="source"
                                    value={tempData.source}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button onClick={handleOk}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={`w-full max-w-2xl mx-auto overflow-visible ${getColorBg(color)}`} style={{ backgroundColor: getColor(color) }} onClick={() => setShowInfoTooltip(!showInfoTooltip)}>
            <div className="flex p-4">
                {cover && (
                    <div className="relative w-20 h-30 mr-4 flex-shrink-0">
                        <img src={cover} alt={`${title} cover`} className="w-full h-full object-cover rounded-md" />
                    </div>
                )}
                <div className="flex flex-col justify-between flex-grow">
                    <CardHeader className="p-0">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                            {editable && (
                                <Button variant="ghost" size="icon" onClick={handleFullEdit} className="text-gray-400 hover:text-gray-600">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        {description && (
                            <div className="relative mt-2">
                                {isEditing ? (
                                    <div className="space-y-2">
                                        <Textarea
                                            ref={inputRef}
                                            name="description"
                                            value={tempDescription}
                                            onChange={(e) => setTempDescription(e.target.value)}
                                            className="w-full"
                                            rows={3}
                                        />
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="outline" size="sm" onClick={handleCancel}>
                                                Cancel
                                            </Button>
                                            <Button size="sm" onClick={handleOk}>
                                                OK
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p
                                            ref={descriptionRef}
                                            className="text-sm text-muted-foreground cursor-pointer"
                                            onDoubleClick={handleDescriptionDoubleClick}
                                        >
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
                                    </>
                                )}
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="p-0 grid gap-2 mt-4">
                        {author && (
                            <div className="flex items-center">
                                <Book className="mr-2 h-4 w-4 opacity-70" />
                                <span className="text-sm">{author}</span>
                            </div>
                        )}
                        {categoryList.length > 0 && categoryList[0].trim() && (
                            <div className="flex flex-wrap gap-2">
                                {categoryList.map((category, index) => <Badge key={index} variant="secondary">{category}</Badge>
                                )}
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
                        <div className="flex items-center justify-between">
                            {source ? (
                                <div className="flex items-center">
                                    <LinkIcon className="mr-2 h-4 w-4 opacity-70" />
                                    <Link href={source} className="text-sm text-primary hover:underline">
                                        查看资源
                                    </Link>
                                </div>
                            ) : <div></div>}
                            {(completed || time) && (
                                <div className="relative" ref={timeTooltipRef}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onMouseEnter={() => setShowTimeTooltip(true)}
                                        onMouseLeave={() => setShowTimeTooltip(false)}
                                        className="h-8 w-8 p-0"
                                    >
                                        {showTimeTooltip ? <Info className="h-4 w-4 opacity-70" /> : <Question className="h-4 w-4 opacity-70" />}
                                    </Button>
                                    {showTimeTooltip && (
                                        <div className="absolute w-auto min-w-max bottom-full left-0 mb-2 p-2 bg-white shadow-md rounded text-xs z-50 whitespace-nowrap">
                                            {completed && <p className="mb-1">完成于: {completed}</p>}
                                            {time && <p>时间: {time}</p>}
                                            {readlater && <p className="mb-1">稍后阅读: {readlater}</p>}
                                            {recommendation && <p>推荐: {recommendation}</p>}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </CardContent>
                </div>
            </div>
            <div className="px-6 pb-4 flex justify-between items-center">
                {(readlater || recommendation) && (
                    <div className="relative" ref={infoTooltipRef}>
                        {showInfoTooltip && (
                            <div className="text-xs">
                                {readlater && <p className="mb-1">稍后阅读: {readlater}</p>}
                                {recommendation && <p>推荐: {recommendation}</p>}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    )
}