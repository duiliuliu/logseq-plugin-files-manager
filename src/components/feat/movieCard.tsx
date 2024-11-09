
import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star, Clock, Calendar, Film, Edit, ChevronDown, ChevronUp } from "lucide-react"
import { getColor, getColorBg } from "../customs/color"

export const getdefaultMovieCardProps = (): MovieCardProps => {
    return {
        title: "test moview",
        source: 'https://upload.wikimedia.org/wikipedia/zh/7/7f/Inception_ver3.jpg',
        rating: 5,
        date: '2016-12-04',
        duration: '2H',
        categories: 'string',
        description: 'string',
        review: 'string',
        editable: false
    }
}

export interface MovieCardProps {
    title?: string
    source?: string
    rating?: number
    date?: string
    duration?: string
    categories?: string
    description?: string
    review?: string
    color?: string
    editable?: boolean
    onUpdate?: (updatedData: Partial<MovieCardProps>) => void
}

export default function MovieCard({
    title = "Untitled Movie",
    source = "",
    rating = 0,
    date = "",
    duration = "",
    categories = "",
    description = "",
    review = "",
    color = "",
    editable = false,
    onUpdate
}: MovieCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isReviewExpanded, setIsReviewExpanded] = useState(false)
    const [tempData, setTempData] = useState({
        title, source, rating, date, duration, categories, description, review, color
    })
    const [isUrlInput, setIsUrlInput] = useState(true)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setTempData(prev => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }))
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setTempData(prev => ({ ...prev, cover: file.name }))
        }
    }

    const handleSave = () => {
        if (onUpdate) {
            onUpdate(tempData)
        }
        setIsEditing(false)
    }

    const handleCancel = () => {
        setTempData({ title, source, rating, date, duration, categories, description, review, color })
        setIsEditing(false)
    }

    const handleDoubleClick = () => {
        setIsEditing(true)
    }

    const togglePosterInputType = () => {
        setIsUrlInput(!isUrlInput)
    }

    const formatDate = (dateString: string) => {
        if (dateString.length === 4) {
            return dateString // It's just a year
        }
        const date = new Date(dateString)
        return isNaN(date.getTime()) ? dateString : date.toLocaleDateString()
    }

    if (isEditing) {
        return (
            <Card className="w-full max-w-md mx-auto overflow-hidden"  >
                <CardContent className="p-4">
                    <form className="space-y-4 max-h-[80vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={tempData.title}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="rating" className="text-right">Rating</Label>
                                <Input
                                    id="rating"
                                    name="rating"
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={tempData.rating}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="date" className="text-right">Date</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    value={tempData.date}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="duration" className="text-right">Duration</Label>
                                <Input
                                    id="duration"
                                    name="duration"
                                    value={tempData.duration}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="categories" className="text-right">Categories</Label>
                            <Input
                                id="categories"
                                name="categories"
                                value={tempData.categories}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                value={tempData.description}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Label htmlFor="review" className="text-right">Review</Label>
                            <Textarea
                                id="review"
                                name="review"
                                value={tempData.review}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Label htmlFor="source" className="text-right">Source</Label>
                            <div className="flex items-center space-x-2">
                                {isUrlInput ? (
                                    <Input
                                        id="source"
                                        name="source"
                                        value={tempData.source}
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
                                <Button type="button" onClick={togglePosterInputType}>
                                    {isUrlInput ? 'Use File' : 'Use URL'}
                                </Button>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="color" className="text-right">Color</Label>
                            <Input
                                id="color"
                                name="color"
                                type="color"
                                value={tempData.color}
                                onChange={handleInputChange}
                                className="w-full h-10"
                            />
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

    return (
        <Card
            className={`w-full max-w-sm mx-auto overflow-hidden ${getColorBg(color)}`}
            style={{ backgroundColor: getColor(color), minWidth: 360, }}
            onDoubleClick={handleDoubleClick}
        >
            {editable && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
                >
                    <Edit className="h-4 w-4" />
                </Button>
            )}
            <div className="relative h-64 w-full">
                {source ? (
                    <img src={source} alt={`${title} poster`} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Film className="w-12 h-12 text-gray-400" />
                    </div>
                )}
            </div>
            <CardHeader>
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    {rating > 0 && (
                        <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span>{rating.toFixed(1)}</span>
                        </div>
                    )}
                    {date && (
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{formatDate(date)}</span>
                        </div>
                    )}
                    {duration && (
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{duration}</span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {categories && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {categories.split(',').map((category, index) => (
                            <Badge key={index} variant="secondary">
                                {category.trim()}
                            </Badge>
                        ))}
                    </div>
                )}
                {description && (
                    <p className="text-sm mb-2">
                        <span className="font-semibold">Description:</span> {description}
                    </p>
                )}
                {review && (
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsReviewExpanded(!isReviewExpanded)}
                            className="flex items-center mb-2 text-gray-200"
                        >
                            {isReviewExpanded ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                            Review
                        </Button>
                        {isReviewExpanded && <p className="text-sm text-muted-foreground">{review}</p>}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}