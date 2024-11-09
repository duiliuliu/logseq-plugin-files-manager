
import { useState } from 'react'
import { format } from 'date-fns'
import { Plane, UtensilsCrossed, Edit } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getColor, getColorBg } from '../customs/color'
import { FlightTicketProps } from './flightTicket'


export default function FlightTicket({
    date = format(new Date(), "yyyy-MM-dd"),
    weekday = '星期五',
    fromCity = '上海',
    toCity = '深圳',
    departureTime = '11:00',
    arrivalTime = '13:00',
    departureAirport = '浦东机场T1',
    arrivalAirport = '宝山机场T2',
    flightNumber = 'CZ3587',
    airline = '中国南方航空',
    status = '准时',
    seatInfo = '经济舱 14A',
    mealInfo = '有餐食',
    color = 'dark',
    cover = '',
    editable = false,
    onUpdate
}: FlightTicketProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [tempData, setTempData] = useState({
        date, weekday, fromCity, toCity, departureTime, arrivalTime, departureAirport, arrivalAirport,
        flightNumber, airline, status, seatInfo, mealInfo, color, cover
    })

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        setTempData(prev => ({ ...prev, [name]: value }))
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
        setTempData({
            date, weekday, fromCity, toCity, departureTime, arrivalTime, departureAirport, arrivalAirport,
            flightNumber, airline, status, seatInfo, mealInfo, color, cover
        })
        setIsEditing(false)
    }

    const handleDoubleClick = () => {
        setIsEditing(true)
    }

    if (isEditing) {
        return (
            <Card className="w-full max-w-[600px] mx-auto overflow-hidden">
                <CardContent className="p-4">
                    <form className="space-y-4 max-h-[80vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="date" className="text-right">Date</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={tempData.date}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="weekday" className="text-right">Weekday</Label>
                                <Input
                                    id="weekday"
                                    name="weekday"
                                    value={tempData.weekday}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="fromCity" className="text-right">From City</Label>
                                <Input
                                    id="fromCity"
                                    name="fromCity"
                                    value={tempData.fromCity}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="toCity" className="text-right">To City</Label>
                                <Input
                                    id="toCity"
                                    name="toCity"
                                    value={tempData.toCity}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="departureTime" className="text-right">Departure Time</Label>
                                <Input
                                    id="departureTime"
                                    name="departureTime"
                                    type="time"
                                    value={tempData.departureTime}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="arrivalTime" className="text-right">Arrival Time</Label>
                                <Input
                                    id="arrivalTime"
                                    name="arrivalTime"
                                    type="time"
                                    value={tempData.arrivalTime}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="departureAirport" className="text-right">Departure Airport</Label>
                                <Input
                                    id="departureAirport"
                                    name="departureAirport"
                                    value={tempData.departureAirport}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="arrivalAirport" className="text-right">Arrival Airport</Label>
                                <Input
                                    id="arrivalAirport"
                                    name="arrivalAirport"
                                    value={tempData.arrivalAirport}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="flightNumber" className="text-right">Flight Number</Label>
                                <Input
                                    id="flightNumber"
                                    name="flightNumber"
                                    value={tempData.flightNumber}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="airline" className="text-right">Airline</Label>
                                <Input
                                    id="airline"
                                    name="airline"
                                    value={tempData.airline}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <Input
                                    id="status"
                                    name="status"
                                    value={tempData.status}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="seatInfo" className="text-right">Seat Info</Label>
                                <Input
                                    id="seatInfo"
                                    name="seatInfo"
                                    value={tempData.seatInfo}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="mealInfo" className="text-right">Meal Info</Label>
                                <Input
                                    id="mealInfo"
                                    name="mealInfo"
                                    value={tempData.mealInfo}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="color" className="text-right">Color</Label>
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
                        <div>
                            <Label htmlFor="cover" className="text-right">Cover Image</Label>
                            <Input
                                id="cover"
                                name="cover"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full"
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
        <div
            className={`relative w-full max-w-[600px] overflow-hidden rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 p-4 text-white ${getColorBg(color)}`}
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
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url(${cover})` }}
                />
            )}
            <div
                className="absolute inset-x-0 bottom-0 h-16 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 120'%3E%3Cpath fill='%23fff' d='M0,100 L50,90 L100,100 L150,85 L200,95 L250,80 L300,90 L350,70 L400,85 L450,75 L500,90 L550,80 L600,95 L650,85 L700,100 L750,80 L800,90 L850,75 L900,85 L950,90 L1000,100 L1000,120 L0,120 Z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat-x',
                    backgroundPosition: 'bottom',
                }}
            />

            <Card className="relative overflow-hidden bg-white p-4 text-slate-900">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-sm font-bold text-blue-600">
                                {flightNumber}
                            </span>
                            <span className="text-sm text-gray-500">{airline}</span>
                        </div>
                        <div className="mb-2 text-gray-800 text-lg font-bold">
                            {fromCity} → {toCity}
                        </div>
                        <div className="text-sm text-gray-500">
                            {date} {weekday}
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="mb-2 flex items-center justify-end gap-2">
                            <Plane className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-600">{status}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div>
                                <div className="text-lg text-gray-800 font-bold">{departureTime}</div>
                                <div className="text-sm text-gray-500">{departureAirport}</div>
                            </div>
                            <div className="flex items-center">
                                <div className="h-px w-6 bg-gray-300"></div>
                                <Plane className="h-5 w-5 text-gray-400" />
                                <div className="h-px w-6 bg-gray-300"></div>
                            </div>
                            <div>
                                <div className="text-lg text-gray-800 font-bold">{arrivalTime}</div>
                                <div className="text-sm text-gray-500">{arrivalAirport}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                    <span className="font-medium text-blue-600">{seatInfo}</span>
                    <div className="flex items-center gap-1 text-gray-500">

                        <UtensilsCrossed className="h-4 w-4" />
                        <span>{mealInfo}</span>
                    </div>
                </div>
            </Card>
        </div>
    )
}