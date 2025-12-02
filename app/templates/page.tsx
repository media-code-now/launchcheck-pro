"use client"

import React, { useState, useEffect } from "react"
import AppLayout from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FileText, 
  Plus, 
  Search, 
  CheckSquare,
  Eye,
  Edit,
  Copy,
  Trash2,
  ListChecks,
  Target,
  Rocket
} from "lucide-react"

interface TemplateItem {
  id: string
  category: string
  title: string
  description: string
  priority: string
  order: number
}

interface Template {
  id: string
  name: string
  description: string | null
  type: string
  items: TemplateItem[]
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    type: ""
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/templates')
      if (response.ok) {
        const result = await response.json()
        setTemplates(result.data || [])
      } else {
        console.error('Failed to fetch templates')
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTemplate = async () => {
    if (!newTemplate.name.trim() || !newTemplate.type) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setIsCreating(true)
      const response = await fetch('/api/templates/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTemplate.name.trim(),
          description: newTemplate.description.trim() || null,
          type: newTemplate.type
        }),
      })

      if (response.ok) {
        setIsCreateDialogOpen(false)
        setNewTemplate({ name: "", description: "", type: "" })
        fetchTemplates() // Refresh the list
        alert('Template created successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to create template: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating template:', error)
      alert('Failed to create template. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pre_launch':
        return <Target className="w-5 h-5" />
      case 'post_launch':
        return <Rocket className="w-5 h-5" />
      default:
        return <ListChecks className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pre_launch':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
      case 'post_launch':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20'
    }
  }

  const formatType = (type: string) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20'
      case 'low':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20'
    }
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesType = typeFilter === "all" || template.type === typeFilter
    
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <AppLayout breadcrumbs={[{ label: "Templates" }]}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading templates...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout breadcrumbs={[{ label: "Templates" }]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Checklist Templates</h1>
            <p className="text-muted-foreground">
              Manage and customize your checklist templates
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>
                  Create a new checklist template that can be used for projects.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Name *</Label>
                  <Input
                    id="template-name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="e.g., Pre Launch Checklist"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-type">Type *</Label>
                  <Select
                    value={newTemplate.type}
                    onValueChange={(value) => setNewTemplate({ ...newTemplate, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRE_LAUNCH">Pre Launch</SelectItem>
                      <SelectItem value="POST_LAUNCH">Post Launch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea
                    id="template-description"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    placeholder="Describe what this template is for..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    setNewTemplate({ name: "", description: "", type: "" })
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={createTemplate} disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Template'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Types</option>
            <option value="PRE_LAUNCH">Pre Launch</option>
            <option value="POST_LAUNCH">Post Launch</option>
          </select>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || typeFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first template"
              }
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
                        {getTypeIcon(template.type)}
                        {template.name}
                      </CardTitle>
                      {template.description && (
                        <CardDescription className="line-clamp-2">
                          {template.description}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant="outline" className={getTypeColor(template.type)}>
                      {formatType(template.type)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckSquare className="w-4 h-4" />
                      {template.items?.length || 0} items
                    </span>
                  </div>

                  {/* Sample items preview */}
                  {template.items && template.items.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Sample Items:</h4>
                      <div className="space-y-1">
                        {template.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckSquare className="w-3 h-3 text-muted-foreground" />
                            <span className="truncate">{item.title}</span>
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(item.priority)}`}>
                              {item.priority}
                            </Badge>
                          </div>
                        ))}
                        {template.items.length > 3 && (
                          <div className="text-xs text-muted-foreground pl-5">
                            +{template.items.length - 3} more items...
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {filteredTemplates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Templates Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {filteredTemplates.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Templates</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredTemplates.filter(t => t.type === 'PRE_LAUNCH').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pre Launch</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredTemplates.filter(t => t.type === 'POST_LAUNCH').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Post Launch</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {filteredTemplates.reduce((sum, t) => sum + (t.items?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Items</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}