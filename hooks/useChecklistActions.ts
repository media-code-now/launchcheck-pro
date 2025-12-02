'use client'

import { useOptimistic, useTransition } from 'react'
import { toast } from '@/lib/toast'
import { 
  updateChecklistItem, 
  toggleChecklistItemStatus,
  updateChecklistItemNote,
  updateChecklistItemAssignee,
  ChecklistItemStatus,
  UpdateChecklistItemData
} from '@/lib/actions'
import { ChecklistItemWithTemplate } from "@/types/checklist"

export function useChecklistItemActions(items: ChecklistItemWithTemplate[]) {
  const [isPending, startTransition] = useTransition()
  
  // Optimistic state for immediate UI updates
  const [optimisticItems, addOptimisticUpdate] = useOptimistic(
    items,
    (state, { itemId, update }: { itemId: string; update: Partial<ChecklistItemWithTemplate> }) => {
      return state.map(item => 
        item.id === itemId ? { ...item, ...update } : item
      )
    }
  )

  const handleToggleStatus = async (item: ChecklistItemWithTemplate) => {
    const newStatus: ChecklistItemStatus = item.status === 'DONE' ? 'NOT_STARTED' : 'DONE'
    
    // Optimistically update UI
    addOptimisticUpdate({
      itemId: item.id,
      update: { status: newStatus }
    })

    // Start transition for server action
    startTransition(async () => {
      try {
        const result = await toggleChecklistItemStatus(item.id, item.status as ChecklistItemStatus)
        
        if (!result.success) {
          toast.error(`Failed to update item: ${result.error}`)
          // Note: The page will revalidate and show correct state
        } else {
          toast.success(newStatus === 'DONE' ? 'Item marked as complete!' : 'Item marked as incomplete')
        }
      } catch (error) {
        toast.error('Failed to update item status')
        console.error('Toggle status error:', error)
      }
    })
  }

  const handleStatusChange = async (item: ChecklistItemWithTemplate, newStatus: ChecklistItemStatus) => {
    // Optimistically update UI
    addOptimisticUpdate({
      itemId: item.id,
      update: { status: newStatus }
    })

    startTransition(async () => {
      try {
        const result = await updateChecklistItem(item.id, { status: newStatus })
        
        if (!result.success) {
          toast.error(`Failed to update status: ${result.error}`)
        } else {
          toast.success(`Status updated to ${newStatus.replace('_', ' ').toLowerCase()}`)
        }
      } catch (error) {
        toast.error('Failed to update item status')
        console.error('Status change error:', error)
      }
    })
  }

  const handleUpdateNote = async (item: ChecklistItemWithTemplate, note: string) => {
    // Optimistically update UI
    addOptimisticUpdate({
      itemId: item.id,
      update: { note }
    })

    startTransition(async () => {
      try {
        const result = await updateChecklistItemNote(item.id, note)
        
        if (!result.success) {
          toast.error(`Failed to update note: ${result.error}`)
        } else {
          toast.success('Note updated successfully')
        }
      } catch (error) {
        toast.error('Failed to update note')
        console.error('Note update error:', error)
      }
    })
  }

  const handleUpdateAssignee = async (item: ChecklistItemWithTemplate, assignee: string) => {
    // Optimistically update UI
    addOptimisticUpdate({
      itemId: item.id,
      update: { assignee }
    })

    startTransition(async () => {
      try {
        const result = await updateChecklistItemAssignee(item.id, assignee)
        
        if (!result.success) {
          toast.error(`Failed to update assignee: ${result.error}`)
        } else {
          toast.success('Assignee updated successfully')
        }
      } catch (error) {
        toast.error('Failed to update assignee')
        console.error('Assignee update error:', error)
      }
    })
  }

  const handleBulkUpdate = async (itemId: string, data: UpdateChecklistItemData) => {
    // Optimistically update UI
    addOptimisticUpdate({
      itemId,
      update: data
    })

    startTransition(async () => {
      try {
        const result = await updateChecklistItem(itemId, data)
        
        if (!result.success) {
          toast.error(`Failed to update item: ${result.error}`)
        } else {
          toast.success('Item updated successfully')
        }
      } catch (error) {
        toast.error('Failed to update item')
        console.error('Bulk update error:', error)
      }
    })
  }

  return {
    optimisticItems,
    isPending,
    actions: {
      toggleStatus: handleToggleStatus,
      changeStatus: handleStatusChange,
      updateNote: handleUpdateNote,
      updateAssignee: handleUpdateAssignee,
      bulkUpdate: handleBulkUpdate
    }
  }
}

// Hook for individual item management
export function useChecklistItem(item: ChecklistItemWithTemplate) {
  const [isPending, startTransition] = useTransition()
  
  const [optimisticItem, updateOptimisticItem] = useOptimistic(
    item,
    (state, update: Partial<ChecklistItemWithTemplate>) => ({
      ...state,
      ...update
    })
  )

  const toggle = () => {
    const newStatus: ChecklistItemStatus = item.status === 'DONE' ? 'NOT_STARTED' : 'DONE'
    
    updateOptimisticItem({ status: newStatus })
    
    startTransition(async () => {
      const result = await toggleChecklistItemStatus(item.id, item.status as ChecklistItemStatus)
      if (!result.success) {
        toast.error(`Failed to update: ${result.error}`)
      }
    })
  }

  const updateStatus = (status: ChecklistItemStatus) => {
    updateOptimisticItem({ status })
    
    startTransition(async () => {
      const result = await updateChecklistItem(item.id, { status })
      if (!result.success) {
        toast.error(`Failed to update: ${result.error}`)
      }
    })
  }

  const updateNote = (note: string) => {
    updateOptimisticItem({ note })
    
    startTransition(async () => {
      const result = await updateChecklistItemNote(item.id, note)
      if (!result.success) {
        toast.error(`Failed to update: ${result.error}`)
      }
    })
  }

  return {
    item: optimisticItem,
    isPending,
    actions: {
      toggle,
      updateStatus,
      updateNote
    }
  }
}