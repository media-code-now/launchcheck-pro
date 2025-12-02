"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChecklistItemWithTemplate, ChecklistInstanceWithItems } from "@/types/checklist"

interface ChecklistRowProps {
  item: ChecklistItemWithTemplate
  onToggle: (id: string) => void
  onDetailsClick: (id: string) => void
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
  onDetailsClick 
}) => {
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="w-12">
        <input
          type="checkbox"
          checked={item.status === 'DONE'}
          onChange={() => onToggle(item.id)}
          className="w-4 h-4 rounded border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
  const handleItemToggle = (itemId: string) => {
    // This would typically make an API call to update the item status
    console.log('Toggle item:', itemId)
  }

  // Handle details click
  const handleDetailsClick = (itemId: string) => {
    // This would typically open a details dialog
    console.log('Show details for item:', itemId)
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
    </div>
  )
}

export default ChecklistCategoryLayout
export { ChecklistCategoryLayout, ChecklistRow }