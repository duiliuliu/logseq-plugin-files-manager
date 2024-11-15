
import { Circle } from '@phosphor-icons/react'
import { getColor, getColorBg } from '../customs/color'
import { format } from 'date-fns'

export const getdefaultItineraryProps = (dateFormat?: string) => {
    const defaultProps: ItineraryProps = {
        date: dateFormat ? `[[${format(new Date(), dateFormat)}]]` : format(new Date(), "yyyy-MM-dd"),
        fromCity: '上海',
        toCity: '深圳',
        departureTime: '11:00',
        arrivalTime: '13:00',
        departureAirport: '浦东机场T1',
        arrivalAirport: '宝山机场T2',
        flightNumber: 'CZ3587',
        airline: '中国南方航空',
        seatInfo: '经济舱 14A',
        mealInfo: '有餐食',
    }
    return defaultProps
}

export interface ItineraryProps {
    date?: string
    fromCity?: string
    toCity?: string
    departureTime?: string
    arrivalTime?: string
    departureAirport?: string
    arrivalAirport?: string
    flightNumber?: string
    airline?: string
    seatInfo?: string
    mealInfo?: string
    color?: 'green' | 'blue' | 'pink' | 'yellow' | ''
}

function calculateTimeDifference(departureTime: string, arrivalTime: string) {
    // 将时间字符串转换为分钟
    const toMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // 计算时间差（分钟）
    const departureMinutes = toMinutes(departureTime);
    const arrivalMinutes = toMinutes(arrivalTime);
    let differenceInMinutes = arrivalMinutes - departureMinutes;
    if (differenceInMinutes < 0) { differenceInMinutes = differenceInMinutes + 24 * 60 }

    // 将时间差转换为小时和分钟
    const hours = Math.floor(differenceInMinutes / 60);
    const minutes = differenceInMinutes % 60;

    // 返回格式化的时间差
    return `${hours}小时${minutes}分钟`;
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
    airline = '波音737(中)',
    seatInfo = '经济舱',
    mealInfo = '有餐食',
    color = ''
}: ItineraryProps) {
    const duration = calculateTimeDifference(arrivalTime, departureTime)
    return (
        <div className={`w-full max-w-md rounded-lg border-2 border-dashed border-red-400 p-4 ${getColorBg(color)}`} style={{ backgroundColor: getColor(color) }} >
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
                            <span>{seatInfo}</span>
                            <span>|</span>
                            <span>{airline}</span>
                        </div>
                        {mealInfo && <div className="mt-1 text-orange-500">{mealInfo}</div>}
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