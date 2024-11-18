import { useMemo } from 'react'
import { parseISO } from 'date-fns'
import { Milestone } from './mileStones'
import { StatusBadge } from './statusBadge'

interface FishboneViewProps {
    milestones: Milestone[]
}

export function FishboneView({ milestones }: FishboneViewProps) {
    const sortedMilestones = useMemo(() => {
        return [...milestones].sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    }, [milestones])

    const midpoint = Math.ceil(sortedMilestones.length / 2)
    const topMilestones = sortedMilestones.slice(0, midpoint)
    const bottomMilestones = sortedMilestones.slice(midpoint)

    return (
        <div className="relative w-full overflow-x-auto">
            <svg className="w-full" height="600" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
                <line x1="0" y1="300" x2="1000" y2="300" stroke="currentColor" strokeWidth="2" />
                {topMilestones.map((milestone, index) => (
                    <g key={milestone.id} transform={`translate(${(index + 1) * 150}, 290)`}>
                        <line x1="0" y1="0" x2="0" y2="-100" stroke="currentColor" strokeWidth="2" />
                        <foreignObject x="-75" y="-180" width="150" height="80">
                            <div className="text-center">
                                <StatusBadge status={milestone.status} />
                                <p className="text-sm mt-1">{milestone.content}</p>
                            </div>
                        </foreignObject>
                    </g>
                ))}
                {bottomMilestones.map((milestone, index) => (
                    <g key={milestone.id} transform={`translate(${(index + 1) * 150}, 310)`}>
                        <line x1="0" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="2" />
                        <foreignObject x="-75" y="100" width="150" height="80">
                            <div className="text-center">
                                <StatusBadge status={milestone.status} />
                                <p className="text-sm mt-1">{milestone.content}</p>
                            </div>
                        </foreignObject>
                    </g>
                ))}
            </svg>
        </div>
    )
}