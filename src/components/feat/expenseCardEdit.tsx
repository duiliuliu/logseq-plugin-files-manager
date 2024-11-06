
import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { MapPin, Clock, DollarSign, Edit, ChevronDown, ChevronUp, Link, ShoppingCart } from "lucide-react"
import { getColor, getColorBg } from "./color"
import { ExpenseCardProps } from './expenseCard'

export default function ExpenseCard({
    title = '',
    amount = '',
    time = '',
    location = '',
    category = '',
    color = '',
    cover = '',
    source = '',
    description = '',
    platform = '',
    tags = '',
    display = 'left-image',
    icon = 'shopping-cart',
    editable = true,
    onUpdate
}: ExpenseCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
    const [tempData, setTempData] = useState({ title, amount, time, location, category, color, cover, source, description, platform, tags, display, icon })
    const [isUrlInput, setIsUrlInput] = useState(true)
    const [isSelectOpen, setIsSelectOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const selectRef = useRef<HTMLDivElement>(null)

    const redactedStyle = "bg-gray-300 text-transparent rounded select-none"
    const getredactedStyle = (isOverlay?: boolean) => {
        return isOverlay ? "text-accent-foreground rounded select-none hover:bg-accent" : ""
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setTempData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (value: string) => {
        // @ts-ignore
        setTempData(prev => ({ ...prev, display: value }))
        setIsSelectOpen(false)
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

    const handleSave = () => {
        if (onUpdate) {
            onUpdate(tempData)
        }
        setIsEditing(false)
    }

    const handleCancel = () => {
        setTempData({ title, amount, time, location, category, color, cover, source, description, platform, tags, display, icon })
        setIsEditing(false)
    }

    const handleDoubleClick = () => {
        if (editable) {
            setIsEditing(true)
        }
    }

    const toggleCoverInputType = () => {
        setIsUrlInput(!isUrlInput)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsSelectOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const renderContent = (isOverlay?: boolean) => (
        <>
            {amount && (
                <div className="flex items-center mb-2">
                    <DollarSign className={"mr-2 h-3 w-4 opacity-70"} />

                    <span className={"font-medium " + getredactedStyle(isOverlay)}>{amount} 元</span>
                </div>
            )}
            <div className="flex items-center mb-2">
                <Clock className={"mr-2 h-3 w-4 opacity-70"} />
                {time ? (
                    <span className={"text-muted-foreground " + getredactedStyle(isOverlay)}>{time}</span>
                ) : (
                    <span className={"text-muted-foreground " + getredactedStyle(isOverlay)}>{format(new Date(), "HH:mm")}</span>
                )}
            </div>
            {location && (
                <div className="flex items-center mb-2">
                    <MapPin className={"mr-2 h-3 w-4 opacity-70"} />
                    <span className={getredactedStyle(isOverlay)}>{location}</span>
                </div>)}
            {platform && (
                <div className="flex items-center mb-2"   >
                    <Link className={"mr-2 h-3 w-4 opacity-70"} />
                    <span className={getredactedStyle(isOverlay)}>{platform}</span>
                </div>
            )}
            {description && (
                <div className="mb-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="flex items-center text-xs text-gray-400 p-0 h-6"
                    >
                        {isDescriptionExpanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                        Description
                    </Button>
                    {isDescriptionExpanded && <p className={"text-xs mt-1 " + getredactedStyle(isOverlay)}>{description}</p>}
                </div>
            )}
        </>
    )

    const renderIcon = () => {
        if (icon === 'shopping-cart') {
            return <ShoppingCart className="w-6 h-6 mr-2" />
        }
        return <span className="w-6 h-6 mr-2" dangerouslySetInnerHTML={{ __html: icon }} />
    }

    if (isEditing) {
        return (
            <Card className="w-full max-w-md mx-auto overflow-hidden">
                <CardContent className="p-4">
                    <form className="space-y-4 max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={tempData.title}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    name="amount"
                                    value={tempData.amount}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="time">Time</Label>
                                <Input
                                    id="time"
                                    name="time"
                                    type="time"
                                    value={tempData.time}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={tempData.location}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    name="category"
                                    value={tempData.category}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="color">Color</Label>
                                <Input
                                    id="color"
                                    name="color"
                                    type="color"
                                    value={tempData.color}
                                    onChange={handleInputChange}
                                    className="w-full h-10"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="cover">Cover</Label>
                            <div className="flex items-center space-x-2">
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
                        <div>
                            <Label htmlFor="source">Source</Label>
                            <Input
                                id="source"
                                name="source"
                                value={tempData.source}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={tempData.description}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Label htmlFor="platform">Platform</Label>
                            <Input
                                id="platform"
                                name="platform"
                                value={tempData.platform}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                name="tags"
                                value={tempData.tags}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Label htmlFor="icon">Icon</Label>
                            <Input
                                id="icon"
                                name="icon"
                                value={tempData.icon}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        <div ref={selectRef}>
                            <Label htmlFor="display">Display</Label>
                            <div className="relative">
                                <Button
                                    type="button"
                                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                                    className="w-full justify-between"
                                >
                                    {tempData.display}
                                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} />
                                </Button>
                                {isSelectOpen && (
                                    <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
                                        {['left-image', 'right-image', 'top-image', 'bottom-image', 'overlay'].map((option) => (
                                            <Button
                                                key={option}
                                                type="button"
                                                onClick={() => handleSelectChange(option)}
                                                className="w-full justify-start"
                                            >
                                                {option}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>Save</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        )
    }

    const categoryTags = category.trim().split(',').map(cat => cat.trim())
    const tagList = tags.trim().split(',').map(tag => tag.trim())

    return (
        <Card
            className={`w-full max-w-md mx-auto overflow-hidden ${getColorBg(color)}`}
            style={{ backgroundColor: getColor(color) }}
            onDoubleClick={handleDoubleClick}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center">
                    {renderIcon()}
                    <CardTitle className="text-lg font-semibold">
                        {title || <span className={redactedStyle}>马赛克标题</span>}
                    </CardTitle>
                </div>
                <div className="flex flex-wrap gap-1">
                    {categoryTags.length > 0 && categoryTags[0].trim() && categoryTags.map((cat, index) => (
                        <Badge key={`category-${index}`} variant="secondary">{cat}</Badge>
                    ))}
                    {tagList.length > 0 && tagList[0].trim() && tagList.map((tag, index) => (
                        <Badge key={`tag-${index}`} variant="outline">{tag}</Badge>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="grid gap-2 text-xs p-4">
                {display === 'overlay' && cover ? (
                    <div className="relative h-48">
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                        <img src={cover} alt={title} className="w-full h-full object-cover opacity-30" />
                        <div className="absolute inset-0 text-white p-4">
                            {renderContent(true)}
                        </div>
                    </div>
                ) : (
                    <div className={`grid ${display.includes('left') || display.includes('right') ? 'grid-cols-2 gap-4' : 'grid-cols-1'}`}>
                        {(display === 'left-image' || display === 'top-image') && cover && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-25"></div>
                                <img src={cover} alt={title} className="w-full h-auto object-cover" style={{ maxHeight: '200px' }} />
                            </div>
                        )}
                        <div>{renderContent()}</div>
                        {(display === 'right-image' || display === 'bottom-image') && cover && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white opacity-25"></div>
                                <img src={cover} alt={title} className="w-full h-auto object-cover" style={{ maxHeight: '200px' }} />
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4">
                {source ? (
                    <a href={source} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                        Source
                    </a>
                ) : <div></div>}
                {editable && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}