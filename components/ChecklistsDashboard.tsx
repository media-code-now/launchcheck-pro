"use client"

import AppLayout from "@/components/AppLayout"
import ProjectChecklistsPage from "@/components/ProjectChecklistsPage"
import { ProjectWithChecklists } from "@/types/checklist"

export default function ChecklistsDashboard() {
  // Breadcrumbs for the checklist page
  const breadcrumbs = [
    { label: "Projects", href: "/projects" },
    { label: "LaunchCheck Pro", href: "/projects/launchcheck-pro" },
    { label: "Checklists" }
  ]

  // Mock project data for the dashboard
  const mockProject: ProjectWithChecklists = {
    id: "demo-project",
    name: "LaunchCheck Pro",
    clientName: "Demo Client",
    domain: "launchcheck.pro",
    status: "IN_PROGRESS",
    launchDate: new Date("2024-01-15"),
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2023-12-15"),
    checklistInstances: []
  }

  return (
    <AppLayout 
      breadcrumbs={breadcrumbs}
      projectName="LaunchCheck Pro"
    >
      <ProjectChecklistsPage 
        project={mockProject}
        preProgress={75}
        postProgress={45}
      />
    </AppLayout>
  )
}