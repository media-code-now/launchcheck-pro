"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import AppLayout from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Settings, Bell, User, Palette, Database, Mail, Shield } from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  
  // Settings state
  const [settings, setSettings] = useState({
    // General settings
    companyName: "Acme Web Agency",
    defaultClientEmail: "",
    defaultProjectStatus: "IN_PROGRESS",
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    taskReminders: true,
    
    // Appearance settings
    sidebarCollapsed: false,
    showCompletedTasks: true,
    
    // System settings
    autoBackup: true,
    dataRetention: "1_YEAR",
    timezone: "America/New_York"
  })

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Settings saved:", settings)
    alert("Settings saved successfully!")
  }

  const handleReset = () => {
    // Reset to defaults
    setSettings({
      companyName: "Acme Web Agency",
      defaultClientEmail: "",
      defaultProjectStatus: "IN_PROGRESS",
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      taskReminders: true,
      sidebarCollapsed: false,
      showCompletedTasks: true,
      autoBackup: true,
      dataRetention: "1_YEAR",
      timezone: "America/New_York"
    })
    // Reset theme to system default
    setTheme("system")
    console.log("Settings reset to defaults")
    alert("Settings reset to defaults!")
  }

  return (
    <AppLayout 
      breadcrumbs={[{ label: "Settings" }]}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application preferences and configuration.
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              System
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic application settings and defaults.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={settings.companyName}
                      onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                      placeholder="Enter your company name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultEmail">Default Client Email Domain</Label>
                    <Input
                      id="defaultEmail"
                      value={settings.defaultClientEmail}
                      onChange={(e) => setSettings({ ...settings, defaultClientEmail: e.target.value })}
                      placeholder="e.g., @clientcompany.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultStatus">Default Project Status</Label>
                    <Select
                      value={settings.defaultProjectStatus}
                      onValueChange={(value) => setSettings({ ...settings, defaultProjectStatus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PLANNING">Planning</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="REVIEW">Review</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive browser push notifications
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-reports">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Get a summary of your projects every week
                      </p>
                    </div>
                    <Switch
                      id="weekly-reports"
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="task-reminders">Task Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminded about overdue tasks
                      </p>
                    </div>
                    <Switch
                      id="task-reminders"
                      checked={settings.taskReminders}
                      onCheckedChange={(checked) => setSettings({ ...settings, taskReminders: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance & Display</CardTitle>
                <CardDescription>
                  Customize how the application looks and feels.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={theme}
                      onValueChange={(value) => setTheme(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sidebar-collapsed">Collapse Sidebar</Label>
                      <p className="text-sm text-muted-foreground">
                        Keep the sidebar collapsed by default
                      </p>
                    </div>
                    <Switch
                      id="sidebar-collapsed"
                      checked={settings.sidebarCollapsed}
                      onCheckedChange={(checked) => setSettings({ ...settings, sidebarCollapsed: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-completed">Show Completed Tasks</Label>
                      <p className="text-sm text-muted-foreground">
                        Display completed tasks in project views
                      </p>
                    </div>
                    <Switch
                      id="show-completed"
                      checked={settings.showCompletedTasks}
                      onCheckedChange={(checked) => setSettings({ ...settings, showCompletedTasks: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System & Data</CardTitle>
                <CardDescription>
                  Configure system behavior and data management.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data-retention">Data Retention Period</Label>
                    <Select
                      value={settings.dataRetention}
                      onValueChange={(value) => setSettings({ ...settings, dataRetention: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6_MONTHS">6 Months</SelectItem>
                        <SelectItem value="1_YEAR">1 Year</SelectItem>
                        <SelectItem value="2_YEARS">2 Years</SelectItem>
                        <SelectItem value="INDEFINITE">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-backup">Automatic Backups</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically backup your data daily
                      </p>
                    </div>
                    <Switch
                      id="auto-backup"
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Danger Zone</h4>
                  <div className="space-y-2">
                    <Button variant="destructive" size="sm">
                      Export All Data
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Download all your data as a backup
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}