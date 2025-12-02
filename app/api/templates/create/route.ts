import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, description, type } = body

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Template name is required'
      }, { status: 400 })
    }

    if (!type || !['PRE_LAUNCH', 'POST_LAUNCH'].includes(type)) {
      return NextResponse.json({
        success: false,
        error: 'Valid template type is required (PRE_LAUNCH or POST_LAUNCH)'
      }, { status: 400 })
    }

    // Create the template
    const template = await prisma.checklistTemplate.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        type: type
      }
    })

    return NextResponse.json({
      success: true,
      data: template,
      message: 'Template created successfully'
    })

  } catch (error) {
    console.error('Template creation error:', error)
    
    // Handle unique constraint violation (if name should be unique)
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: 'A template with this name already exists'
      }, { status: 409 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create template'
    }, { status: 500 })
  }
}