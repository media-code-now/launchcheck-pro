import { notFound } from 'next/navigation'
import ProjectChecklistsPage from '@/components/ProjectChecklistsPage'
import { ProjectWithChecklists } from '@/types/checklist'
import AppLayout from '@/components/AppLayout'
import { getProjectWithChecklists, createDefaultChecklistInstances, calculateProgress } from '@/lib/prisma'
import { ChecklistItemWithTemplate, ChecklistInstanceWithItems } from '@/types/checklist'

export default async function ProjectPage({ 
  params 
}: { 
  params: { projectId: string } 
}) {
  const { projectId } = params

  // Try to get the project with checklists
  let project = await getProjectWithChecklists(projectId)
  
  // If project exists but has no checklist instances, create them
  if (project && project.checklistInstances.length === 0) {
    await createDefaultChecklistInstances(projectId)
    project = await getProjectWithChecklists(projectId) // Refetch with instances
  }

  if (!project) {
    notFound()
  }

  // Calculate progress for each checklist type
  const preChecklist = project.checklistInstances.find(instance => instance.type === 'PRE')
  const postChecklist = project.checklistInstances.find(instance => instance.type === 'POST')

  const preProgress = preChecklist ? calculateProgress(preChecklist.items) : 0
  const postProgress = postChecklist ? calculateProgress(postChecklist.items) : 0

  return (
    <AppLayout>
      <ProjectChecklistsPage 
        project={project}
        preChecklist={preChecklist}
        postChecklist={postChecklist}
        preProgress={preProgress}
        postProgress={postProgress}
      />
    </AppLayout>
  )
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { projectId: string } }) {
  const project = await getProjectWithChecklists(params.projectId)

  return {
    title: project ? `${project.name} - ${project.clientName} | LaunchCheck` : 'Project Not Found',
    description: project ? `Manage checklists for ${project.name}` : 'Project not found'
  }
}