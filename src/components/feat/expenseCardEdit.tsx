import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { MapPin, Clock, DollarSign, Utensils, HelpCircle, Edit } from "lucide-react"
import { getColor, getColorBg } from "./color"
import { ExpenseCardProps } from './expenseCard'

export default function ExpenseCard({
    title = '',
    amount = '',
    time = '',
    location = '',
    category = '',
    color = '',
    editable = true,
    onUpdate
}: ExpenseCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [tempData, setTempData] = useState({ title, amount, time, location, category, color })

    const redactedStyle = "bg-gray-300 text-transparent rounded select-none"

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setTempData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        if (onUpdate) {
            onUpdate(tempData)
        }
        setIsEditing(false)
    }

    const handleCancel = () => {
        setTempData({ title, amount, time, location, category, color })
        setIsEditing(false)
    }

    const handleDoubleClick = () => {
        setIsEditing(true)
    }

    if (isEditing) {
        return (
            <Card className="w-full max-w-md mx-auto overflow-hidden">
                <CardContent className="p-4">
                    <form className="space-y-4 max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title" className="text-right">
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={tempData.title}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="amount" className="text-right">
                                    Amount
                                </Label>
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
                                <Label htmlFor="time" className="text-right">
                                    Time
                                </Label>
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
                                <Label htmlFor="location" className="text-right">
                                    Location
                                </Label>
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
                                <Label htmlFor="category" className="text-right">
                                    Category
                                </Label>
                                <Input
                                    id="category"
                                    name="category"
                                    value={tempData.category}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label className="text-right">Color</Label>
                                <Input
                                    id="color"
                                    name="color"
                                    type="color"
                                    value={tempData.color}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
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

    return (
        <Card className={`w-full max-w-md mx-auto ${getColorBg(color)}`} style={{ backgroundColor: getColor(color) }} onDoubleClick={handleDoubleClick}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">
                    {title || <span className={redactedStyle}>马赛克标题</span>}
                </CardTitle>
                {editable && <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-gray-600">
                    <Edit className="h-4 w-4" />
                </Button>}
            </CardHeader>
            <CardContent className="grid gap-4 text-xs">
                <div className="flex items-center">
                    <DollarSign className="mr-2 h-3 w-4 opacity-70" />
                    {amount ? (
                        <span className="font-medium">{amount} 元</span>
                    ) : (
                        <span className={redactedStyle}>马赛克金额</span>
                    )}
                </div>
                <div className="flex items-center">
                    <Clock className="mr-2 h-3 w-4 opacity-70" />
                    {time ? (
                        <span>{time}</span>
                    ) : (
                        <span className="text-muted-foreground">{format(new Date(), "HH:mm")}</span>
                    )}
                </div>
                <div className="flex items-center">
                    <MapPin className="mr-2 h-3 w-4 opacity-70" />
                    {location ? (
                        <span>{location}</span>
                    ) : (
                        <span className={redactedStyle}>马赛克地点</span>
                    )}
                </div>
                <div className="flex items-center">
                    {category ? (
                        <>
                            <Utensils className="mr-2 h-3 w-4 opacity-70" />
                            <span>{category}</span>
                        </>
                    ) : (
                        <>
                            <HelpCircle className="mr-2 h-3 w-4 opacity-70" />
                            <span className={redactedStyle}>马赛克类别</span>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}