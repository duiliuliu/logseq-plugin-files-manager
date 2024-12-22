
import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "../../customs/statusBadge"
import Tags from "../../customs/tags"
import { MilestoneCard } from './milestone-card'
import { Milestone } from './milestone'

interface TableViewProps {
  milestones: Milestone[]
  isWideMode: boolean
  onDateClick?: (date: Date) => void

  onUpdateMilestone?: (milestone: Milestone) => void
  onHiddenMilestone?: (milestone: Milestone) => void
  onAddMilestone?: (milestone: Milestone) => void
}


export function TableView({
  milestones,
  isWideMode,
  onUpdateMilestone,
  onHiddenMilestone
}: TableViewProps) {
  const [sortField, setSortField] = useState<keyof Milestone>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filter, setFilter] = useState('')

  const sortedMilestones = [...milestones].sort((a, b) => {
    if (a[sortField]! < b[sortField]!) return sortDirection === 'asc' ? -1 : 1
    if (a[sortField]! > b[sortField]!) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const filteredMilestones = sortedMilestones.filter(milestone =>
    milestone.content.toLowerCase().includes(filter.toLowerCase()) ||
    milestone.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
  )

  const handleSort = (field: keyof Milestone) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const renderSortIcon = (field: keyof Milestone) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Filter milestones..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No.</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('date')}>
                  Date {renderSortIcon('date')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('status')}>
                  Status {renderSortIcon('status')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('content')}>
                  Content {renderSortIcon('content')}
                </Button>
              </TableHead>
              <TableHead>Tags & Properties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMilestones.map((milestone, index) => (
              <TableRow key={milestone.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{format(parseISO(milestone.date), 'PPP')}</TableCell>
                <TableCell>
                  {milestone.status && (
                    <StatusBadge
                      status={milestone.status}
                      cycle="TODO-DOING-DONE"
                      onUpdate={(newStatus) => onUpdateMilestone?.({ ...milestone, status: newStatus })}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <MilestoneCard
                    milestone={milestone}
                    isWideMode={isWideMode}
                    viewMode="table"
                    onUpdateMilestone={onUpdateMilestone}
                    onHiddenMilestone={onHiddenMilestone}
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Tags categories={milestone.tags?.join(',')} />
                    {milestone.properties && Object.entries(milestone.properties).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium">{key}: </span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}