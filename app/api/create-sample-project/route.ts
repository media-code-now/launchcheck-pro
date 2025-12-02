import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Create a sample user first
    let user = await prisma.user.findFirst()
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Demo User',
          email: 'demo@launchcheck.com'
        }
      })
    }

    // Create a sample project
    const project = await prisma.project.create({
      data: {
        name: 'Sample Website Launch',
        clientName: 'ACME Corp',
        domain: 'acme-corp.com',
        status: 'IN_PROGRESS',
        launchDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        userId: user.id
      }
    })

    return NextResponse.json({
      success: true,
      projectId: project.id,
      message: 'Sample project created successfully'
    })
  } catch (error) {
    console.error('Error creating sample project:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create sample project'
    }, { status: 500 })
  }
}