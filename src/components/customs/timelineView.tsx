import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Edit2, RotateCcw } from "lucide-react"
import { formatDate, Milestone, truncateText } from "./mileStones"
import { Status, StatusBadge } from "./statusBadge"

interface TimelineViewProps {
    milestone: Milestone
    isWideMode?: boolean
    onUpdate?: (milestone: Milestone) => void
    onToggleHidden?: (id: string) => void
}

export function TimelineView({
    milestone,
    isWideMode,
    onUpdate,
    onToggleHidden
}: TimelineViewProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState(milestone.content)

    const handleSave = () => {
        onUpdate?.({
            ...milestone,
            content: editedContent,
            originalContent: milestone.content
        })
        setIsEditing(false)
    }

    const handleStatusUpdate = (newStatus: Status) => {
        onUpdate?.({
            ...milestone,
            status: newStatus
        })
    }

    const content = isExpanded ? milestone.content : truncateText(milestone.content)

    return (
        <Card className={`${isWideMode ? 'max-w-2xl' : 'max-w-md'} w-full`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <StatusBadge
                        status={milestone.status}
                        cycle="TODO-DOING-DONE"
                        onUpdate={handleStatusUpdate}
                    />
                    <span className="text-sm text-muted-foreground">
                        {formatDate(milestone.date)}
                    </span>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleHidden?.(milestone.id)}
                    >
                        {milestone.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    {milestone.originalContent && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onUpdate?.({
                                ...milestone,
                                content: milestone.originalContent || '',
                                originalContent: undefined
                            })}
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        <textarea
                            className="min-h-[100px] w-full rounded-md border p-2"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>Save</Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div
                            className="prose prose-sm max-w-none cursor-pointer"
                            onClick={() => setIsExpanded(!isExpanded)}
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                        <div className="flex flex-wrap gap-2">
                            {milestone.tags?.map(tag => (
                                <Badge key={tag} variant="secondary">#{tag}</Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}