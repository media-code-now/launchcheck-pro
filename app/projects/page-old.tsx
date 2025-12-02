"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { MobileAppShell } from "@/components/MobileAppShell"
import { MobileProjectCard } from "@/components/MobileProjectCard"
import { useNotifications } from "@/components/NotificationProvider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  FolderOpen, 
  ListChecks,
  TrendingUp,
  Clock,
  Users,
  Search,
  Filter,
  Calendar,
  Trash2,
  MoreHorizontal
} from "lucide-react"

interface Project {
  id: string
  name: string
  clientName: string
  domain?: string
  status: string
  launchDate?: string
  createdAt: string
  updatedAt: string
  checklistInstances?: any[]
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setProjects(data.projects || [])
        } else {
          console.error('API returned error:', data.error)
        }
      } else {
        console.error('Failed to fetch projects')
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async () => {
    if (!projectToDelete) return
    
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectToDelete.id))
        setDeleteDialogOpen(false)
        setProjectToDelete(null)
        alert('Project deleted successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to delete project: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project)
    setDeleteDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
      case 'IN_PROGRESS':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
      case 'PLANNING':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20'
      case 'ON_HOLD':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20'
    }
  }

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const calculateProgress = (project: Project) => {
    if (!project.checklistInstances || project.checklistInstances.length === 0) {
      return 0
    }
    
    const totalItems = project.checklistInstances.reduce((sum, checklist) => 
      sum + (checklist.items?.length || 0), 0)
    const completedItems = project.checklistInstances.reduce((sum, checklist) => 
      sum + (checklist.items?.filter((item: any) => item.status === 'DONE').length || 0), 0)
    
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.domain && project.domain.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <MobileAppShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </MobileAppShell>
    )
  }

  return (
    <MobileAppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage your website projects and their checklists
            </p>
          </div>
          <Button asChild>
            <Link href="/" className="gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Link>
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="PLANNING">Planning</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first project"
              }
            </p>
            <Button asChild>
              <Link href="/">
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => {
              const progress = calculateProgress(project)
              return (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg line-clamp-2">{project.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          {project.clientName}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={getStatusColor(project.status)}>
                        {formatStatus(project.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {project.domain && (
                      <p className="text-sm text-muted-foreground truncate">
                        🌐 {project.domain}
                      </p>
                    )}

                    {project.launchDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        Launch: {new Date(project.launchDate).toLocaleDateString()}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/projects/${project.id}`}>
                          <ListChecks className="w-4 h-4 mr-2" />
                          View Checklists
                        </Link>
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/projects/${project.id}`}>
                              <ListChecks className="w-4 h-4 mr-2" />
                              Edit Project
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClick(project)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Stats Summary */}
        {filteredProjects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {filteredProjects.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Projects</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredProjects.filter(p => p.status === 'COMPLETED').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredProjects.filter(p => p.status === 'IN_PROGRESS').length}
                  </div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {filteredProjects.filter(p => p.status === 'PLANNING').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Planning</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone and will permanently remove the project and all its checklists.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  setProjectToDelete(null)
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={deleteProject}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MobileAppShell>
  )
}