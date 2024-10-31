
import { Circle } from '@phosphor-icons/react'

export interface ItineraryProps {
    date?: string
    fromCity?: string
    toCity?: string
    departureTime?: string
    arrivalTime?: string
    departureAirport?: string
    arrivalAirport?: string
    flightNumber?: string
    aircraft?: string
    cabin?: string
    duration?: string
    hasMeal?: boolean
}

const Itinerary = function Component({
    date = '09月22日',
    fromCity = '北京',
    toCity = '上海',
    departureTime = '04:01',
    arrivalTime = '06:15',
    departureAirport = '首都国际机场',
    arrivalAirport = '上海虹桥机场',
    flightNumber = 'MU9711',
    aircraft = '波音737(中)',
    cabin = '经济舱',
    duration = '2小时14分',
    hasMeal = true
}: ItineraryProps) {
    return (
        <div className="w-full max-w-md rounded-lg border-2 border-dashed border-red-400 p-4">
            {/* Header - Cities */}
            <div className="mb-4 text-lg font-bold">
                {date}{fromCity}→{toCity}
            </div>

            {/* Flight Timeline */}
            <div className="relative flex gap-6">
                {/* Timeline Line */}
                <div className="relative flex flex-col items-center">
                    <Circle className="relative z-10 h-3 w-3 fill-blue-600 text-blue-600" />
                    <div className="absolute top-3 h-[calc(100%-12px)] w-0.5 bg-gray-200" />
                    <Circle className="relative z-10 mt-auto h-3 w-3 fill-blue-600 text-blue-600" />
                </div>

                {/* Timeline Content */}
                <div className="flex-1 space-y-8">
                    {/* Departure */}
                    <div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-xl font-bold">{departureTime}</span>
                            <span className="text-gray-600">{departureAirport}</span>
                        </div>
                    </div>

                    {/* Flight Info */}
                    <div className="text-sm text-gray-600">
                        <div className="space-x-2">
                            <span>东航{flightNumber}</span>
                            <span>|</span>
                            <span>{cabin}</span>
                            <span>|</span>
                            <span>{aircraft}</span>
                        </div>
                        {hasMeal && <div className="mt-1 text-orange-500">有餐食</div>}
                    </div>

                    {/* Duration */}
                    <div className="text-sm text-gray-500">
                        {duration}
                    </div>

                    {/* Arrival */}
                    <div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-xl font-bold">{arrivalTime}</span>
                            <span className="text-gray-600">{arrivalAirport}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                            {date}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Itinerary;