import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { ProjectStatus } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, clientName, domain, launchDate } = body

    // Get or create a default user
    let user = await prisma.user.findFirst()
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Demo User',
          email: 'demo@launchcheck.com'
        }
      })
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        name,
        clientName: clientName || 'Default Client',
        domain,
        status: ProjectStatus.IN_PROGRESS,
        launchDate: launchDate ? new Date(launchDate) : null,
        userId: user.id
      }
    })

    // Get available templates and create checklist instances
    const templates = await prisma.checklistTemplate.findMany({
      where: { isActive: true },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    })

    // Create checklist instances for each template
    for (const template of templates) {
      const instance = await prisma.checklistInstance.create({
        data: {
          type: template.type,
          projectId: project.id,
          templateId: template.id
        }
      })

      // Create item instances for each template item
      for (const templateItem of template.items) {
        await prisma.checklistItemInstance.create({
          data: {
            status: 'NOT_STARTED',
            checklistId: instance.id,
            templateItemId: templateItem.id
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        totalTasks: templates.reduce((sum, t) => sum + t.items.length, 0),
        completedTasks: 0,
        progress: 0
      }
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}