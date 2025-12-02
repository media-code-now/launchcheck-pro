import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params
    const body = await req.json()
    const { status } = body

    // Validate status
    const validStatuses = ['NOT_STARTED', 'IN_PROGRESS', 'DONE', 'NOT_APPLICABLE']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      }, { status: 400 })
    }

    // Check if item exists
    const existingItem = await prisma.checklistItemInstance.findUnique({
      where: { id: itemId },
      include: {
        templateItem: true,
        checklist: {
          include: {
            project: true
          }
        }
      }
    })

    if (!existingItem) {
      return NextResponse.json({
        success: false,
        error: 'Checklist item not found'
      }, { status: 404 })
    }

    // Update the item status
    const updatedItem = await prisma.checklistItemInstance.update({
      where: { id: itemId },
      data: {
        status: status,
        updatedAt: new Date()
      },
      include: {
        templateItem: true,
        checklist: {
          include: {
            project: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: `Task "${updatedItem.templateItem.title}" marked as ${status.toLowerCase().replace('_', ' ')}`
    })

  } catch (error) {
    console.error('Error updating checklist item:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update checklist item'
    }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params

    const item = await prisma.checklistItemInstance.findUnique({
      where: { id: itemId },
      include: {
        templateItem: true,
        checklist: {
          include: {
            template: true,
            project: true
          }
        }
      }
    })

    if (!item) {
      return NextResponse.json({
        success: false,
        error: 'Checklist item not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: item
    })

  } catch (error) {
    console.error('Error fetching checklist item:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch checklist item'
    }, { status: 500 })
  }
}