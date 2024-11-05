
import { Plane, UtensilsCrossed } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { format } from 'date-fns'
import { getColor, getColorBg } from './color'

export const getdefaultFilghtTicketProps = (dateFormat?: string) => {
    const defaultProps: FlightTicketProps = {
        date: dateFormat ? `[[${format(new Date(), dateFormat)}]]` : format(new Date(), "yyyy-MM-dd"),
        weekday: '星期五',
        fromCity: '上海',
        toCity: '深圳',
        departureTime: '11:00',
        arrivalTime: '13:00',
        departureAirport: '浦东机场T1',
        arrivalAirport: '宝山机场T2',
        flightNumber: 'CZ3587',
        airline: '中国南方航空',
        status: '准时',
        seatInfo: '经济舱 14A',
        mealInfo: '有餐食',
        color: 'dark'
    }
    return defaultProps
}

export interface FlightTicketProps {
    date?: string
    weekday?: string
    fromCity?: string
    toCity?: string
    departureTime?: string
    arrivalTime?: string
    departureAirport?: string
    arrivalAirport?: string
    flightNumber?: string
    airline?: string
    status?: string
    seatInfo?: string
    mealInfo?: string
    color?: string
    cover?: string
    editable?: boolean
    onUpdate?: (updatedData: Partial<FlightTicketProps>) => void
}

const FlightTicket = function Component({
    date = format(new Date(), "yyyy-MM-dd"),
    weekday = '星期x',
    fromCity = '**City',
    toCity = '**City',
    departureTime = 'xx:xx',
    arrivalTime = 'xx:xx',
    departureAirport = '**机场',
    arrivalAirport = '**机场T2',
    flightNumber = 'CZ****',
    airline = '****航空',
    status = '准时',
    seatInfo = '经济舱 **A|B',
    mealInfo = '有餐食',
    color = 'dark'
}: FlightTicketProps) {
    return (
        <div className={`relative w-full max-w-[600px] overflow-hidden rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 p-4 text-white ${getColorBg(color)}`} style={{ backgroundColor: getColor(color) }} >
            {/* City Skyline Background */}
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
                    {/* Left Section: Flight Info */}
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

                    {/* Right Section: Time and Status */}
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

                {/* Bottom Section: Seat and Meal Info */}
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

export default FlightTicket;