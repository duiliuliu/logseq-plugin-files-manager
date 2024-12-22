
import { useRef, useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MoreHorizontal, Eye, EyeOff, Edit2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Status, StatusBadge } from "../../customs/statusBadge"
import Tags from "../../customs/tags"
import { Milestone } from './milestone'
import { truncateDescription } from '@/components/customs/description'

interface MilestoneCardProps {
  milestone: Milestone
  isWideMode: boolean
  viewMode: 'calendar' | 'timeline' | 'heatmap' | 'fishbone' | 'table'
  onUpdateMilestone?: (milestone: Milestone) => void
  onHiddenMilestone?: (milestone: Milestone) => void
  onAddMilestone?: (milestone: Milestone) => void
}

export function MilestoneCard({
  milestone,
  isWideMode,
  viewMode,
  onUpdateMilestone: onUpdate,
  onHiddenMilestone
}: MilestoneCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(milestone.content)
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const handleStatusUpdate = (newStatus: Status) => {
    onUpdate?.({ ...milestone, status: newStatus })
  }

  const handleSave = () => {
    onUpdate?.({ ...milestone, content: editedContent })
    setIsEditing(false)
  }

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="space-y-2">
          <textarea
            className="w-full p-2 border rounded-md"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      )
    }

    if (isExpanded || isWideMode) {
      return (
        <div className="space-y-2">
          <p>{milestone.content}</p>
          {milestone.subContent && milestone.subContent.map((sub, index) => (
            <p key={index} className="text-sm text-muted-foreground">{sub}</p>
          ))}
          {milestone.properties && Object.entries(milestone.properties).map(([key, value]) => (
            <div key={key} className="text-sm">
              <span className="font-medium">{key}: </span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      )
    }

    return <p className="truncate">{milestone.content}</p>
  }

  const cardContent = (
    <CardContent className="space-y-2">
      {renderContent()}
      <Tags categories={milestone.tags?.join(',')} />
    </CardContent>
  )

  if (viewMode === 'calendar' || viewMode === 'heatmap') {
    return (<p>111</p>
      // <Popover>
      //   <PopoverTrigger asChild>
      //     <div className="w-full h-full cursor-pointer">
      //       <div className="text-xs truncate">{milestone.content}</div>
      //     </div>
      //   </PopoverTrigger>
      //   <PopoverContent className="w-80">
      //     <Card>
      //       <CardHeader>
      //         <CardTitle className="text-sm font-medium">
      //           {format(parseISO(milestone.date), 'PPP')}
      //         </CardTitle>
      //       </CardHeader>
      //       {cardContent}
      //     </Card>
      //   </PopoverContent>
      // </Popover>
    )
  }

  const renderCard = () => (
    <Card className={`w-full ${isWideMode ? 'max-w-2xl' : 'max-w-md'}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          {milestone.status && (
            <StatusBadge
              status={milestone.status}
              cycle="TODO-DOING-DONE"
              onUpdate={handleStatusUpdate}
            />
          )}
          <span className="text-sm font-medium">
            {format(parseISO(milestone.date), 'PPP')}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setIsEditing(true)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => onHiddenMilestone?.(milestone)}>
                  {milestone.hidden ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                  {milestone.hidden ? 'Show' : 'Hide'}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      {cardContent}
    </Card>
  )

  return (
    <div className={`relative`}>
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="text-xs"
        aria-label="Show information"
      >
        {truncateDescription(milestone.content, 20)}
      </div>
      {showTooltip && (
        <div ref={tooltipRef} className="absolute w-auto min-w-max p-2 bg-white shadow-md rounded text-xs z-10 whitespace-nowrap">
          {renderCard()}
        </div>
      )}
    </div>
  )
}