
import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ArrowUpDownIcon, ChevronFirstIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { MilestoneCard } from './milestone-card'
import { Milestone } from './milestone'

interface TimelineViewProps {
    milestones: Milestone[]
    isWideMode: boolean
    onDateClick?: (date: Date) => void
    onUpdateMilestone?: (milestone: Milestone) => void
    onHiddenMilestone?: (milestone: Milestone) => void
    onAddMilestone?: (milestone: Milestone) => void
}

export function TimelineView({
    milestones,
    isWideMode,
    onUpdateMilestone,
    onHiddenMilestone }: TimelineViewProps) {
    const [isReversed, setIsReversed] = useState(false)
    const [displayMode, setDisplayMode] = useState<'both' | 'left' | 'right'>('both')

    const sortedMilestones = [...milestones].sort((a, b) => {
        const dateA = parseISO(a.date)
        const dateB = parseISO(b.date)
        return isReversed ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
    })

    const toggleReverse = () => setIsReversed(!isReversed)

    const renderMilestone = (milestone: Milestone, index: number) => {
        const isLeft = displayMode === 'both' ? index % 2 === 0 : displayMode === 'left'
        return (
            <div key={milestone.id} className="flex items-center">
                {(displayMode === 'both' || displayMode === 'left') && (
                    <div className={`flex-1 ${isLeft ? 'order-1' : 'order-3'}`}>
                        {isLeft && <MilestoneCard
                            milestone={milestone}
                            isWideMode={isWideMode}
                            viewMode="timeline"
                            onUpdateMilestone={onUpdateMilestone}
                            onHiddenMilestone={onHiddenMilestone}
                        />}
                    </div>
                )}
                <div className="flex-shrink-0 order-2 w-16 text-center">
                    <div className="h-full flex flex-col items-center">
                        <div className="flex-1 w-1 bg-border"></div>
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                        <div className="flex-1 w-1 bg-border"></div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                        {format(parseISO(milestone.date), 'MMM d')}
                    </div>
                </div>
                {(displayMode === 'both' || displayMode === 'right') && (
                    <div className={`flex-1 ${isLeft ? 'order-3' : 'order-1'}`}>
                        {!isLeft && <MilestoneCard
                            milestone={milestone}
                            isWideMode={isWideMode}
                            viewMode="timeline"
                            onUpdateMilestone={onUpdateMilestone}
                            onHiddenMilestone={onHiddenMilestone}
                        />}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Button variant="outline" size="sm" onClick={toggleReverse}>
                    <ArrowUpDownIcon className="h-4 w-4" />
                </Button>
                <div className="space-x-2">
                    <Button
                        variant={displayMode === 'both' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDisplayMode('both')}
                    >
                        <ChevronFirstIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={displayMode === 'left' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDisplayMode('left')}
                    >
                        <ChevronLeft className="h-4 w-4" />

                    </Button>
                    <Button
                        variant={displayMode === 'right' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDisplayMode('right')}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="space-y-8" onContextMenu={(e) => {
                e.preventDefault()
                // onAddMilestone?.({})
            }}>
                {sortedMilestones.map(renderMilestone)}
            </div>
        </div>
    )
}