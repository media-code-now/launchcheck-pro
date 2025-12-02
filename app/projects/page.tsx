"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { MobileAppShell } from "@/components/MobileAppShell"
import { MobileProjectCard } from "@/components/MobileProjectCard"
import { useNotifications } from "@/components/NotificationProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FolderOpen, Search } from "lucide-react"

interface Project {
  id: string
  name: string
  clientName: string
  status: string
  domain?: string
  progress: number
  totalTasks: number
  completedTasks: number
  createdAt: string
  checklists: Array<{
    id: string
    name: string
    items: Array<{
      id: string
      status: string
    }>
  }>
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { addNotification } = useNotifications()

  const calculateProgress = (project: any) => {
    const totalTasks = project.checklists?.reduce((acc: number, checklist: any) => 
      acc + (checklist.items?.length || 0), 0) || 0
    const completedTasks = project.checklists?.reduce((acc: number, checklist: any) => 
      acc + (checklist.items?.filter((item: any) => item.status === 'COMPLETED').length || 0), 0) || 0
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    return { totalTasks, completedTasks, progress }
  }

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/projects")
      const data = await response.json()
      
      if (data.success) {
        // Transform projects to include calculated fields
        const transformedProjects = (data.projects || []).map((project: any) => {
          const { totalTasks, completedTasks, progress } = calculateProgress(project)
          return {
            ...project,
            progress,
            totalTasks,
            completedTasks,
            createdAt: project.createdAt || new Date().toISOString()
          }
        })
        setProjects(transformedProjects)
      } else {
        throw new Error(data.error || "Failed to fetch projects")
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      addNotification({
        type: 'error',
        title: 'Failed to load projects',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Manage your project checklists
            </p>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "Get started by creating your first project"
                }
              </p>
              {!searchTerm && (
                <Button asChild>
                  <Link href="/api/create-sample-project">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Sample Project
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <MobileProjectCard 
                key={project.id} 
                project={project} 
                onDelete={() => fetchProjects()}
              />
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {filteredProjects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {filteredProjects.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {filteredProjects.length === 1 ? 'Project' : 'Projects'}
                  </p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {filteredProjects.filter(p => p.status === 'COMPLETED').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MobileAppShell>
  )
}