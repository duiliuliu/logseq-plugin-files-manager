import { parseISO } from "date-fns"
import { useMemo } from "react"
import { Milestone } from "./milestone"
import { MilestoneCard } from "./milestone-card"


interface FishboneViewProps {
    highlightColor?: string
    milestones: Milestone[]
    isWideMode: boolean
    onDateClick?: (date: Date) => void
    onUpdateMilestone?: (milestone: Milestone) => void
    onHiddenMilestone?: (milestone: Milestone) => void
    onAddMilestone?: (milestone: Milestone) => void
}

export function FishboneView({
    milestones,
    isWideMode = false,
    highlightColor = "#22c55e"
}: FishboneViewProps) {
    const sortedMilestones = useMemo(() => {
        return [...milestones].sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    }, [milestones])

    const midpoint = Math.ceil(sortedMilestones.length / 2)
    const topMilestones = sortedMilestones.slice(0, midpoint)
    const bottomMilestones = sortedMilestones.slice(midpoint)

    return (
        <div className={`relative w-full overflow-x-auto ${isWideMode ? 'h-[800px]' : 'h-[600px]'}`}>
            <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
                {/* Main horizontal line */}
                <line
                    x1="0"
                    y1="300"
                    x2="1000"
                    y2="300"
                    stroke={highlightColor}
                    strokeWidth="2"
                />

                {/* Top branches */}
                {topMilestones.map((milestone, index) => (
                    <g key={milestone.id} transform={`translate(${(index + 1) * 150}, 300)`}>
                        {/* Angled line */}
                        <line
                            x1="0"
                            y1="0"
                            x2="-50"
                            y2="-100"
                            stroke={highlightColor}
                            strokeWidth="2"
                        />
                        {/* Milestone card container */}
                        <foreignObject x="-125" y="-180" width="150" height="80">
                            <div className="flex items-center justify-center h-full">
                                <MilestoneCard
                                    milestone={milestone}
                                    isWideMode={false}
                                    viewMode={"fishbone"}
                                />
                            </div>
                        </foreignObject>
                    </g>
                ))}

                {/* Bottom branches */}
                {bottomMilestones.map((milestone, index) => (
                    <g key={milestone.id} transform={`translate(${(index + 1) * 150}, 300)`}>
                        {/* Angled line */}
                        <line
                            x1="0"
                            y1="0"
                            x2="-50"
                            y2="100"
                            stroke={highlightColor}
                            strokeWidth="2"
                        />
                        {/* Milestone card container */}
                        <foreignObject x="-125" y="100" width="150" height="80">
                            <div className="flex items-center justify-center h-full">
                                <MilestoneCard
                                    milestone={milestone}
                                    isWideMode={false}
                                    viewMode={"fishbone"}
                                />
                            </div>
                        </foreignObject>
                    </g>
                ))}
            </svg>
        </div>
    )
}