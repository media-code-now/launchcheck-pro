import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        checklistInstances: {
          include: {
            items: {
              select: {
                id: true,
                status: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate progress for each project
    const projectsWithProgress = projects.map(project => {
      const allItems = project.checklistInstances.flatMap(instance => instance.items)
      const completedItems = allItems.filter(item => item.status === 'DONE')
      const progress = allItems.length > 0 ? Math.round((completedItems.length / allItems.length) * 100) : 0
      
      return {
        ...project,
        totalTasks: allItems.length,
        completedTasks: completedItems.length,
        progress
      }
    })

    return NextResponse.json({
      success: true,
      projects: projectsWithProgress
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}