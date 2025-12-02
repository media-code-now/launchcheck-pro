"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  MoreVertical, 
  Calendar, 
  User, 
  Globe,
  CheckCircle2,
  Clock,
  TrendingUp,
  Trash2,
  Loader2
} from 'lucide-react'
import { useNotifications } from '@/components/NotificationProvider'

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

interface MobileProjectCardProps {
  project: Project
  onDelete?: (projectId: string) => void
}

export function MobileProjectCard({ project, onDelete }: MobileProjectCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { addNotification } = useNotifications()
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'READY_FOR_LAUNCH':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
      case 'LIVE':
        return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'PLANNING':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <TrendingUp className="h-3 w-3" />
      case 'READY_FOR_LAUNCH':
        return <Clock className="h-3 w-3" />
      case 'LIVE':
        return <CheckCircle2 className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const handleDeleteProject = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        addNotification({
          type: 'success',
          title: 'Project Deleted',
          message: `"${project.name}" has been deleted successfully.`
        })
        
        // Call the onDelete callback to update the parent component
        if (onDelete) {
          onDelete(project.id)
        }
        
        setShowDeleteDialog(false)
      } else {
        addNotification({
          type: 'error',
          title: 'Delete Failed',
          message: data.error || 'Failed to delete project. Please try again.'
        })
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      addNotification({
        type: 'error',
        title: 'Network Error',
        message: 'Unable to delete project. Please check your connection and try again.'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 active:scale-[0.98] hover:shadow-md border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-1">
              {project.name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                <span className="truncate">{project.clientName}</span>
              </div>
              {project.domain && (
                <div className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  <span className="truncate">{project.domain}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
            <Badge 
              className={`text-xs px-2 py-1 ${getStatusColor(project.status)} flex items-center gap-1`}
              variant="outline"
            >
              {getStatusIcon(project.status)}
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span className="text-muted-foreground">
              {project.completedTasks} of {project.totalTasks} tasks
            </span>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={project.progress} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{project.progress}% complete</span>
              {project.launchDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Due {formatDate(project.launchDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="mt-4 pt-3 border-t space-y-2">
          <Link href={`/projects/${project.id}`}>
            <Button 
              variant="ghost" 
              className="w-full justify-start h-10 text-sm font-medium"
            >
              View Details →
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start h-10 text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation()
              setShowDeleteDialog(true)
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Project
          </Button>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{project.name}"? This action cannot be undone.
              All checklists and progress data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProject}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}