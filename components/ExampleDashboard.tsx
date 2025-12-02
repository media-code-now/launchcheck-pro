"use client"

import AppLayout from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ExampleDashboard() {
  // Example breadcrumbs - you can customize these
  const customBreadcrumbs = [
    { label: "Projects", href: "/projects" },
    { label: "My Awesome Project" }
  ]

  return (
    <AppLayout 
      breadcrumbs={customBreadcrumbs}
      projectName="My Awesome Project"
    >
      {/* Your dashboard content goes here */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your project progress from this central dashboard.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Badge variant="secondary">24</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Badge>89</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">57%</div>
              <p className="text-xs text-muted-foreground">
                +4.2% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Badge variant="outline">12</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23%</div>
              <p className="text-xs text-muted-foreground">
                -2.1% from yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest project updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Task completed: "Setup database"</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New member added to team</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Deadline updated for milestone</p>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start">Create new task</Button>
                <Button variant="outline" className="w-full justify-start">
                  Schedule meeting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Upload files
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Generate report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Example of how the scrolling works with more content */}
        <Card>
          <CardHeader>
            <CardTitle>Scrollable Content Example</CardTitle>
            <CardDescription>
              This content demonstrates how the ScrollArea component handles overflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <p className="font-medium">Content Item #{i + 1}</p>
                  <p className="text-sm text-muted-foreground">
                    This is example content to demonstrate scrolling behavior in the AppLayout component.
                    The ScrollArea will handle overflow gracefully while maintaining the max-width constraint.
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}