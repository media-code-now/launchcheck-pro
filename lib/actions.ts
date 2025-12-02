import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export type ChecklistItemStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE' | 'NOT_APPLICABLE'

export interface UpdateChecklistItemData {
  status?: ChecklistItemStatus
  note?: string | null
  assignee?: string | null
  relatedUrl?: string | null
}

export async function updateChecklistItem(
  itemId: string, 
  data: UpdateChecklistItemData
) {
  try {
    // Update the checklist item in database
    const updatedItem = await prisma.checklistItemInstance.update({
      where: { id: itemId },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        templateItem: {
          select: {
            id: true,
            category: true,
            title: true,
            description: true,
            priority: true,
            order: true,
          }
        },
        checklist: {
          select: {
            projectId: true,
            type: true
          }
        }
      }
    })

    // Revalidate the project page to show updated data
    revalidatePath(`/projects/${updatedItem.checklist.projectId}`)
    
    return {
      success: true,
      data: updatedItem
    }
  } catch (error) {
    console.error('Error updating checklist item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export async function toggleChecklistItemStatus(itemId: string, currentStatus: ChecklistItemStatus) {
  const newStatus: ChecklistItemStatus = currentStatus === 'DONE' ? 'NOT_STARTED' : 'DONE'
  
  return updateChecklistItem(itemId, { status: newStatus })
}

export async function updateChecklistItemNote(itemId: string, note: string) {
  return updateChecklistItem(itemId, { note })
}

export async function updateChecklistItemAssignee(itemId: string, assignee: string) {
  return updateChecklistItem(itemId, { assignee })
}

export async function bulkUpdateChecklistItems(
  updates: Array<{ itemId: string; data: UpdateChecklistItemData }>
) {
  try {
    const results = await Promise.all(
      updates.map(({ itemId, data }) => 
        prisma.checklistItemInstance.update({
          where: { id: itemId },
          data: {
            ...data,
            updatedAt: new Date()
          }
        })
      )
    )

    // Get project ID from first item to revalidate
    if (results.length > 0) {
      const firstItem = await prisma.checklistItemInstance.findUnique({
        where: { id: updates[0].itemId },
        include: {
          checklist: {
            select: { projectId: true }
          }
        }
      })
      
      if (firstItem) {
        revalidatePath(`/projects/${firstItem.checklist.projectId}`)
      }
    }

    return {
      success: true,
      data: results
    }
  } catch (error) {
    console.error('Error bulk updating checklist items:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}