 
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDownIcon as ArrowsUpDown, CalendarIcon, TimerIcon as Timeline, LayoutGrid, GitFork, Maximize2, Minimize2, TableIcon } from 'lucide-react'
import { formatDate, MilestoneViewProps, ViewMode } from "../customs/mileStones"
import { StatusBadge } from "../customs/statusBadge"
import { FishboneView } from "../customs/fishBoneView"
import { HeatmapView } from "../customs/heatmapView"
import { TimelineView } from "../customs/timelineView"

export function MilestoneViewer({
    milestones,
    isEmbedded = false,
    isWideMode: initialWideMode = false,
    onUpdate,
    onToggleHidden,
    onReset
}: MilestoneViewProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('timeline')
    const [isReversed, setIsReversed] = useState(false)
    const [isWideMode, setIsWideMode] = useState(initialWideMode)

    const visibleMilestones = milestones.filter(m => !m.hidden)
    const sortedMilestones = [...visibleMilestones].sort((a, b) => {
        const comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        return isReversed ? -comparison : comparison
    })

    return (
        <div className={`${isEmbedded ? 'w-full' : 'w-[90vw] max-w-7xl'} mx-auto p-4`}>
            <div className="mb-4 flex items-center justify-between">
                <Tabs defaultValue={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                    <TabsList>
                        <TabsTrigger value="calendar">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Calendar
                        </TabsTrigger>
                        <TabsTrigger value="timeline">
                            <Timeline className="h-4 w-4 mr-2" />
                            Timeline
                        </TabsTrigger>
                        <TabsTrigger value="table">
                            <TableIcon className="h-4 w-4 mr-2" />
                            Table
                        </TabsTrigger>
                        <TabsTrigger value="heatmap">
                            <LayoutGrid className="h-4 w-4 mr-2" />
                            Heatmap
                        </TabsTrigger>
                        <TabsTrigger value="fishbone">
                            <GitFork className="h-4 w-4 mr-2" />
                            Fishbone
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsReversed(!isReversed)}
                    >
                        <ArrowsUpDown className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsWideMode(!isWideMode)}
                    >
                        {isWideMode ? (
                            <Minimize2 className="h-4 w-4" />
                        ) : (
                            <Maximize2 className="h-4 w-4" />
                        )}
                    </Button>
                    {onReset && (
                        <Button variant="outline" onClick={onReset}>
                            Reset All
                        </Button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {viewMode === 'calendar' && (
                    <Calendar
                        mode="multiple"
                        selected={sortedMilestones.map(m => new Date(m.date))}
                        className="rounded-md border"
                    />
                )}

                {viewMode === 'timeline' && (
                    <div className="space-y-4">
                        {sortedMilestones.map(milestone => (
                            <TimelineView
                                key={milestone.id}
                                milestone={milestone}
                                isWideMode={isWideMode}
                                onUpdate={onUpdate}
                                onToggleHidden={onToggleHidden}
                            />
                        ))}
                    </div>
                )}

                {viewMode === 'table' && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Content</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedMilestones.map(milestone => (
                                <TableRow key={milestone.id}>
                                    <TableCell>{formatDate(milestone.date)}</TableCell>
                                    <TableCell>
                                        <StatusBadge
                                            status={milestone.status}
                                            cycle="TODO-DOING-DONE"
                                            onUpdate={(newStatus) => onUpdate?.({ ...milestone, status: newStatus })}
                                        />
                                    </TableCell>
                                    <TableCell>{milestone.content}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {viewMode === 'heatmap' && (
                    <HeatmapView milestones={sortedMilestones} />
                )}

                {viewMode === 'fishbone' && (
                    <FishboneView milestones={sortedMilestones} />
                )}
            </div>
        </div>
    )
}