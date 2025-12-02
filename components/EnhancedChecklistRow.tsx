"use client"

import * as React from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, User, FileText, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChecklistItemWithTemplate } from "@/types/checklist"
import { useChecklistItem } from "@/hooks/useChecklistActions"
import { ChecklistItemStatus } from "@/lib/actions"

interface EnhancedChecklistRowProps {
  item: ChecklistItemWithTemplate
}

// Priority badge variant mapping
const getPriorityVariant = (priority: string) => {
  switch (priority.toUpperCase()) {
    case "HIGH":
      return "destructive"
    case "MEDIUM":
      return "default"
    case "LOW":
      return "secondary"
    default:
      return "outline"
  }
}

// Status badge variant mapping
const getStatusVariant = (status: string) => {
  switch (status.toUpperCase()) {
    case "DONE":
      return "default"
    case "IN_PROGRESS":
      return "outline"
    case "NOT_STARTED":
      return "secondary"
    case "NOT_APPLICABLE":
      return "destructive"
    default:
      return "outline"
  }
}

const statusOptions = [
  { value: 'NOT_STARTED', label: 'Not Started' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
  { value: 'NOT_APPLICABLE', label: 'Not Applicable' }
]

export const EnhancedChecklistRow: React.FC<EnhancedChecklistRowProps> = ({ item: initialItem }) => {
  const { item, isPending, actions } = useChecklistItem(initialItem)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [editValues, setEditValues] = React.useState({
    note: item.note || '',
    assignee: item.assignee || '',
    relatedUrl: item.relatedUrl || ''
  })

  const handleSaveDetails = () => {
    actions.updateNote(editValues.note)
    // You can extend this to update assignee and relatedUrl as well
    setIsDetailsOpen(false)
  }

  const handleStatusChange = (newStatus: string) => {
    actions.updateStatus(newStatus as ChecklistItemStatus)
  }

  return (
    <>
      <TableRow className={cn("hover:bg-muted/50", isPending && "opacity-60")}>
        <TableCell className="w-12">
          <input
            type="checkbox"
            checked={item.status === 'DONE'}
            onChange={actions.toggle}
            disabled={isPending}
            className="w-4 h-4 rounded border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
          />
        </TableCell>
        
        <TableCell className="min-w-0 flex-1">
          <div className="space-y-1">
            <p className={cn(
              "text-sm font-medium leading-none",
              item.status === 'DONE' && "line-through text-muted-foreground"
            )}>
              {item.templateItem.title}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.templateItem.description}
            </p>
            {item.assignee && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="w-3 h-3" />
                {item.assignee}
              </div>
            )}
          </div>
        </TableCell>
        
        <TableCell className="w-24">
          <Badge variant="outline" className="text-xs">
            {item.templateItem.category}
          </Badge>
        </TableCell>
        
        <TableCell className="w-20">
          <Badge 
            variant={getPriorityVariant(item.templateItem.priority)} 
            className="text-xs"
          >
            {item.templateItem.priority}
          </Badge>
        </TableCell>
        
        <TableCell className="w-32">
          <Select 
            value={item.status} 
            onValueChange={handleStatusChange}
            disabled={isPending}
          >
            <SelectTrigger className="h-6 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        
        <TableCell className="w-12">
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0"
                disabled={isPending}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{item.templateItem.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.templateItem.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.templateItem.category}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.templateItem.priority}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    value={item.status} 
                    onValueChange={handleStatusChange}
                    disabled={isPending}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Assignee</label>
                  <Input
                    value={editValues.assignee}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValues(prev => ({ ...prev, assignee: e.target.value }))}
                    placeholder="Who is responsible for this task?"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Input
                    value={editValues.note}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValues(prev => ({ ...prev, note: e.target.value }))}
                    placeholder="Add notes, comments, or additional details..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Related URL</label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={editValues.relatedUrl}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValues(prev => ({ ...prev, relatedUrl: e.target.value }))}
                      placeholder="https://..."
                    />
                    {editValues.relatedUrl && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(editValues.relatedUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveDetails} disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TableCell>
      </TableRow>
    </>
  )
}

export default EnhancedChecklistRow