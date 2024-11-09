
import { Plane, UtensilsCrossed } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { FlightTicketProps } from './flightTicket'
import { format } from 'date-fns'
import { getColor, getColorBg } from '../customs/color'

const FlightTicket2 = function Component({
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
  color = 'white'
}: FlightTicketProps) {
  return (
    <div className="relative w-full max-w-[600px] overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 p-1 text-white shadow-lg" style={{ backgroundColor: getColor(color) }}>
      <Card className={`relative overflow-hidden ${getColorBg(color)}`}>
        <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            {/* Left Section: Flight Info */}
            <div className="mb-4 sm:mb-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-blue-100 px-2 py-1 text-sm font-bold text-blue-600">
                  {flightNumber}
                </span>
                <span className="text-sm text-gray-500">{airline}</span>
              </div>
              <div className="mb-2 text-lg font-bold text-gray-800">
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
                  <div className="text-lg font-bold text-gray-800">{departureTime}</div>
                  <div className="text-sm text-gray-500">{departureAirport}</div>
                </div>
                <div className="flex items-center">
                  <div className="h-px w-6 bg-gray-300"></div>
                  <Plane className="h-5 w-5 text-blue-500" />
                  <div className="h-px w-6 bg-gray-300"></div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-800">{arrivalTime}</div>
                  <div className="text-sm text-gray-500">{arrivalAirport}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Seat and Meal Info */}
          <div className="mt-6 flex items-center justify-between rounded-lg bg-gray-50 p-4 text-sm">
            <span className="font-medium text-blue-600">{seatInfo}</span>
            <div className="flex items-center gap-1 text-gray-500">
              <UtensilsCrossed className="h-4 w-4" />
              <span>{mealInfo}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default FlightTicket2