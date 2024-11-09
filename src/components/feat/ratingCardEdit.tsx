
import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Star, Clock, ExternalLink, Edit } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RatingCardProps } from './ratingCard'
import { getColor } from '../customs/color'

export default function RatingCard({
    rating: initRating = 0,
    review: initReview = '',
    color = "#f3f4f6",
    source: initSource = '',
    completed: initCompleted = '',
    time: initTime = '',
    updateRating,
    updateReview,
    updateSource,
    editable = false,
    updateAll
}: RatingCardProps) {
    const [rating, setRating] = useState(initRating)
    const [review, setReview] = useState(initReview)
    const [source, setSource] = useState(initSource)
    const [completed, setCompleted] = useState(initCompleted)
    const [time, setTime] = useState(initTime)
    const [isEditing, setIsEditing] = useState(false)
    const [isFullEditing, setIsFullEditing] = useState(false)
    const [tempRating, setTempRating] = useState(initRating)
    const [tempReview, setTempReview] = useState(initReview)
    const [tempSource, setTempSource] = useState(initSource)
    const [tempCompleted, setTempCompleted] = useState(initCompleted)
    const [tempTime, setTempTime] = useState(initTime)
    const [showTooltip, setShowTooltip] = useState(false)
    const reviewRef = useRef<HTMLParagraphElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if ((isEditing || isFullEditing) && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing, isFullEditing])

    // Handle click outside tooltip
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setShowTooltip(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleRatingClick = (newRating: number) => {
        const rating = newRating === tempRating ? newRating - 1 : newRating
        if (isFullEditing) {
            setTempRating(rating)
        } else {
            setRating(rating)
            if (updateRating) {
                updateRating(rating)
            }
        }
    }

    const handleReviewDoubleClick = () => {
        setIsEditing(true)
        setTempReview(review)
        setTempSource(source)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        switch (name) {
            case 'review':
                setTempReview(value)
                break
            case 'source':
                setTempSource(value)
                break
            case 'completed':
                setTempCompleted(value)
                break
            case 'time':
                setTempTime(value)
                break
        }
    }

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTempRating(Number(event.target.value))
    }

    const handleOk = () => {
        if (isFullEditing) {
            setRating(tempRating)
            setReview(tempReview)
            setSource(tempSource)
            setCompleted(tempCompleted)
            setTime(tempTime)
            setIsFullEditing(false)
            if (updateAll) {
                updateAll({ rating: tempRating, review: tempReview, source: tempSource, completed: tempCompleted, time: tempTime })
            }
        } else {
            setReview(tempReview)
            setSource(tempSource)
            setIsEditing(false)
            if (updateReview) updateReview(tempReview)
            if (updateSource) updateSource(tempSource)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setIsFullEditing(false)
        setTempRating(rating)
        setTempReview(review)
        setTempSource(source)
        setTempCompleted(completed)
        setTempTime(time)
    }

    const handleFullEdit = () => {
        setIsFullEditing(true)
        setTempRating(rating)
        setTempReview(review)
        setTempSource(source)
        setTempCompleted(completed)
        setTempTime(time)
    }

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                className={`w-5 h-5 cursor-pointer transition-colors ${star <= (isFullEditing ? tempRating : rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                onClick={() => handleRatingClick(star)}
            />
        ))
    }

    if (isFullEditing) {
        return (
            <Card className="w-full max-w-md mx-auto overflow-hidden" style={{ backgroundColor: getColor(color) }}>
                <CardContent className="p-4">
                    <form className="space-y-4">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">Rating</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        step="1"
                                        value={tempRating}
                                        onChange={handleSliderChange}
                                        className="w-full appearance-none h-2 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(tempRating / 5) * 100}%, #e5e7eb ${(tempRating / 5) * 100}%, #e5e7eb 100%)`
                                        }}
                                    />
                                    <span className="text-sm font-semibold min-w-[2ch]">{tempRating}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">Review</label>
                                <Textarea
                                    id="review"
                                    name="review"
                                    value={tempReview}
                                    onChange={handleInputChange}
                                    className="w-full min-h-[100px]"
                                    rows={3}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">Source</label>
                                <Input
                                    id="source"
                                    name="source"
                                    value={tempSource}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="completed" className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">Completed Date</label>
                                <Input
                                    id="completed"
                                    name="completed"
                                    type="date"
                                    value={tempCompleted}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">Time</label>
                                <Input
                                    id="time"
                                    name="time"
                                    type="time"
                                    value={tempTime}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button onClick={handleOk}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-4xl mx-auto overflow-visible" style={{ backgroundColor: getColor(color) }}>
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        {renderStars()}
                        <span className="ml-2 text-sm font-semibold">{rating.toString()}</span>
                    </div>
                    {editable && (
                        <Button variant="ghost" size="icon" onClick={handleFullEdit} className="text-gray-400 hover:text-gray-600">
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                {isEditing ? (
                    <div className="space-y-2">
                        <Input
                            ref={inputRef}
                            name="review"
                            value={tempReview}
                            onChange={handleInputChange}
                            placeholder="Enter your review"
                            className="w-full"
                        />
                        <Input
                            name="source"
                            value={tempSource}
                            onChange={handleInputChange}
                            placeholder="Enter source URL"
                            className="w-full"
                        />
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleOk}>
                                OK
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p
                            ref={reviewRef}
                            className="text-sm text-gray-600 mb-4 cursor-pointer"
                            onDoubleClick={handleReviewDoubleClick}
                        >
                            {review || "Double-click to add a review"}
                        </p>
                        <div className="flex items-center justify-between">
                            {source ? (
                                <div className="flex items-center text-sm text-blue-500 hover:underline">
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    <Link href={source}>查看来源</Link>
                                </div>
                            ) : <div></div>}
                            {(completed || time) && (
                                <div className="relative" ref={tooltipRef}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onMouseEnter={() => setShowTooltip(true)}
                                        onMouseLeave={() => setShowTooltip(false)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Clock className="h-4 w-4 opacity-70" />
                                    </Button>
                                    {showTooltip && (
                                        <div className="absolute w-auto min-w-max bottom-full right-0 mb-2 p-2 bg-white shadow-md rounded text-xs z-50 whitespace-nowrap">
                                            {completed && <p className="mb-1">完成于: {completed}</p>}
                                            {time && <p>时间: {time}</p>}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}