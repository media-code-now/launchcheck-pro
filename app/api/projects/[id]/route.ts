import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        checklistInstances: {
          include: {
            template: true,
            items: {
              include: {
                templateItem: true
              },
              orderBy: {
                templateItem: {
                  order: 'asc'
                }
              }
            }
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json({
        success: false,
        error: 'Project not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: project
    })

  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch project'
    }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id }
    })

    if (!project) {
      return NextResponse.json({
        success: false,
        error: 'Project not found'
      }, { status: 404 })
    }

    // Delete the project (this will cascade delete related records due to Prisma schema)
    await prisma.project.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting project:', error)
    
    // Handle foreign key constraint errors
    if (error instanceof Error && 'code' in error && error.code === 'P2003') {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete project due to existing dependencies'
      }, { status: 409 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to delete project'
    }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await req.json()
    const { name, clientName, domain, status, launchDate } = body

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return NextResponse.json({
        success: false,
        error: 'Project not found'
      }, { status: 404 })
    }

    // Update the project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: name?.trim() || existingProject.name,
        clientName: clientName?.trim() || existingProject.clientName,
        domain: domain?.trim() || existingProject.domain,
        status: status || existingProject.status,
        launchDate: launchDate ? new Date(launchDate) : existingProject.launchDate,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully'
    })

  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update project'
    }, { status: 500 })
  }
}