
import { format } from 'date-fns'
import { QRCodeSVG } from 'qrcode.react'
import { useId } from 'react'

export interface TrainTicketProps {
    fromStation?: string
    toStation?: string
    trainNumber?: string
    date?: string
    departureTime?: string
    arrivalTime?: string
    seatInfo?: string
    color?: 'green' | 'blue' | 'pink' | 'yellow'
}

const colorMap = {
    green: 'bg-[#e8f6f6]',
    blue: 'bg-[#e8f0f6]',
    pink: 'bg-[#f6e8e8]',
    yellow: 'bg-[#f6f3e8]',
}


const colorPMap = {
    green: '#e8f6f6',
    blue: '#e8f0f6',
    pink: '#f6e8e8',
    yellow: '#f6f3e8',
}

function compareTimes(time1: string, time2: string) {
    try {
        // 将时间字符串转换为Date对象
        const date1 = new Date(`1970-01-01T${time1}:00`);
        const date2 = new Date(`1970-01-01T${time2}:00`);

        // 比较两个Date对象
        if (date1 < date2) {
            return `-1`; // time1 < time2
        } else if (date1 > date2) {
            return `1`; // time1 > time2
        } else {
            return `0`; // time1 = time2
        }
    } catch (error) {
        return `-1`; // time1 < time2
    }
}


const TrainTicket = function Component({
    fromStation = '**',
    toStation = '**',
    trainNumber = 'G****',
    date = format(new Date(), "yyyy-MM-dd"),
    departureTime = 'xx:xx',
    arrivalTime = "xx:xx",
    color = 'green',
    seatInfo = 'x等座',

}: TrainTicketProps) {
    const id = useId()
    const ticketNumber = `${Math.random().toString(36).substring(2, 10).toUpperCase()}Q`
    const isnextday = compareTimes(departureTime, arrivalTime) != '-1'

    return (
        <div className={`relative w-full max-w-[520px] overflow-hidden rounded-lg ${colorMap[color]} p-4 font-mono shadow-lg`} style={{ minWidth: 410, backgroundColor: colorPMap[color] || color }}>
            {/* Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23999' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Content */}
            <div className="relative space-y-2">
                {/* Ticket Number */}
                <div className="text-lg font-bold text-red-600">{ticketNumber}</div>

                {/* Stations and Train Number */}
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


                {/* Date and Train Info */}

                <div className="flex justify-between text-sm text-gray-500 gap-8">
                    <span> {new Date(date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    })} {departureTime}开</span>
                    <span>{isnextday ? "明天" : "今天"}{arrivalTime}到</span>
                </div>

                {/* Additional Info */}
                <div className="text-sm">
                    <div>{seatInfo}</div>
                    <div className="text-gray-600">限乘当日当次车</div>
                </div>

                {/* Bottom Section with QR Code */}
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

                    {/* QR Code aligned with text height */}
                    <div className="ml-4 h-[46px] w-[46px]">
                        <QRCodeSVG
                            value={`ticket:${id}`}
                            size={46}
                            className="rounded-sm bg-white p-0.5"
                        />
                    </div>
                </div>

                {/* Barcode */}
                <div className="mt-2 h-6 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=')] bg-repeat-x" />
            </div>
        </div>
    )
}

export default TrainTicket;