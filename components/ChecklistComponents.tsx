"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, Filter, MoreHorizontal, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChecklistItemWithTemplate, ChecklistInstanceWithItems } from "@/types/checklist"
import { useNotifications } from "@/components/NotificationProvider"

interface ChecklistRowProps {
  item: ChecklistItemWithTemplate
  onToggle: (id: string) => void
  onDetailsClick: (id: string) => void
  isUpdating?: boolean
}

interface ChecklistCategoryLayoutProps {
  checklistInstance: ChecklistInstanceWithItems
  isPost?: boolean
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

// ChecklistRow Component
const ChecklistRow: React.FC<ChecklistRowProps> = ({ 
  item, 
  onToggle, 
  onDetailsClick,
  isUpdating = false
}) => {
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="w-12">
        <div className="relative">
          <input
            type="checkbox"
            checked={item.status === 'DONE'}
            onChange={() => onToggle(item.id)}
            disabled={isUpdating}
            className="w-4 h-4 rounded border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
          />
          {isUpdating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-3 w-3 animate-spin" />
            </div>
          )}
        </div>
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
      
      <TableCell className="w-24">
        <Badge 
          variant={getStatusVariant(item.status)}
          className="text-xs"
        >
          {item.status.replace('_', ' ')}
        </Badge>
      </TableCell>
      
      <TableCell className="w-12">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onDetailsClick(item.id)}
          className="h-8 w-8 p-0"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

// Main ChecklistCategoryLayout Component
const ChecklistCategoryLayout: React.FC<ChecklistCategoryLayoutProps> = ({ 
  checklistInstance,
  isPost = false 
}) => {
  const items = checklistInstance.items
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [updatingItems, setUpdatingItems] = React.useState<Set<string>>(new Set())
  const { addNotification } = useNotifications()

  // Use real data from checklistInstance
  const workingItems = items

  // Filter items based on search and category
  const filteredItems = workingItems.filter((item: ChecklistItemWithTemplate) => {
    const matchesSearch = item.templateItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.templateItem.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.templateItem.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate stats  
  const completedCount = workingItems.filter((item: ChecklistItemWithTemplate) => item.status === 'DONE').length
  const totalItems = workingItems.length
  const progressPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0

  // Get unique categories from items
  const categories = ["All", ...Array.from(new Set(workingItems.map(item => item.templateItem.category)))]

  // Handle item toggle
  const handleItemToggle = async (itemId: string) => {
    // Add to updating items
    setUpdatingItems(prev => {
      const newSet = new Set(prev)
      newSet.add(itemId)
      return newSet
    })
    
    try {
      // Find the current item to determine new status
      const currentItem = workingItems.find(item => item.id === itemId)
      if (!currentItem) return
      
      // Toggle status: if DONE, set to NOT_STARTED, otherwise set to DONE
      const newStatus = currentItem.status === 'DONE' ? 'NOT_STARTED' : 'DONE'
      
      // Call API to update status
      const response = await fetch(`/api/checklist-items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Show success notification
        addNotification({
          type: 'success',
          title: 'Task Updated',
          message: data.message || `Task marked as ${newStatus.toLowerCase().replace('_', ' ')}`
        })
        
        // Force refresh by triggering a re-render
        // This is a temporary solution - ideally we'd use proper state management
        setTimeout(() => {
          window.location.reload()
        }, 500) // Small delay to show notification
      } else {
        console.error('Failed to update task:', data.error)
        addNotification({
          type: 'error',
          title: 'Update Failed',
          message: data.error || 'Failed to update task'
        })
      }
    } catch (error) {
      console.error('Error updating task:', error)
      addNotification({
        type: 'error',
        title: 'Network Error',
        message: 'Error updating task. Please check your connection and try again.'
      })
    } finally {
      // Remove from updating items
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  // Handle details click
  const [selectedItem, setSelectedItem] = React.useState<ChecklistItemWithTemplate | null>(null)
  
  const handleDetailsClick = (itemId: string) => {
    const item = workingItems.find(item => item.id === itemId)
    if (item) {
      setSelectedItem(item)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {checklistInstance.template.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {checklistInstance.template.description}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isPost ? "secondary" : "default"} className="px-3 py-1">
            {completedCount}/{totalItems} completed ({progressPercentage}%)
          </Badge>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search checklist items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
          {categories.slice(0, 6).map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="h-8 px-3 text-sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div>
              <p className="text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedCount}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <div>
              <p className="text-sm font-medium">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {workingItems.filter(item => item.status === 'IN_PROGRESS').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full" />
            <div>
              <p className="text-sm font-medium">Not Started</p>
              <p className="text-2xl font-bold text-gray-600">
                {workingItems.filter(item => item.status === 'NOT_STARTED').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <div>
              <p className="text-sm font-medium">Total</p>
              <p className="text-2xl font-bold text-purple-600">{totalItems}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Checklist Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Checklist Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Done</TableHead>
                <TableHead>Task</TableHead>
                <TableHead className="w-24">Category</TableHead>
                <TableHead className="w-20">Priority</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <ChecklistRow
                  key={item.id}
                  item={item}
                  onToggle={handleItemToggle}
                  onDetailsClick={handleDetailsClick}
                  isUpdating={updatingItems.has(item.id)}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Category Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.filter(cat => cat !== "All").map((category) => {
          const categoryItems = workingItems.filter(item => item.templateItem.category === category)
          const categoryCompleted = categoryItems.filter(item => item.status === 'DONE').length
          const categoryProgress = categoryItems.length > 0 ? Math.round((categoryCompleted / categoryItems.length) * 100) : 0
          
          return (
            <Card key={category} className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{category}</h4>
                  <Badge variant="outline" className="text-xs">
                    {categoryCompleted}/{categoryItems.length}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${categoryProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{categoryProgress}% complete</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Task Details Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        {selectedItem && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedItem.templateItem.title}</DialogTitle>
              <DialogDescription>
                {selectedItem.templateItem.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Task Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">
                    <Badge variant={getStatusVariant(selectedItem.status)}>
                      {selectedItem.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <div className="mt-1">
                    <Badge variant={getPriorityVariant(selectedItem.templateItem.priority)}>
                      {selectedItem.templateItem.priority}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {selectedItem.templateItem.category}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Assignee</label>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {selectedItem.assignee || 'Not assigned'}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  className="mt-1"
                  value={selectedItem.note || ''}
                  readOnly
                  placeholder="No notes added"
                  rows={3}
                />
              </div>

              {/* Related URL */}
              {selectedItem.relatedUrl && (
                <div>
                  <label className="text-sm font-medium">Related URL</label>
                  <div className="mt-1">
                    <a 
                      href={selectedItem.relatedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {selectedItem.relatedUrl}
                    </a>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Created</label>
                  <div className="text-sm">
                    {new Date(selectedItem.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Last Updated</label>
                  <div className="text-sm">
                    {new Date(selectedItem.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  handleItemToggle(selectedItem.id)
                  setSelectedItem(null)
                }}
                disabled={updatingItems.has(selectedItem.id)}
              >
                {updatingItems.has(selectedItem.id) ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    Mark as {selectedItem.status === 'DONE' ? 'Not Started' : 'Done'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

export default ChecklistCategoryLayout
export { ChecklistCategoryLayout, ChecklistRow }