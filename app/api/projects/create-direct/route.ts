import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@netlify/neon'

// Alternative project creation using direct SQL (for debugging)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, clientName, domain, launchDate } = body

    // Initialize Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    // Get or create a default user
    let userResult = await sql`SELECT id FROM users LIMIT 1`
    
    if (userResult.length === 0) {
      userResult = await sql`
        INSERT INTO users (name, email, created_at, updated_at)
        VALUES ('Demo User', 'demo@launchcheck.com', NOW(), NOW())
        RETURNING id
      `
    }

    const userId = userResult[0].id

    // Create the project with direct SQL
    const projectResult = await sql`
      INSERT INTO projects (name, client_name, domain, status, launch_date, user_id, created_at, updated_at)
      VALUES (
        ${name},
        ${clientName || 'Default Client'},
        ${domain || null},
        'IN_PROGRESS',
        ${launchDate ? new Date(launchDate) : null},
        ${userId},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    const project = projectResult[0]

    // Get available templates
    const templates = await sql`
      SELECT ct.id, ct.type, ct.name,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', cit.id,
                   'title', cit.title,
                   'order', cit.order
                 ) ORDER BY cit.order
               ) FILTER (WHERE cit.id IS NOT NULL),
               '[]'::json
             ) as items
      FROM checklist_templates ct
      LEFT JOIN checklist_item_templates cit ON ct.id = cit.template_id AND cit.is_active = true
      WHERE ct.is_active = true
      GROUP BY ct.id, ct.type, ct.name
    `

    // Create checklist instances for each template
    let totalTasks = 0
    
    for (const template of templates) {
      const instanceResult = await sql`
        INSERT INTO checklist_instances (type, project_id, template_id, created_at, updated_at)
        VALUES (${template.type}, ${project.id}, ${template.id}, NOW(), NOW())
        RETURNING id
      `

      const instanceId = instanceResult[0].id

      // Create item instances for each template item
      const items = Array.isArray(template.items) ? template.items : []
      totalTasks += items.length

      for (const templateItem of items) {
        await sql`
          INSERT INTO checklist_item_instances (
            status, checklist_id, template_item_id, created_at, updated_at
          )
          VALUES ('NOT_STARTED', ${instanceId}, ${templateItem.id}, NOW(), NOW())
        `
      }
    }

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        totalTasks,
        completedTasks: 0,
        progress: 0
      },
      message: 'Project created successfully using direct SQL'
    })

  } catch (error) {
    console.error('Error creating project with direct SQL:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create project with direct SQL',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}