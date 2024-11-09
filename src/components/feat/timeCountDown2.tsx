import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTargetTime } from "./timeCountdown"
import { getColor } from "../customs/color"

export const getdefaultCountdownTimerProps = (): CountdownTimerProps => {
    return {
        targetDate: '2024-12-31 23:59:59',
        message: '新年快乐',
        color: "white",
        animationStyle: "flip"
    }
}

interface CountdownTimerProps {
    targetDate: string | Date
    message: string
    color?: string
    fontColor?: string
    animationStyle?: "flip" | "float" | "slide" | "push" | "fade" | "cover"
}

const CountdownTimer = function Component({
    targetDate,
    message,
    color = "#f4a261",
    fontColor = "dark",
    animationStyle = "flip"
}: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        daysUpdated: false,
        hoursUpdated: false,
        minutesUpdated: false,
    })
    const targetTime = getTargetTime(targetDate)

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = targetTime - new Date().getTime()
            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, daysUpdated: false, hoursUpdated: false, minutesUpdated: false })
                return
            }

            setTimeLeft((prev) => {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24))
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
                const minutes = Math.floor((difference / 1000 / 60) % 60)
                const seconds = Math.floor((difference / 1000) % 60)

                return {
                    days: days,
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds,
                    daysUpdated: prev.days !== days,
                    hoursUpdated: prev.hours !== hours,
                    minutesUpdated: prev.minutes !== minutes,
                }
            })
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [targetDate, targetTime])

    const AnimatedNumber = ({ value, label, updated }: { value: number, label: string, updated: boolean }) => (
        <div className="flex flex-col items-center">
            <div
                className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl sm:text-3xl font-bold relative overflow-hidden ${updated ? animationStyle : ''}`}
                style={{ backgroundColor: getColor(color), color: fontColor }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    {String(value).padStart(2, '0')}
                </div>
                {updated && (
                    <div className="absolute inset-0 flex items-center justify-center animate-countdown">
                        {String(value).padStart(2, '0')}
                    </div>
                )}
            </div>
            <span className="mt-2 text-sm" style={{ color: fontColor }}>{label}</span>
        </div>
    )

    return (
        <Card className="w-full max-w-md mx-auto overflow-hidden" style={{ backgroundColor: getColor(color) }}>
            <CardHeader>
                <CardTitle className="text-center text-gray-300">{message}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-center space-x-2">
                    <AnimatedNumber value={timeLeft.days} label="天" updated={timeLeft.daysUpdated} />
                    <span className="text-2xl font-bold mt-[-1rem]" style={{ color: fontColor }}>:</span>
                    <AnimatedNumber value={timeLeft.hours} label="时" updated={timeLeft.hoursUpdated} />
                    <span className="text-2xl font-bold mt-[-1rem]" style={{ color: fontColor }}>:</span>
                    <AnimatedNumber value={timeLeft.minutes} label="分" updated={timeLeft.minutesUpdated} />
                    <span className="text-2xl font-bold mt-[-1rem]" style={{ color: fontColor }}>:</span>
                    <AnimatedNumber value={timeLeft.seconds} label="秒" updated={true} />
                </div>
            </CardContent>
        </Card>
    )
}

export default CountdownTimer