import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Star, Clock, ExternalLink, Edit } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { RatingCardProps } from './ratingCard'

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
    const reviewRef = useRef<HTMLParagraphElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if ((isEditing || isFullEditing) && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing, isFullEditing])

    const handleRatingClick = (newRating: number) => {
        if (isFullEditing) {
            setTempRating(newRating)
        } else {
            setRating(newRating)
            if (updateRating) {
                updateRating(newRating)
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

    const handleSliderChange = (value: number[]) => {
        setTempRating(value[0])
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
                className={`w-5 h-5 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                onClick={() => handleRatingClick(star)}
            />
        ))
    }

    if (isFullEditing) {
        return (
            <Card className="w-full max-w-md mx-auto overflow-hidden" style={{ backgroundColor: color }}>
                <CardContent className="p-4">
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <div className="flex items-center space-x-2">
                                <Slider  
                                    value={[tempRating]}
                                    onValueChange={handleSliderChange}
                                    max={5}
                                    step={1}
                                    className="w-full bg-slate-200"
                                />
                                <span className="text-sm font-semibold">{tempRating}</span>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                            <Textarea
                                id="review"
                                name="review"
                                value={tempReview}
                                onChange={handleInputChange}
                                className="w-full"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                            <Input
                                id="source"
                                name="source"
                                value={tempSource}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="completed" className="block text-sm font-medium text-gray-700 mb-1">Completed Date</label>
                            <Input
                                id="completed"
                                name="completed"
                                type="date"
                                value={tempCompleted}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
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
                    </form>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md mx-auto overflow-hidden" style={{ backgroundColor: color }}>
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                        {renderStars()}
                        <span className="ml-2 text-sm font-semibold">{rating.toString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={handleFullEdit} className="text-gray-400 hover:text-gray-600">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
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
                            className="text-sm text-gray-600 mb-2 cursor-pointer"
                            onDoubleClick={handleReviewDoubleClick}
                        >
                            {review || "Double-click to add a review"}
                        </p>
                        <div className="flex items-center justify-between">
                            {source && (
                                <div className="flex items-center text-sm text-blue-500 hover:underline">
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    <Link href={source}>查看来源</Link>
                                </div>
                            )}
                            {(completed || time) && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Clock className="h-4 w-4 opacity-70 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {completed && <p>完成于: {completed}</p>}
                                            {time && <p>时间: {time}</p>}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}