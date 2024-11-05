
import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, DollarSign, Utensils, Edit } from "lucide-react"
import { getColor, getColorBg } from "./color"
import { FoodCardProps } from './foodCard'
import { logger } from '@/utils/logger'

export default function FoodCard({
    title = "金悦轩",
    description = "鲜虾泡饭和水晶虾饺",
    location = "珠海",
    avgCost = 180,
    category = "粤菜",
    recommendation = "金悦轩的鲜虾泡饭和水晶虾饺都非常美味，推荐尝试。",
    cover = "/placeholder.svg?height=200&width=400",
    color = '',
    editable = false,
    onUpdate
}: FoodCardProps) {
    logger.debug('FoodCard init', cover)
    const [isEditing, setIsEditing] = useState(false)
    const [tempData, setTempData] = useState({
        title, description, location, avgCost, category, recommendation, cover, color
    })
    const [isUrlInput, setIsUrlInput] = useState(true)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setTempData(prev => ({ ...prev, [name]: name === 'avgCost' ? Number(value) : value }))
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
        setTempData({ title, description, location, avgCost, category, recommendation, cover, color })
        setIsEditing(false)
    }

    const handleDoubleClick = () => {
        setIsEditing(true)
    }

    const toggleCoverInputType = () => {
        setIsUrlInput(!isUrlInput)
    }

    if (isEditing) {
        return (
            <Card className="w-full max-w-md mx-auto overflow-hidden">
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
                                <Label htmlFor="category" className="text-right">Category</Label>
                                <Input
                                    id="category"
                                    name="category"
                                    value={tempData.category}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
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
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="location" className="text-right">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={tempData.location}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="avgCost" className="text-right">Avg Cost</Label>
                                <Input
                                    id="avgCost"
                                    name="avgCost"
                                    type="number"
                                    value={tempData.avgCost}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="recommendation" className="text-right">Recommendation</Label>
                            <Textarea
                                id="recommendation"
                                name="recommendation"
                                value={tempData.recommendation}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Label htmlFor="cover" className="text-right">Cover</Label>
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
            className={`w-full max-w-md mx-auto overflow-hidden ${getColorBg(color)}`}
            style={{ backgroundColor: getColor(color) }}
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
            {cover && (
                <div className="relative w-full h-40">
                    <img
                        src={cover}
                        alt={`${title} cover`}
                    />
                </div>
            )}
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                    {category && <Badge>{category}</Badge>}
                </div>
                {description && (
                    <p className="text-sm text-muted-foreground">特色菜：{description}</p>
                )}
            </CardHeader>
            <CardContent className="grid gap-4">
                {location && (
                    <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 opacity-70" />
                        <span>{location}</span>
                    </div>
                )}
                {avgCost && (
                    <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4 opacity-70" />
                        <span>人均 {avgCost} 元</span>
                    </div>
                )}
                {recommendation && (
                    <div className="flex items-start">
                        <Utensils className="mr-2 h-4 w-4 opacity-70 mt-1 flex-shrink-0" />
                        <p className="text-sm">{recommendation}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}