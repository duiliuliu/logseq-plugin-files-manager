import React, { useState, useRef, useEffect, ReactNode } from 'react'
import { Button } from "@/components/ui/button"
import { logger } from '@/utils/logger'

interface TooltipProps {
    icon: ReactNode | ((showTooltip: boolean) => ReactNode)
    text: ReactNode
    className?: string
    containerRef?: React.RefObject<HTMLDivElement>
}

const Tooltip: React.FC<TooltipProps> = ({ icon, text, className = "", containerRef }) => {
    logger.debug('init Tooltip', { icon, text, className, containerRef })
    const [showTooltip, setShowTooltip] = useState(false)
    const tooltipRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (showTooltip && tooltipRef.current && containerRef?.current) {
            const tooltipRect = tooltipRef.current.getBoundingClientRect()
            const containerRect = containerRef.current.getBoundingClientRect()

            if (tooltipRect.right > containerRect.right) {
                tooltipRef.current.style.right = '0'
                tooltipRef.current.style.left = 'auto'
            }
            if (tooltipRect.bottom > containerRect.bottom) {
                logger.debug('tooltipRect.bottom > containerRect.bottom', tooltipRect.bottom, containerRect.bottom)
                tooltipRef.current.style.bottom = '100%'
                tooltipRef.current.style.top = 'auto'
            }
        }
    }, [showTooltip, containerRef])

    return (
        <div className={`relative ${className}`}>
            <Button
                variant="ghost"
                size="icon"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="h-8 w-8 p-0"
                aria-label="Show information"
            >
                {typeof icon === 'function' ? icon(showTooltip) : icon}
            </Button>
            {showTooltip && (
                <div ref={tooltipRef} className="absolute w-auto min-w-max p-2 bg-white shadow-md rounded text-xs z-10 whitespace-nowrap">
                    {text}
                </div>
            )}
        </div>
    )
}

export default Tooltip