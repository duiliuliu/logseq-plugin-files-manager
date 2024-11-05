
import { useState } from 'react'
import { format } from 'date-fns'
import { QRCodeSVG } from 'qrcode.react'
import { useId } from 'react'
import { getColor, getColorBg } from './color'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from "lucide-react"
import { TrainTicketProps } from './trainTicket'
import { logger } from '@/utils/logger'

export default function TrainTicket({
    fromStation = '北京',
    toStation = '上海',
    trainNumber = 'G717',
    date = format(new Date(), "yyyy-MM-dd"),
    departureTime = '10:00',
    arrivalTime = "20:00",
    seatInfo = '一等座',
    color = 'green',
    editable = false,
    onUpdate
}: TrainTicketProps) {
    logger.debug('TrainTicket init', seatInfo, arrivalTime, date, toStation)
    const [isEditing, setIsEditing] = useState(false)
    const [tempData, setTempData] = useState({
        fromStation, toStation, trainNumber, date, departureTime, arrivalTime, seatInfo, color
    })
    const id = useId()
    const ticketNumber = `${Math.random().toString(36).substring(2, 10).toUpperCase()}Q`
    const isnextday = compareTimes(departureTime, arrivalTime) != '-1'

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        setTempData({
            fromStation, toStation, trainNumber, date, departureTime, arrivalTime, seatInfo, color
        })
        setIsEditing(false)
    }

    const handleDoubleClick = () => {
        setIsEditing(true)
    }

    function compareTimes(time1: string, time2: string) {
        try {
            const date1 = new Date(`1970-01-01T${time1}:00`)
            const date2 = new Date(`1970-01-01T${time2}:00`)
            if (date1 < date2) return '-1'
            else if (date1 > date2) return '1'
            else return '0'
        } catch (error) {
            return '-1'
        }
    }

    if (isEditing) {
        return (
            <Card className="w-full max-w-[520px] mx-auto overflow-hidden">
                <CardContent className="p-4">
                    <form className="space-y-4 max-h-[80vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="fromStation" className="text-right">From Station</Label>
                                <Input
                                    id="fromStation"
                                    name="fromStation"
                                    value={tempData.fromStation}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="toStation" className="text-right">To Station</Label>
                                <Input
                                    id="toStation"
                                    name="toStation"
                                    value={tempData.toStation}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="trainNumber" className="text-right">Train Number</Label>
                                <Input
                                    id="trainNumber"
                                    name="trainNumber"
                                    value={tempData.trainNumber}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
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
                                <Label htmlFor="seatInfo" className="text-right">Seat Info</Label>
                                <Input
                                    id="seatInfo"
                                    name="seatInfo"
                                    value={tempData.seatInfo}
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
            className={`relative w-full max-w-[520px] overflow-hidden rounded-lg ${getColorBg(color)} p-4 font-mono shadow-lg`}
            style={{ minWidth: 410, backgroundColor: getColor(color) }}
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
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23999' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />
            <div className="relative space-y-2">
                <div className="text-lg font-bold text-red-600">{ticketNumber}</div>
                <div className="flex items-center justify-between text-xl">
                    <div className="flex flex-col items-center mb-2 text-gray-800 text-lg font-bold">
                        <span>{fromStation} 站</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-sm font-semibold text-blue-600">{trainNumber}号</span>
                        <div className="h-px w-20 bg-gray-300"></div>
                    </div>
                    <div className="flex flex-col items-center mb-2 text-gray-800 text-lg font-bold">
                        <span>{toStation} 站</span>
                    </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 gap-8">
                    <span>{new Date(date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    })} {departureTime}开</span>
                    <span>{isnextday ? "明天" : "今天"}{arrivalTime}到</span>
                </div>
                <div className="text-sm">
                    <div>{seatInfo}</div>
                    <div className="text-gray-600">限乘当日当次车</div>
                </div>
                <div className="relative mt-2 flex justify-between border-t border-gray-300 pt-2">
                    <div className="flex-1">
                        <div className="mb-1 flex justify-between text-sm text-gray-600">
                            <span>买票请到12306</span>
                            <span>咨询请联系95306</span>
                        </div>
                        <div className="text-center text-xs text-gray-500">
                            中国铁路旅客运输保险
                        </div>
                    </div>
                    <div className="ml-4 h-[46px] w-[46px]">
                        <QRCodeSVG
                            value={`ticket:${id}`}
                            size={46}
                            className="rounded-sm bg-white p-0.5"
                        />
                    </div>
                </div>
                <div className="mt-2 h-6 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=')] bg-repeat-x" />
            </div>
        </div>
    )
}