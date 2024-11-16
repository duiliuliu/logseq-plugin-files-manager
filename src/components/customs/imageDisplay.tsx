import React, { useState, useEffect, useRef } from 'react'
import { logger } from '@/utils/logger'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { CardHeader, CardTitle } from "@/components/ui/card"
import { BLANK_IMAGE } from './assetInput'

interface ImageDisplayProps {
    cover: string
    title: string
    description?: string
    position: string
    children: React.ReactNode
    gridSize?: number // New optional parameter for grid size
}

const BLANK_IMAGE_SVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3C/svg%3E'

export function ImageDisplay({ cover, title, description, position, children, gridSize = 300 }: ImageDisplayProps) {
    logger.debug('init ImageDisplay', { cover, title, description, position, children, gridSize })
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const gridContainerRef = useRef<HTMLDivElement>(null)

    const covers = cover ? cover.split(',').map(url => url.trim() === BLANK_IMAGE ? BLANK_IMAGE_SVG : url.trim() || BLANK_IMAGE_SVG) : []

    useEffect(() => {
        if (covers.length > 1 && position !== 'nine-grid') {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % covers.length)
            }, 5000)
            return () => clearInterval(interval)
        }
    }, [covers, position])

    const renderNineGrid = () => {
        const gridImages = [...covers]
        while (gridImages.length < 9) {
            gridImages.push(BLANK_IMAGE_SVG)
        }

        return (
            <>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </CardHeader>
                <div className="px-6 pb-6">
                    <div
                        ref={gridContainerRef}
                        className="nine-grid-container grid grid-cols-3 gap-2 relative"
                        style={{ height: `${gridSize}px` }}
                    >
                        {gridImages.slice(0, 9).map((src, index) => (
                            <div
                                key={index}
                                className="relative aspect-square cursor-pointer transition-transform hover:scale-105"
                                onClick={() => setPreviewImage(src)}
                            >
                                <img
                                    src={src}
                                    alt={`${title} ${index + 1}`}
                                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                                />
                                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity rounded-md">
                                    <Maximize2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )
    }

    const renderImagePreview = () => {
        if (!previewImage) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-75 p-4" style={{ paddingTop: '100px' }}>
                <div className="relative w-full h-full max-w-2xl max-h-[80vh] flex items-center justify-center">
                    <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain rounded-lg"
                        style={{
                            maxWidth: 'min(80vw, 600px)',
                            maxHeight: '70vh'
                        }}
                    />
                </div>
            </div>
        )
    }

    const renderImageControls = () => {
        if (covers.length <= 1) return null

        return (
            <div
                className={`absolute left-0 right-0 flex justify-between items-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + covers.length) % covers.length)
                    }}
                    className="bg-gray-200 bg-opacity-50 text-gray-700 p-2 rounded-full ml-2 transition-all duration-300 hover:bg-opacity-75 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 transform hover:scale-110 active:scale-95"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % covers.length)
                    }}
                    className="bg-gray-200 bg-opacity-50 text-gray-700 p-2 rounded-full mr-2 transition-all duration-300 hover:bg-opacity-75 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 transform hover:scale-110 active:scale-95"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        )
    }

    const renderSingleImage = () => (
        <div className="relative w-full h-full">
            <img
                src={covers[currentImageIndex]}
                alt={title}
                className={`w-full h-full object-cover ${position === 'overlay' ? 'opacity-70' : ''}`}
            />
        </div>
    )

    if (position === 'nine-grid') {
        return (
            <>
                {renderNineGrid()}
                {renderImagePreview()}
            </>
        )
    }

    if (position === 'overlay') {
        return (
            <div
                className="relative h-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                {renderSingleImage()}
                {renderImageControls()}
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
                <div
                    className="relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className={`absolute inset-0 bg-gradient-to-${isHorizontal ? 'r' : 'b'} from-transparent to-white opacity-25`}></div>
                    {renderSingleImage()}
                    {renderImageControls()}
                </div>
            )}
            <div>{children}</div>
            {!imageFirst && (
                <div
                    className="relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className={`absolute inset-0 bg-gradient-to-${isHorizontal ? 'l' : 't'} from-transparent to-white opacity-25`}></div>
                    {renderSingleImage()}
                    {renderImageControls()}
                </div>
            )}
        </div>
    )
}