"use client"

import * as React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Clock, Target, FileText } from "lucide-react"
import { ChecklistCategoryLayout } from "@/components/ChecklistComponents"
import { ChecklistItemWithTemplate, ChecklistInstanceWithItems, ProjectWithChecklists, ChecklistTemplate } from "@/types/checklist"

interface ProjectChecklistsPageProps {
  project: ProjectWithChecklists
  preChecklist?: ChecklistInstanceWithItems
  postChecklist?: ChecklistInstanceWithItems
  preProgress: number
  postProgress: number
}

// Removed old placeholder component - using real component from ChecklistComponents.tsx

// Main ProjectChecklistsPage component
const ProjectChecklistsPage: React.FC<ProjectChecklistsPageProps> = ({ 
  project, 
  preChecklist, 
  postChecklist, 
  preProgress, 
  postProgress 
}) => {
  // Calculate actual statistics from data
  const prelaunchProgress = preProgress
  const postlaunchProgress = postProgress
  const prelaunchCompleted = preChecklist?.items.filter(item => item.status === 'DONE').length || 0
  const prelaunchTotal = preChecklist?.items.length || 0
  const postlaunchCompleted = postChecklist?.items.filter(item => item.status === 'DONE').length || 0
  const postlaunchTotal = postChecklist?.items.length || 0

  // Templates state
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)

  // Fetch templates when component mounts
  const fetchTemplates = async () => {
    setLoadingTemplates(true)
    try {
      const response = await fetch('/api/templates')
      if (response.ok) {
        const result = await response.json()
        setTemplates(result.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setLoadingTemplates(false)
    }
  }

  // Load templates on component mount
  React.useEffect(() => {
    fetchTemplates()
  }, [])

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        <p className="text-muted-foreground">
          Client: {project.clientName} • Status: {project.status}
          {project.domain && ` • ${project.domain}`}
        </p>
      </div>

      {/* Progress Overview Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pre Launch Progress Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <CardTitle className="text-lg">Pre Launch</CardTitle>
              </div>
              <Badge variant="outline">
                {prelaunchCompleted}/{prelaunchTotal}
              </Badge>
            </div>
            <CardDescription>
              Essential tasks before going live
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{prelaunchProgress}% complete</span>
            </div>
            <Progress value={prelaunchProgress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{prelaunchCompleted} completed</span>
              <span>{prelaunchTotal - prelaunchCompleted} remaining</span>
            </div>
          </CardContent>
        </Card>

        {/* Post Launch Progress Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-secondary/50 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Post Launch</CardTitle>
              </div>
              <Badge variant="secondary">
                {postlaunchCompleted}/{postlaunchTotal}
              </Badge>
            </div>
            <CardDescription>
              Follow-up tasks after launch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{postlaunchProgress}% complete</span>
            </div>
            <Progress value={postlaunchProgress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{postlaunchCompleted} completed</span>
              <span>{postlaunchTotal - postlaunchCompleted} remaining</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checklist Tabs Section */}
      <Card>
        <CardHeader>
          <CardTitle>Checklist Details</CardTitle>
          <CardDescription>
            View and manage your pre-launch and post-launch task lists
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prelaunch" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger 
                value="prelaunch" 
                className="flex items-center space-x-2"
              >
                <Target className="w-4 h-4" />
                <span>Pre Launch</span>
              </TabsTrigger>
              <TabsTrigger 
                value="postlaunch"
                className="flex items-center space-x-2"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Post Launch</span>
              </TabsTrigger>
              <TabsTrigger 
                value="templates"
                className="flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Templates</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prelaunch" className="mt-0">
              {preChecklist && (
                <ChecklistCategoryLayout 
                  checklistInstance={preChecklist}
                  isPost={false} 
                />
              )}
            </TabsContent>

            <TabsContent value="postlaunch" className="mt-0">
              {postChecklist && (
                <ChecklistCategoryLayout 
                  checklistInstance={postChecklist}
                  isPost={true} 
                />
              )}
            </TabsContent>

            <TabsContent value="templates" className="mt-0">
              <div className="space-y-4">
                {loadingTemplates ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading templates...</p>
                  </div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No templates found</p>
                    <button 
                      onClick={fetchTemplates}
                      className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Refresh Templates
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {templates.map((template) => (
                      <Card key={template.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{template.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CheckSquare className="w-4 h-4" />
                                {template.items?.length || 0} items
                              </span>
                              <Badge variant="outline">
                                {template.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Total Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {prelaunchCompleted + postlaunchCompleted}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {(prelaunchTotal + postlaunchTotal) - (prelaunchCompleted + postlaunchCompleted)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-600">
                {prelaunchTotal + postlaunchTotal}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ProjectChecklistsPage