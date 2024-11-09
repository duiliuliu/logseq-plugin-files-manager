
import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { getColor } from "../customs/color"

export const countDownStyles = `

.flip-card {
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flip-card.flip {
  transform: rotateX(180deg);
}

@keyframes flipTop {
  0% {
    transform: rotateX(0deg);
  }

  100% {
    transform: rotateX(-180deg);
  }
}

@keyframes flipBottom {
  0% {
    transform: rotateX(180deg);
  }

  100% {
    transform: rotateX(0deg);
  }
}


@keyframes countdown {
  0% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateY(-100%);
    opacity: 0;
  }
}

.animate-countdown {
  animation: countdown 1s linear infinite;
}

.flip {
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.float {
  transition: transform 0.6s, opacity 0.6s;
}

.slide {
  transition: transform 0.6s;
}

.push {
  transition: transform 0.6s;
}

.fade {
  transition: opacity 0.6s;
}

.cover {
  transition: clip-path 0.6s;
}

.flip .animate-countdown {
  transform: rotateX(-180deg);
}

.float .animate-countdown {
  transform: translateY(-100%);
  opacity: 0;
}

.slide .animate-countdown {
  transform: translateY(-100%);
}

.push .animate-countdown {
  transform: translateY(-100%) scale(0.8);
}

.fade .animate-countdown {
  opacity: 0;
}

.cover .animate-countdown {
  clip-path: inset(0 0 100% 0);
}
`

export const getdefaultFlipCountDownProps = () => {
  const defaultFlipCountDownProps: FlipCountdownProps = {
    targetDate: `${new Date().getFullYear()}-12-31T00:00:00`,
    color: "dark",
    message: "新年快乐!"
  }
  return defaultFlipCountDownProps
}

interface FlipCountdownProps {
  targetDate?: Date | string
  color?: string
  message?: string
}

export const getTargetTime = (targetDate?: Date | string): number => {
  if (!targetDate) {
    return new Date().getTime()
  }
  let targetTime
  if (typeof targetDate === 'string') {
    try {
      targetTime = new Date(targetDate).getTime()
    } catch (error) {

    }
  } else {
    targetTime = targetDate.getTime()
  }
  return targetTime || new Date().getTime()
}

const FlipCountDown = function Component({
  targetDate = "2024-12-31T00:00:00",
  color = "#f4a261",
  message = "倒计时结束!"
}: FlipCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isFinished, setIsFinished] = useState(false)
  const targetTime = getTargetTime(targetDate)

  // 1. Add state and ref for tooltip
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  // 2. Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetTime - new Date().getTime()
      if (difference <= 0) {
        setIsFinished(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const FlipCard = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center">
      <Card
        className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl sm:text-3xl font-bold text-gray-600 relative overflow-hidden flip-card"
        style={{ backgroundColor: getColor(color) }}
      >
        {String(value).padStart(2, '0')}
      </Card>
      <span className="mt-2 text-sm text-muted-foreground">{label}</span>
    </div>
  )

  if (isFinished) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center space-y-4" style={{ backgroundColor: getColor(color) }}>
        <p className="text-xl font-bold text-gray-300">{message}</p>
        <p className="text-gray-300 opacity-80">倒计时已结束</p>
      </Card>
    )
  }

  return (
    <>
      <div className="flex items-center space-x-2" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
        <FlipCard value={timeLeft.days} label="天" />
        <span className="text-2xl font-bold mt-[-1rem]">:</span>
        <FlipCard value={timeLeft.hours} label="时" />
        <span className="text-2xl font-bold mt-[-1rem]">:</span>
        <FlipCard value={timeLeft.minutes} label="分" />
        <span className="text-2xl font-bold mt-[-1rem]">:</span>
        <FlipCard value={timeLeft.seconds} label="秒" />
      </div>
      <div className="relative" ref={tooltipRef}>
        {showTooltip && (
          <div className="absolute w-auto min-w-max bottom-full top-0 mb-2 p-2 bg-white shadow-md rounded text-xs z-50 whitespace-nowrap">
            <p>{message}</p>
          </div>
        )}
      </div>
    </>

  )
}

export default FlipCountDown
