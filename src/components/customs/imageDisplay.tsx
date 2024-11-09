import { logger } from '@/utils/logger'
import { useState, useEffect } from 'react'

interface ImageDisplayProps {
    cover: string
    title: string
    position: string
    children: React.ReactNode
}

export function ImageDisplay({ cover, title, position, children }: ImageDisplayProps) {
    logger.debug('init ImageDisplay', { cover, title, position, children })
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const covers = cover ? cover.split(',').map(url => url.trim()) : []

    useEffect(() => {
        if (covers.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % covers.length)
            }, 5000)
            return () => clearInterval(interval)
        }
    }, [covers])

    const imageStyle: React.CSSProperties = {
        objectFit: 'cover',
        width: '100%',
        height: '100%',
    }

    if (position === 'overlay') {
        return (
            <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                <img src={covers[currentImageIndex]} alt={title} style={imageStyle} className="opacity-70" />
                <div className="absolute inset-0 text-white p-4">
                    {children}
                </div>
            </div>
        )
    }

    const isHorizontal = position === 'left-image' || position === 'right-image'
    const imageFirst = position === 'left-image' || position === 'top-image'

    return (
        <div className={`grid ${isHorizontal ? 'grid-cols-2' : 'grid-rows-2'} gap-4`}>
            {imageFirst && (
                <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-${isHorizontal ? 'r' : 'b'} from-transparent to-white opacity-25`}></div>
                    <img src={covers[currentImageIndex]} alt={title} style={imageStyle} />
                </div>
            )}
            <div>{children}</div>
            {!imageFirst && (
                <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-${isHorizontal ? 'l' : 't'} from-transparent to-white opacity-25`}></div>
                    <img src={covers[currentImageIndex]} alt={title} style={imageStyle} />
                </div>
            )}
        </div>
    )
}