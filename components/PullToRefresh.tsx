"use client"

import React, { useState, useRef, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void
  children: React.ReactNode
  threshold?: number
}

export function PullToRefresh({ 
  onRefresh, 
  children, 
  threshold = 80 
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY)
      setIsPulling(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return
    
    const currentY = e.touches[0].clientY
    const distance = Math.max(0, currentY - startY)
    
    if (distance > 0) {
      e.preventDefault()
      setPullDistance(Math.min(distance, threshold * 1.5))
    }
  }

  const handleTouchEnd = async () => {
    if (!isPulling) return
    
    setIsPulling(false)
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error('Refresh failed:', error)
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
    
    setStartY(0)
  }

  useEffect(() => {
    if (!isPulling && !isRefreshing) {
      setPullDistance(0)
    }
  }, [isPulling, isRefreshing])

  const refreshIconScale = Math.min(pullDistance / threshold, 1)
  const refreshIconRotation = (pullDistance / threshold) * 360

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
      style={{
        transform: `translateY(${isPulling || isRefreshing ? pullDistance / 2 : 0}px)`,
        transition: isPulling ? 'none' : 'transform 0.3s ease-out',
      }}
    >
      {/* Pull to refresh indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-background/80 backdrop-blur-sm border-b"
        style={{
          height: `${Math.max(0, pullDistance)}px`,
          transform: `translateY(-${Math.max(0, pullDistance)}px)`,
          opacity: pullDistance > 20 ? 1 : pullDistance / 20,
        }}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw 
            className="h-5 w-5 transition-transform duration-200"
            style={{
              transform: `scale(${refreshIconScale}) rotate(${refreshIconRotation}deg)`,
            }}
          />
          <span className="text-sm font-medium">
            {isRefreshing 
              ? 'Refreshing...' 
              : pullDistance >= threshold 
                ? 'Release to refresh' 
                : 'Pull to refresh'
            }
          </span>
        </div>
      </div>
      
      {children}
    </div>
  )
}