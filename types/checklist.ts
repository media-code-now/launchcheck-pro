// Shared types for checklist components
// This file contains all the shared types to avoid circular dependencies

export interface ChecklistItemWithTemplate {
  id: string
  status: string
  assignee: string | null
  note: string | null
  relatedUrl: string | null
  createdAt: Date
  updatedAt: Date
  templateItem: {
    id: string
    category: string
    title: string
    description: string
    priority: string
    order: number
  }
}

export interface ChecklistInstanceWithItems {
  id: string
  type: string
  startedAt: Date
  completedAt: Date | null
  createdAt: Date
  updatedAt: Date
  template: {
    id: string
    name: string
    description: string | null
  }
  items: ChecklistItemWithTemplate[]
}

export interface ProjectWithChecklists {
  id: string
  name: string
  domain: string | null
  clientName: string
  status: string
  launchDate: Date | null
  createdAt: Date
  updatedAt: Date
  checklistInstances: ChecklistInstanceWithItems[]
}

export interface ChecklistTemplateItem {
  id: string
  category: string
  title: string
  description: string
  priority: string
  order: number
}

export interface ChecklistTemplate {
  id: string
  name: string
  description: string | null
  type: string
  items: ChecklistTemplateItem[]
}