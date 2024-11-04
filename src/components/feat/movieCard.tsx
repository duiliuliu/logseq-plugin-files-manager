import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Calendar, Film } from "lucide-react"
import Image from "next/image"

export const getdefaultMovieCardProps = (): MovieCardProps => {
    return {
        title: "Inception",
        posterUrl: "https://picsum.photos/seed/inception/300/450",
        rating: 8.8,
        date: '2010',
        duration: "2h 28min",
        genres: "Action,Adventure,Sci-Fi",
        director: "Christopher Nolan",
        summary: "A thief who enters the dreams of others to steal secrets from their subconscious is offered a chance to regain his old life as payment for a task considered to be impossible: 'inception', the implantation of another person's idea into a target's subconscious."
    }
}

export interface MovieCardProps {
    title?: string
    posterUrl?: string
    rating?: number
    date?: string
    duration?: string
    genres?: string
    director?: string
    summary?: string
}

const MovieCard = function Component({
    title = "Untitled Movie",
    posterUrl,
    rating,
    date,
    duration,
    genres,
    director,
    summary
}: MovieCardProps) {
    return (
        <Card className="w-full max-w-sm mx-auto overflow-hidden">
            <div className="relative h-64 w-full">
                {posterUrl ? (
                    <Image
                        src={posterUrl}
                        alt={`${title} poster`}
                        layout="fill"
                        objectFit="cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Film className="w-12 h-12 text-gray-400" />
                    </div>
                )}
            </div>
            <CardHeader>
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    {rating && (
                        <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span>{rating.toFixed(1)}</span>
                        </div>
                    )}
                    {date && (
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{date}</span>
                        </div>
                    )}
                    {duration && (
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{duration}</span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {genres && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {genres.split(',').map((genre, index) => (
                            <Badge key={index} variant="secondary">
                                {genre}
                            </Badge>
                        ))}
                    </div>
                )}
                {director && (
                    <p className="text-sm mb-2">
                        <span className="font-semibold">Director:</span> {director}
                    </p>
                )}
                {summary && <p className="text-sm text-muted-foreground">{summary}</p>}
            </CardContent>
        </Card>
    )
}

export default MovieCard