import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== DEBUG: Starting project creation ===')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { name, clientName, domain, launchDate } = body

    // Step 1: Test database connection
    console.log('Step 1: Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connected')

    // Step 2: Get or create a default user
    console.log('Step 2: Finding/creating user...')
    let user = await prisma.user.findFirst()
    console.log('Existing user:', user ? user.id : 'none')
    
    if (!user) {
      console.log('Creating new user...')
      user = await prisma.user.create({
        data: {
          name: 'Demo User',
          email: 'demo@launchcheck.com'
        }
      })
      console.log('✅ User created:', user.id)
    } else {
      console.log('✅ Using existing user:', user.id)
    }

    // Step 3: Create the project
    console.log('Step 3: Creating project...')
    const project = await prisma.project.create({
      data: {
        name,
        clientName: clientName || 'Default Client',
        domain,
        status: 'IN_PROGRESS',
        launchDate: launchDate ? new Date(launchDate) : null,
        userId: user.id
      }
    })
    console.log('✅ Project created:', project.id)

    // Step 4: Get available templates
    console.log('Step 4: Fetching templates...')
    const templates = await prisma.checklistTemplate.findMany({
      where: { isActive: true },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    })
    console.log('✅ Templates found:', templates.length)
    templates.forEach(t => console.log(`  - ${t.name}: ${t.items.length} items`))

    // Step 5: Create checklist instances
    console.log('Step 5: Creating checklist instances...')
    let totalTasks = 0
    
    for (const template of templates) {
      console.log(`Creating instance for template: ${template.name}`)
      
      const instance = await prisma.checklistInstance.create({
        data: {
          type: template.type,
          projectId: project.id,
          templateId: template.id
        }
      })
      console.log(`✅ Instance created: ${instance.id}`)

      // Create item instances
      console.log(`Creating ${template.items.length} item instances...`)
      for (const templateItem of template.items) {
        await prisma.checklistItemInstance.create({
          data: {
            status: 'NOT_STARTED',
            checklistId: instance.id,
            templateItemId: templateItem.id
          }
        })
        totalTasks++
      }
      console.log(`✅ ${template.items.length} item instances created`)
    }

    console.log('=== DEBUG: Project creation completed successfully ===')
    console.log('Total tasks created:', totalTasks)

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        totalTasks,
        completedTasks: 0,
        progress: 0
      }
    })

  } catch (error) {
    console.error('=== DEBUG: Error creating project ===')
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error instanceof Error ? error.message : error)
    console.error('Full error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create project',
        details: error instanceof Error ? error.message : 'Unknown error',
        errorType: error?.constructor?.name || 'Unknown'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}