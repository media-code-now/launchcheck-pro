// lib/neon-direct.ts - Direct Neon SQL queries for Netlify deployment
import { neon } from '@netlify/neon'

// Initialize the SQL client - automatically uses NETLIFY_DATABASE_URL
const sql = neon()

export async function getProjectsDirectSQL() {
  try {
    const projects = await sql`
      SELECT 
        p.*,
        COUNT(ci.id) as checklist_count,
        COUNT(CASE WHEN cii.status = 'DONE' THEN 1 END) as completed_tasks,
        COUNT(cii.id) as total_tasks
      FROM projects p
      LEFT JOIN checklist_instances ci ON p.id = ci.project_id
      LEFT JOIN checklist_item_instances cii ON ci.id = cii.checklist_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `
    
    return projects.map(project => ({
      ...project,
      progress: project.total_tasks > 0 
        ? Math.round((project.completed_tasks / project.total_tasks) * 100) 
        : 0
    }))
  } catch (error) {
    console.error('Error fetching projects with direct SQL:', error)
    throw error
  }
}

export async function createProjectDirectSQL(projectData: {
  name: string
  clientName: string
  domain?: string
  launchDate?: Date
}) {
  try {
    // Get or create user
    let user = await sql`SELECT id FROM users LIMIT 1`
    
    if (user.length === 0) {
      user = await sql`
        INSERT INTO users (id, name, email, created_at, updated_at)
        VALUES (gen_random_uuid(), 'Demo User', 'demo@launchcheck.com', NOW(), NOW())
        RETURNING id
      `
    }

    // Create project
    const [project] = await sql`
      INSERT INTO projects (id, name, client_name, domain, status, launch_date, user_id, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        ${projectData.name},
        ${projectData.clientName},
        ${projectData.domain || null},
        'IN_PROGRESS',
        ${projectData.launchDate || null},
        ${user[0].id},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    // Get active templates
    const templates = await sql`
      SELECT ct.*, 
             json_agg(
               json_build_object(
                 'id', cit.id,
                 'title', cit.title,
                 'description', cit.description,
                 'order', cit.order
               ) ORDER BY cit.order
             ) as items
      FROM checklist_templates ct
      LEFT JOIN checklist_item_templates cit ON ct.id = cit.template_id 
      WHERE ct.is_active = true AND cit.is_active = true
      GROUP BY ct.id
    `

    // Create checklist instances and items
    for (const template of templates) {
      const [instance] = await sql`
        INSERT INTO checklist_instances (id, type, project_id, template_id, created_at, updated_at)
        VALUES (gen_random_uuid(), ${template.type}, ${project.id}, ${template.id}, NOW(), NOW())
        RETURNING id
      `

      // Create checklist item instances
      for (const item of template.items) {
        await sql`
          INSERT INTO checklist_item_instances (
            id, status, checklist_id, template_item_id, created_at, updated_at
          ) VALUES (
            gen_random_uuid(), 'NOT_STARTED', ${instance.id}, ${item.id}, NOW(), NOW()
          )
        `
      }
    }

    return {
      success: true,
      project: {
        ...project,
        totalTasks: templates.reduce((sum, t) => sum + t.items.length, 0),
        completedTasks: 0,
        progress: 0
      }
    }
  } catch (error) {
    console.error('Error creating project with direct SQL:', error)
    throw error
  }
}

export async function getProjectByIdDirectSQL(projectId: string) {
  try {
    const [project] = await sql`
      SELECT p.*,
             json_agg(
               DISTINCT json_build_object(
                 'id', ci.id,
                 'type', ci.type,
                 'template', json_build_object(
                   'id', ct.id,
                   'name', ct.name,
                   'type', ct.type
                 ),
                 'items', (
                   SELECT json_agg(
                     json_build_object(
                       'id', cii.id,
                       'status', cii.status,
                       'assignee', cii.assignee,
                       'note', cii.note,
                       'templateItem', json_build_object(
                         'id', cit.id,
                         'title', cit.title,
                         'description', cit.description,
                         'category', cit.category,
                         'priority', cit.priority,
                         'order', cit.order
                       )
                     ) ORDER BY cit.order
                   )
                   FROM checklist_item_instances cii
                   JOIN checklist_item_templates cit ON cii.template_item_id = cit.id
                   WHERE cii.checklist_id = ci.id
                 )
               )
             ) FILTER (WHERE ci.id IS NOT NULL) as checklist_instances
      FROM projects p
      LEFT JOIN checklist_instances ci ON p.id = ci.project_id
      LEFT JOIN checklist_templates ct ON ci.template_id = ct.id
      WHERE p.id = ${projectId}
      GROUP BY p.id
    `

    return project
  } catch (error) {
    console.error('Error fetching project with direct SQL:', error)
    throw error
  }
}