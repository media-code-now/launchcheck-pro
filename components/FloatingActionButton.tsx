"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface FloatingActionButtonProps {
  onClick: () => void
  className?: string
}

export function FloatingActionButton({ onClick, className }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={`
        fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg 
        bg-primary hover:bg-primary/90 text-primary-foreground
        border-0 transition-all duration-200 ease-out
        hover:scale-110 active:scale-95
        lg:hidden
        ${className}
      `}
    >
      <Plus className="h-6 w-6" />
    </Button>
  )
}