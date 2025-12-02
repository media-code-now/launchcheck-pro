'use client'

import * as React from "react"
import { ChecklistCategoryLayout } from "@/components/ChecklistComponents"
import { EnhancedChecklistRow } from "@/components/EnhancedChecklistRow"
import { useChecklistItemActions } from "@/hooks/useChecklistActions"
import { ChecklistInstanceWithItems } from "@/types/checklist"

interface EnhancedChecklistCategoryLayoutProps {
  checklistInstance: ChecklistInstanceWithItems
  isPost?: boolean
}

export const EnhancedChecklistCategoryLayout: React.FC<EnhancedChecklistCategoryLayoutProps> = ({ 
  checklistInstance, 
  isPost = false 
}) => {
  const { optimisticItems, isPending, actions } = useChecklistItemActions(checklistInstance.items)

  // Create an enhanced version of the checklist instance with optimistic items
  const enhancedInstance = {
    ...checklistInstance,
    items: optimisticItems
  }

  return (
    <ChecklistCategoryLayout 
      checklistInstance={enhancedInstance} 
      isPost={isPost}
    />
  )
}

export default EnhancedChecklistCategoryLayout