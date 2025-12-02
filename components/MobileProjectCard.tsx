"use client"

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  MoreVertical, 
  Calendar, 
  User, 
  Globe,
  CheckCircle2,
  Clock,
  TrendingUp
} from 'lucide-react'

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
}

export function MobileProjectCard({ project }: MobileProjectCardProps) {
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
        <div className="mt-4 pt-3 border-t">
          <Link href={`/projects/${project.id}`}>
            <Button 
              variant="ghost" 
              className="w-full justify-start h-10 text-sm font-medium"
            >
              View Details →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}