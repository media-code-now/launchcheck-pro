"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"
import { 
  ChevronDown, 
  FileText, 
  FolderOpen, 
  Settings, 
  Plus,
  Download,
  Edit,
  Copy,
  Archive,
  Trash2,
  Share
} from "lucide-react"

// Types
interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  active?: boolean
}

interface BreadcrumbItem {
  label: string
  href?: string
}

interface AppLayoutProps {
  children: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
  projectName?: string
  className?: string
}

// Navigation items configuration
const navigationItems: NavItem[] = [
  {
    label: "Projects",
    href: "/projects",
    icon: FolderOpen,
    active: true
  },
  {
    label: "Templates",
    href: "/templates",
    icon: FileText
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings
  }
]

// Sidebar Navigation Component
interface SidebarNavProps {
  items: NavItem[]
  className?: string
}

const SidebarNav: React.FC<SidebarNavProps> = ({ items, className }) => {
  return (
    <nav className={cn("space-y-2", className)}>
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Button
            key={item.href}
            variant={item.active ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2 h-10",
              item.active && "bg-secondary"
            )}
            asChild
          >
            <a href={item.href}>
              <Icon className="h-4 w-4" />
              {item.label}
            </a>
          </Button>
        )
      })}
    </nav>
  )
}

// Sidebar Component
const Sidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-background border-r border-border">
        {/* App Header */}
        <div className="flex items-center px-6 py-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">LC</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">LaunchCheck</h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-6 py-6">
          <div className="space-y-6">
            {/* New Project Button */}
            <Button className="w-full justify-start gap-2 h-10" size="default">
              <Plus className="h-4 w-4" />
              New project
            </Button>

            {/* Navigation Links */}
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Navigation
              </h2>
              <SidebarNav items={navigationItems} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Header Component
interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[]
  projectName?: string
}

const Header: React.FC<HeaderProps> = ({ breadcrumbs = [], projectName }) => {
  // Default breadcrumbs if none provided
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: "Projects", href: "/projects" }
  ]

  if (projectName) {
    defaultBreadcrumbs.push({ label: projectName })
  }

  const finalBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Breadcrumbs */}
        <div className="flex items-center space-x-4">
          <Breadcrumb>
            <BreadcrumbList>
              {finalBreadcrumbs.map((item, index) => (
                <React.Fragment key={item.label}>
                  <BreadcrumbItem>
                    {item.href && index < finalBreadcrumbs.length - 1 ? (
                      <BreadcrumbLink href={item.href}>
                        {item.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < finalBreadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Export Report Button */}
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export report
          </Button>

          {/* Project Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Project actions
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2">
                <Edit className="h-4 w-4" />
                Edit project
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Copy className="h-4 w-4" />
                Duplicate project
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Share className="h-4 w-4" />
                Share project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <Archive className="h-4 w-4" />
                Archive project
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4" />
                Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

// Main AppLayout Component
const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  breadcrumbs, 
  projectName,
  className 
}) => {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header breadcrumbs={breadcrumbs} projectName={projectName} />

        {/* Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="mx-auto max-w-5xl px-6 py-8">
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>

      {/* Mobile overlay - for future mobile nav implementation */}
      <div className="lg:hidden">
        {/* This would be where you'd add mobile navigation overlay */}
        {/* For now, the layout works on desktop as requested */}
      </div>
    </div>
  )
}

export default AppLayout