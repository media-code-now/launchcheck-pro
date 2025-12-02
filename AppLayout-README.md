# AppLayout Component Documentation

A comprehensive dashboard layout component built with shadcn/ui components for LaunchCheck applications.

## Features

✅ **Responsive Design**: Desktop-optimized with fixed sidebar  
✅ **shadcn/ui Components**: Uses only shadcn/ui components for consistency  
✅ **Customizable Breadcrumbs**: Dynamic breadcrumb navigation  
✅ **Action Buttons**: Export report and project actions dropdown  
✅ **Scrollable Content**: ScrollArea with max-width constraints  
✅ **Flexible Layout**: Accepts any children content  

## Component Structure

```tsx
<AppLayout breadcrumbs={...} projectName="...">
  {/* Your content goes here */}
</AppLayout>
```

## Props Interface

```tsx
interface AppLayoutProps {
  children: React.ReactNode        // Content to display
  breadcrumbs?: BreadcrumbItem[]  // Custom breadcrumb items
  projectName?: string            // Current project name
  className?: string              // Additional CSS classes
}

interface BreadcrumbItem {
  label: string                   // Display text
  href?: string                   // Optional link URL
}
```

## Usage Examples

### Basic Usage

```tsx
import AppLayout from "@/components/AppLayout"

export default function Dashboard() {
  return (
    <AppLayout projectName="My Project">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {/* Your dashboard content */}
      </div>
    </AppLayout>
  )
}
```

### Custom Breadcrumbs

```tsx
const customBreadcrumbs = [
  { label: "Projects", href: "/projects" },
  { label: "Team Alpha", href: "/projects/team-alpha" },
  { label: "Sprint 1" }
]

return (
  <AppLayout breadcrumbs={customBreadcrumbs}>
    {/* Content */}
  </AppLayout>
)
```

### No Project Context

```tsx
// For pages like Settings or Templates
return (
  <AppLayout breadcrumbs={[{ label: "Settings" }]}>
    {/* Settings content */}
  </AppLayout>
)
```

## Layout Anatomy

### 1. Left Sidebar (Desktop)
- **App Logo**: "LaunchCheck" with LC icon
- **New Project Button**: Primary action button
- **Navigation Menu**:
  - Projects (with FolderOpen icon)
  - Templates (with FileText icon)
  - Settings (with Settings icon)

### 2. Header Bar
- **Left Side**: Dynamic breadcrumb navigation
- **Right Side**: 
  - "Export report" button with download icon
  - "Project actions" dropdown with:
    - Edit project
    - Duplicate project
    - Share project
    - Archive project
    - Delete project (destructive style)

### 3. Main Content Area
- **ScrollArea**: Handles overflow with custom scrollbars
- **Max Width**: Centered with `max-w-5xl`
- **Padding**: Consistent spacing with `px-6 py-8`

## Styling & Theming

The component uses shadcn/ui design tokens:

```css
/* Key design elements */
- Sidebar: `w-64` fixed width
- Header: `h-16` fixed height  
- Background: Uses `bg-background` theme color
- Borders: Uses `border-border` theme color
- Text: Uses semantic color classes
```

## Navigation Items Configuration

The sidebar navigation is configured in the component:

```tsx
const navigationItems: NavItem[] = [
  {
    label: "Projects",
    href: "/projects",
    icon: FolderOpen,
    active: true  // Highlights current page
  },
  // ... more items
]
```

## Responsive Behavior

- **Desktop (lg+)**: Full sidebar layout with fixed positioning
- **Mobile**: Sidebar is hidden (ready for mobile overlay implementation)

## Accessibility Features

✅ Proper ARIA labels and navigation structure  
✅ Keyboard navigation support via shadcn/ui components  
✅ Focus management for dropdowns and buttons  
✅ Semantic HTML structure with nav, main, header elements  

## Component Dependencies

Required shadcn/ui components:
- `Button`
- `ScrollArea` 
- `DropdownMenu`
- `Breadcrumb`
- `cn` utility function

Required icons from lucide-react:
- `ChevronDown`, `FileText`, `FolderOpen`, `Settings`
- `Plus`, `Download`, `Edit`, `Copy`, `Archive`, `Trash2`, `Share`

## Advanced Customization

### Adding New Navigation Items

```tsx
// Add to navigationItems array in AppLayout.tsx
{
  label: "Analytics",
  href: "/analytics", 
  icon: BarChart,
  active: false
}
```

### Custom Header Actions

```tsx
// Extend the Header component to accept custom actions
interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[]
  projectName?: string
  customActions?: React.ReactNode  // Add custom buttons
}
```

### Mobile Navigation

To implement mobile navigation:

1. Add mobile menu button in header
2. Create overlay/drawer for mobile sidebar
3. Add responsive classes for mobile behavior

## Performance Notes

- Fixed sidebar uses `position: fixed` for optimal scroll performance
- ScrollArea component handles large content efficiently
- Component tree is optimized for minimal re-renders

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Tailwind CSS responsive breakpoints
- shadcn/ui component compatibility