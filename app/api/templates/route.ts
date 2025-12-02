import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get all templates with their items
    const templates = await prisma.checklistTemplate.findMany({
      include: {
        items: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        type: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: templates,
      summary: {
        totalTemplates: templates.length,
        totalItems: templates.reduce((sum, template) => sum + template.items.length, 0),
        templates: templates.map(t => ({
          type: t.type,
          name: t.name,
          itemCount: t.items.length
        }))
      }
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch templates'
    }, { status: 500 })
  }
}