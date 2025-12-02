'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DemoPage() {
  const [projectId, setProjectId] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const createSampleProject = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-sample-project', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        setProjectId(data.projectId)
      } else {
        alert('Error creating project: ' + data.error)
      }
    } catch (error) {
      alert('Error: ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">LaunchCheck Demo</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Dynamic Project Route</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Create a sample project with pre-seeded checklist data to test the new dynamic route integration.
            </p>
            
            <Button 
              onClick={createSampleProject} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating Project...' : 'Create Sample Project'}
            </Button>
            
            {projectId && (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-green-700 font-medium mb-2">
                  ✅ Project created successfully!
                </p>
                <p className="text-sm text-green-600 mb-3">
                  Project ID: {projectId}
                </p>
                <Button asChild className="w-full">
                  <a href={`/projects/${projectId}`}>
                    View Project Checklists →
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Implementation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">✅ Completed</h4>
                <ul className="space-y-1 text-muted-foreground ml-4">
                  <li>• Dynamic route: <code>/projects/[projectId]/page.tsx</code></li>
                  <li>• Prisma data fetching with relationships</li>
                  <li>• Updated component props interfaces</li>
                  <li>• Real data integration in ChecklistCategoryLayout</li>
                  <li>• Server components with client interactivity</li>
                  <li>• Utility functions for data operations</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">🏗️ Architecture</h4>
                <ul className="space-y-1 text-muted-foreground ml-4">
                  <li>• Server component for data fetching</li>
                  <li>• Client components for interactive elements</li>
                  <li>• Proper TypeScript interfaces</li>
                  <li>• Automatic checklist instance creation</li>
                  <li>• Real-time progress calculation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}