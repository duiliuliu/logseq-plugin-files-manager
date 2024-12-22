
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChevronDown, ChevronRight, TimerIcon as Timeline, LayoutGrid, GitFork, Maximize2, Minimize2, TableIcon, } from 'lucide-react'
import { } from 'lucide-react'

import { Milestone } from "./milestone"
import { CalendarView } from './calendar-view'
import { FishboneView } from './fishbone-view'
import { TableView } from './table-view'
import { TimelineView } from './timeline-view'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { HeatmapView } from './heatmap-view'

type ViewMode = 'calendar' | 'timeline' | 'heatmap' | 'fishbone' | 'table'

export interface MilestoneViewProps {
    milestones: Milestone[]
    isEmbedded?: boolean
    isWideMode?: boolean
    onUpdate?: (milestone: Milestone) => void
    onAdd?: (milestone: Milestone) => void
    onHidden?: (milestone: Milestone) => void
    onReset?: () => void
    onDateClick?: (date: Date) => void
}

export default function MilestoneViewer({
    milestones: initialMilestones,
    isEmbedded = false,
    isWideMode: initialWideMode = false,
    onUpdate,
    onAdd,
    onHidden,
    onReset,
    onDateClick
}: MilestoneViewProps) {
    const [milestones, setMilestones] = useState(initialMilestones)
    const [isWideMode, setIsWideMode] = useState(initialWideMode)
    const [isCollapsed, setIsCollapsed] = useState(true)
    const [viewMode, setViewMode] = useState<ViewMode>('calendar')
    const visibleMilestones = milestones.filter(m => !m.hidden)

    const handleUpdateMilestone = (updatedMilestone: Milestone) => {
        setMilestones(milestones.map(m => m.id === updatedMilestone.id ? updatedMilestone : m))
        if (onUpdate) { onUpdate(updatedMilestone) }
    }

    const handleHiddenMilestone = (hiddenMilestone: Milestone) => {
        setMilestones(milestones.map(m => m.id === hiddenMilestone.id ? { ...m, hidden: !m.hidden } : m))
        if (onHidden) { onHidden(hiddenMilestone) }

    }

    const handleAddMilestone = (addMilestone: Milestone) => {
        // Implement add milestone logic
        milestones.push(addMilestone)
        setMilestones(milestones)
        if (onAdd) { onAdd(addMilestone) }
    }

    if (isCollapsed) {
        return (
            <Button
                variant="outline"
                className="w-full flex items-center justify-between"
                onClick={() => setIsCollapsed(false)}
            >
                <span>Show Milestones</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        )
    }

    const ViewWrapper = ({ children }: { children: React.ReactNode }) => (
        <ScrollArea className={cn(
            // "border rounded-lg",
            isWideMode ? "w-full" : "w-[600px] mx-auto")}>
            {children}
        </ScrollArea>
    )

    const switchView = (viewMode: ViewMode) => {
        const viewProps = {
            milestones: visibleMilestones,
            isWideMode,
            onDateClick,
            onUpdateMilestone: handleUpdateMilestone,
            onHiddenMilestone: handleHiddenMilestone,
            onAddMilestone: handleAddMilestone
        }
        switch (viewMode) {
            case 'calendar':
                return <ViewWrapper> <CalendarView {...viewProps} /></ViewWrapper>
            case 'timeline':
                return <ViewWrapper><TimelineView {...viewProps} /></ViewWrapper>
            case 'table':
                return <ViewWrapper><TableView {...viewProps} /></ViewWrapper>
            case 'heatmap':
                return <ViewWrapper><HeatmapView {...viewProps} /></ViewWrapper>
            case 'fishbone':
                return <ViewWrapper><FishboneView {...viewProps} /></ViewWrapper>
        }
    }

    return (
        <div className={cn(
            "mx-auto p-4",
            isEmbedded ? 'w-full' : 'w-[90vw] max-w-7xl',
            "bg-background rounded-lg border"
        )}>
            <div className="mb-4 flex items-center justify-between">
                <Tabs defaultValue={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                    <TabsList>
                        <TabsTrigger value="calendar">   <CalendarIcon className="h-4 w-4 mr-2" />   Calendar    </TabsTrigger>
                        <TabsTrigger value="timeline">    <Timeline className="h-4 w-4 mr-2" />    Timeline     </TabsTrigger>
                        <TabsTrigger value="table">    <TableIcon className="h-4 w-4 mr-2" />    Table    </TabsTrigger>
                        <TabsTrigger value="heatmap">   <LayoutGrid className="h-4 w-4 mr-2" />     Heatmap  </TabsTrigger>
                        <TabsTrigger value="fishbone">    <GitFork className="h-4 w-4 mr-2" />     Fishbone   </TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="flex gap-2">
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
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsCollapsed(true)}
                    >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                    {onReset && (
                        <Button variant="outline" onClick={onReset}>
                            Reset All
                        </Button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {viewMode && switchView(viewMode)}
            </div>
        </div>
    )
}