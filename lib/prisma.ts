import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Database utility functions

export async function getProjectWithChecklists(projectId: string) {
  return await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      checklistInstances: {
        include: {
          template: {
            select: {
              id: true,
              name: true,
              description: true,
            }
          },
          items: {
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
              }
            },
            orderBy: {
              templateItem: {
                order: 'asc'
              }
            }
          }
        },
        orderBy: {
          type: 'asc' // PRE will come before POST
        }
      }
    }
  })
}

export async function createDefaultChecklistInstances(projectId: string) {
  // Get the default templates
  const templates = await prisma.checklistTemplate.findMany({
    where: { isActive: true },
    include: {
      items: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }
    }
  })

  // Create checklist instances for each template type
  for (const template of templates) {
    // Check if instance already exists
    const existingInstance = await prisma.checklistInstance.findFirst({
      where: {
        projectId: projectId,
        type: template.type
      }
    })

    if (!existingInstance) {
      // Create checklist instance
      await prisma.checklistInstance.create({
        data: {
          type: template.type,
          projectId: projectId,
          templateId: template.id,
          items: {
            create: template.items.map(item => ({
              status: 'NOT_STARTED',
              templateItemId: item.id
            }))
          }
        }
      })
    }
  }
}

export async function updateChecklistItemStatus(itemId: string, status: string, assignee?: string, note?: string) {
  return await prisma.checklistItemInstance.update({
    where: { id: itemId },
    data: {
      status,
      assignee,
      note,
      updatedAt: new Date()
    }
  })
}

export async function getChecklistTemplates() {
  return await prisma.checklistTemplate.findMany({
    where: { isActive: true },
    include: {
      items: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { type: 'asc' }
  })
}

// Helper function to calculate progress
export function calculateProgress(items: any[]) {
  if (items.length === 0) return 0
  const completedItems = items.filter(item => item.status === 'DONE').length
  return Math.round((completedItems / items.length) * 100)
}