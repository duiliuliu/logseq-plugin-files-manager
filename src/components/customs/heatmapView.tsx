import { useState } from 'react'
import { addMonths, eachDayOfInterval, endOfMonth, format, isSameMonth, parseISO, startOfMonth } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Milestone } from './mileStones'

const getColorIntensity = (count: number) => {
    if (count === 0) return 'bg-muted'
    if (count < 3) return 'bg-primary/25'
    if (count < 5) return 'bg-primary/50'
    if (count < 7) return 'bg-primary/75'
    return 'bg-primary'
}

interface HeatmapViewProps {
    milestones: Milestone[]
}

export function HeatmapView({ milestones }: HeatmapViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

    const startDate = startOfMonth(currentDate)
    const endDate = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    const milestoneCounts = days.map(day => {
        return milestones.filter(milestone =>
            isSameMonth(parseISO(milestone.date), day) &&
            format(parseISO(milestone.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        ).length
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentDate(addMonths(currentDate, -1))}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                        {day}
                    </div>
                ))}
                {days.map((day, index) => (
                    <TooltipProvider key={day.toISOString()}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className={cn(
                                        "h-8 w-8 rounded-md",
                                        getColorIntensity(milestoneCounts[index]),
                                        "cursor-pointer"
                                    )}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{format(day, 'MMM d, yyyy')}</p>
                                <p>{milestoneCounts[index]} milestone(s)</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>
        </div>
    )
}