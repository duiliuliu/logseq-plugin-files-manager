
import { QRCodeSVG } from 'qrcode.react'
import { ArrowRight } from '@phosphor-icons/react'
import { useId } from 'react'

interface TrainTicketProps {
    fromStation?: string
    toStation?: string
    trainNumber?: string
    date?: string
    departureTime?: string
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


const TrainTicket = function Component({
    fromStation = 'beijing',
    toStation = 'shanghai',
    trainNumber = '01-002',
    date = '2024-04-05',
    departureTime = '08:28',
    color = 'green'
}: TrainTicketProps) {
    const id = useId()
    const ticketNumber = `${Math.random().toString(36).substring(2, 10).toUpperCase()}Q`

    return (
        <div className={`relative w-full max-w-[520px] overflow-hidden rounded-lg ${colorMap[color]} p-4 font-mono shadow-lg`} style={{ backgroundColor: colorPMap[color] || color }}>
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

                {/* Stations */}
                <div className="flex items-center justify-between text-xl">
                    <span>{fromStation} 站</span>
                    <ArrowRight className="mx-4 h-5 w-5" />
                    <span>{toStation} 站</span>
                </div>

                {/* Date and Train Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        {new Date(date).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                        })} {departureTime}开
                    </div>
                    <div>{trainNumber}号</div>
                </div>

                {/* Additional Info */}
                <div className="text-sm">
                    <div>新至通特等座</div>
                    <div className="text-gray-600">限乘当日当次车</div>
                </div>

                {/* Bottom Section with QR Code */}
                <div className="relative mt-2 flex justify-between border-t border-gray-300 pt-2">
                    <div className="flex-1">
                        <div className="mb-1 flex justify-between text-sm text-gray-600">
                            <span>买票请到12306</span>
                            <span>发货请到95306</span>
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