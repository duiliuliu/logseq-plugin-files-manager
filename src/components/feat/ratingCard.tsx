import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Star, Info, ExternalLink } from "lucide-react"
import Link from "next/link"
import { getColor } from "./color"

export const getdefaultRatingCardProps = () => {
    const defaultRatingCardProps: RatingCardProps = {
        rating: 4.5,
        review: "这是一个很棒的产品，我非常喜欢！",
        color: "#e0f2fe",
        source: "https://example.com/review",
        completed: "2023-12-18",
        time: "12:35",
        editable: false
    }
    return defaultRatingCardProps
}

export interface RatingCardProps {
    rating?: number
    review?: string
    color?: string
    source?: string
    completed?: string
    time?: string
    updateRating?: (rating: number) => void
    updateReview?: (review: string) => void
    updateSource?: (source: string) => void
    editable?: boolean
    updateAll?: (data: { rating: number; review: string; source: string; completed: string; time: string }) => void
}

const RatingCard = function Component({
    rating = 0,
    review,
    color = "#f3f4f6",
    source,
    completed,
    time
}: RatingCardProps) {

    return (
        <TooltipProvider>
            <Card className="w-full max-w-md mx-auto overflow-hidden" style={{ backgroundColor: getColor(color) }}>
                <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                        }`}
                                />
                            ))}
                            <span className="ml-2 text-sm font-semibold">{rating.toString()}</span>
                        </div>
                    </div>
                    {review && (
                        <p className="text-sm text-gray-600 mb-2">{review}</p>
                    )}

                    <div className="flex items-center justify-between">
                        {source && (
                            <div className="flex items-center text-sm text-blue-500 hover:underline">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                <Link href={source}>查看来源</Link>
                            </div>
                        )}
                        {(completed || time) && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 opacity-70 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    {completed && <p>完成于: {completed}</p>}
                                    {time && <p>时间: {time}</p>}
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>


                </CardContent>
            </Card>
        </TooltipProvider>
    )
}

export default RatingCard;