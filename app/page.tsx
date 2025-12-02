"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  FolderOpen, 
  ListChecks,
  TrendingUp,
  Clock,
  Users,
  Loader2
} from "lucide-react"

interface Project {
  id: string
  name: string
  clientName: string
  domain?: string
  status: string
  launchDate?: string
  progress: number
  totalTasks: number
  completedTasks: number
  createdAt: string
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Fetch real projects data
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      if (data.success) {
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewProject = async (formData: {
    name: string
    clientName: string
    domain?: string
    launchDate?: string
  }) => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      if (data.success) {
        await fetchProjects() // Refresh the projects list
        setShowCreateForm(false)
      } else {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error
        alert('Error creating project: ' + errorMsg)
        console.error('Project creation failed:', data)
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Error creating project')
    } finally {
      setIsCreating(false)
    }
  }

  const calculateStats = () => {
    const totalProjects = projects.length
    const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS').length
    const completedProjects = projects.filter(p => p.status === 'LIVE').length
    const totalTasks = projects.reduce((sum, p) => sum + p.totalTasks, 0)
    const completedTasks = projects.reduce((sum, p) => sum + p.completedTasks, 0)
    const averageProgress = totalProjects > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects) : 0
    const dueThisWeek = projects.filter(p => {
      if (!p.launchDate) return false
      const due = new Date(p.launchDate)
      const now = new Date()
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      return due >= now && due <= weekFromNow
    }).length

    return {
      totalProjects,
      activeProjects, 
      completedProjects,
      totalTasks,
      completedTasks,
      averageProgress,
      dueThisWeek
    }
  }

  const stats = calculateStats()

  const getPriorityFromStatus = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'high'
      case 'READY_FOR_LAUNCH': return 'medium' 
      default: return 'low'
    }
  }

  return (
    <main className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Checklist Manager</h1>
            <p className="text-xl text-muted-foreground">
              Organize your projects and track progress with smart checklists
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/demo">
              <Button variant="outline">View Demo</Button>
            </Link>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeProjects} active, {stats.completedProjects} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                of {stats.totalTasks} total tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageProgress}%</div>
              <p className="text-xs text-muted-foreground">
                Across all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.dueThisWeek}</div>
              <p className="text-xs text-muted-foreground">
                {stats.dueThisWeek === 1 ? 'project' : 'projects'} due soon
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Your Projects</h2>
            <Link href="/projects">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>

{loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading projects...</span>
            </div>
          ) : projects.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first project to get started with checklist management
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge 
                        variant={
                          getPriorityFromStatus(project.status) === "high" ? "destructive" :
                          getPriorityFromStatus(project.status) === "medium" ? "default" : "secondary"
                        }
                      >
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardDescription>
                      Client: {project.clientName}
                      {project.domain && ` • ${project.domain}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Progress</span>
                        <span>{project.completedTasks}/{project.totalTasks} tasks</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {project.launchDate 
                          ? `Due: ${new Date(project.launchDate).toLocaleDateString()}`
                          : 'No due date set'
                        }
                      </div>
                      <Link href={`/projects/${project.id}`}>
                        <Button size="sm">Open</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with common tasks and templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/demo">
                <Button variant="outline" className="w-full justify-start">
                  <ListChecks className="h-4 w-4 mr-2" />
                  View Demo Project
                </Button>
              </Link>
              <Link href="/actions-demo">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create from Template
                </Button>
              </Link>
              <Link href="/simple">
                <Button variant="outline" className="w-full justify-start">
                  <Circle className="h-4 w-4 mr-2" />
                  Simple Checklist
                </Button>
              </Link>
              <Link href="/test">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Team Templates
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Project Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Set up a new project with checklists to track your launch process.
            </DialogDescription>
          </DialogHeader>
          <CreateProjectForm 
            onSubmit={createNewProject}
            onCancel={() => setShowCreateForm(false)}
            isCreating={isCreating}
          />
        </DialogContent>
      </Dialog>
    </main>
  )
}

// Create Project Form Component
function CreateProjectForm({ 
  onSubmit, 
  onCancel, 
  isCreating 
}: {
  onSubmit: (data: {name: string, clientName: string, domain?: string, launchDate?: string}) => void
  onCancel: () => void
  isCreating: boolean
}) {
  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    domain: '',
    launchDate: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim() && formData.clientName.trim()) {
      onSubmit({
        name: formData.name.trim(),
        clientName: formData.clientName.trim(),
        domain: formData.domain.trim() || undefined,
        launchDate: formData.launchDate || undefined
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium">
          Project Name *
        </label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
          placeholder="e.g., Website Launch"
          required
        />
      </div>
      
      <div>
        <label htmlFor="clientName" className="text-sm font-medium">
          Client Name *
        </label>
        <Input
          id="clientName"
          value={formData.clientName}
          onChange={(e) => setFormData(prev => ({...prev, clientName: e.target.value}))}
          placeholder="e.g., ACME Corp"
          required
        />
      </div>
      
      <div>
        <label htmlFor="domain" className="text-sm font-medium">
          Domain (optional)
        </label>
        <Input
          id="domain"
          value={formData.domain}
          onChange={(e) => setFormData(prev => ({...prev, domain: e.target.value}))}
          placeholder="e.g., acme-corp.com"
        />
      </div>
      
      <div>
        <label htmlFor="launchDate" className="text-sm font-medium">
          Launch Date (optional)
        </label>
        <Input
          id="launchDate"
          type="date"
          value={formData.launchDate}
          onChange={(e) => setFormData(prev => ({...prev, launchDate: e.target.value}))}
        />
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isCreating}>
          Cancel
        </Button>
        <Button type="submit" disabled={isCreating || !formData.name.trim() || !formData.clientName.trim()}>
          {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isCreating ? 'Creating...' : 'Create Project'}
        </Button>
      </DialogFooter>
    </form>
  )
}
