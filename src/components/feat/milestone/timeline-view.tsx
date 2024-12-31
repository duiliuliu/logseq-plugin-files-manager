import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ArrowUpDownIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Milestone } from './milestone'
import { cn } from "@/lib/utils"

interface TimelineViewProps {
    milestones: Milestone[]
    isWideMode: boolean
    onDateClick?: (date: Date) => void
    onUpdateMilestone?: (milestone: Milestone) => void
    onHiddenMilestone?: (milestone: Milestone) => void
    onAddMilestone?: (milestone: Milestone) => void
}

type DisplayMode = 'alternate' | 'left' | 'right'

export function TimelineView({
    milestones,
    isWideMode }: TimelineViewProps) {
    const [isReversed, setIsReversed] = useState(false)
    const [displayMode, setDisplayMode] = useState<DisplayMode>('alternate')
    const timelineColor = "#3b82f6" // Matching blue-500 from Tailwind

    const sortedMilestones = [...milestones].sort((a, b) => {
        const dateA = parseISO(a.date)
        const dateB = parseISO(b.date)
        return isReversed ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
    })

    const renderMilestone = (milestone: Milestone, index: number, array: Milestone[]) => {
        const isLeft = displayMode === 'alternate' ? index % 2 === 0 : displayMode === 'left'
        const isFirst = index === 0
        const isLast = index === array.length - 1

        return (
            <div key={milestone.id} className="relative">
                {/* Vertical connecting line */}
                <div
                    className={`absolute left-1/2 transform -translate-x-1/2 w-[4px] ${isFirst ? 'top-1/2' : 'top-0'}`}
                    style={{
                        backgroundColor: timelineColor,
                        height: isLast ? 'calc(50% + 1px)' : '100%', // Ensure the line reaches the bottom of the container
                        top: isFirst ? '50%' : '10px', // Start from the top of the node for the first milestone
                    }}
                />

                <div className={cn(
                    "relative flex items-center min-h-[100px]",
                    isWideMode ? "px-8" : "px-4"
                )}>
                    {/* Left side content */}
                    <div className={cn(
                        "flex-1 pr-8 text-right",
                        ((!isLeft && displayMode === 'alternate') || displayMode === 'right') ? 'invisible' : ''
                    )}>
                        <div className="inline-block max-w-md">
                            <div className="font-medium">{milestone.content}</div>
                            <div className="text-sm text-muted-foreground">
                                {format(parseISO(milestone.date), 'yyyy-MM-dd HH:mm:ss')}
                            </div>
                        </div>
                    </div>

                    {/* Timeline node */}
                    <div className="relative z-10 flex-shrink-0">
                        <div className="w-4 h-4 rounded-full ring-4 ring-white" style={{ backgroundColor: timelineColor }} />
                    </div>

                    {/* Right side content */}
                    <div className={cn(
                        "flex-1 pl-8",
                        ((isLeft && displayMode === 'alternate') || displayMode === 'left') ? 'invisible' : ''
                    )}>
                        <div className="inline-block max-w-md">
                            <div className="font-medium">{milestone.content}</div>
                            <div className="text-sm text-muted-foreground">
                                {format(parseISO(milestone.date), 'yyyy-MM-dd HH:mm:ss')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={cn(
            "space-y-8",
            isWideMode ? "max-w-6xl mx-auto" : "max-w-3xl mx-auto"
        )}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {(['left', 'right', 'alternate'] as const).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setDisplayMode(mode)}
                            className={cn(
                                "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                                displayMode === mode
                                    ? "bg-blue-100 text-blue-600"
                                    : "hover:bg-gray-100"
                            )}
                        >
                            <div className={cn(
                                "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                                displayMode === mode
                                    ? "border-blue-600"
                                    : "border-gray-400"
                            )}>
                                {displayMode === mode && (
                                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                                )}
                            </div>
                            <span className="capitalize">{mode}</span>
                        </button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsReversed(!isReversed)}
                    className="ml-4"
                >
                    <ArrowUpDownIcon className="h-4 w-4" />
                </Button>
            </div>

            <div className="relative py-4">
                {sortedMilestones.map((milestone, index) =>
                    renderMilestone(milestone, index, sortedMilestones)
                )}
            </div>
        </div>
    )
}

