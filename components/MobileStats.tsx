"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { 
  FolderOpen, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  Target,
  Calendar
} from 'lucide-react'

interface StatsData {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalTasks: number
  completedTasks: number
  averageProgress: number
  dueThisWeek: number
}

interface MobileStatsProps {
  stats: StatsData
}

export function MobileStats({ stats }: MobileStatsProps) {
  const statItems = [
    {
      label: 'Active Projects',
      value: stats.activeProjects,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Completed',
      value: stats.completedProjects,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Due This Week',
      value: stats.dueThisWeek,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Avg Progress',
      value: `${stats.averageProgress}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    }
  ]

  return (
    <div className="px-4 py-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {statItems.map((item, index) => {
          const Icon = item.icon
          return (
            <Card key={index} className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {item.label}
                    </p>
                    <p className="text-2xl font-bold">
                      {item.value}
                    </p>
                  </div>
                  <div className={`p-2 rounded-full ${item.bgColor}`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Task Progress Bar */}
      <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-indigo-500/10">
                <Target className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="font-medium">Overall Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {stats.completedTasks}/{stats.totalTasks}
            </span>
          </div>
          
          <div className="w-full bg-secondary rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` 
              }}
            />
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            {stats.totalTasks > 0 
              ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}% of all tasks completed`
              : 'No tasks yet'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  )
}