# 📋 LaunchCheck Pro - Project Checklist Management

A comprehensive Next.js application for managing project checklists and templates. Built with modern web technologies including Next.js 14, TypeScript, Prisma, and shadcn/ui components.

## ✨ Features

- 🗂️ **Project Management**: Create, view, update, and delete projects
- 📝 **Checklist Templates**: Reusable checklist templates for different project types  
- ✅ **Interactive Checklists**: Track progress with pre-launch and post-launch checklists
- 🎨 **Modern UI**: Beautiful interface with dark/light theme support
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🔍 **Search & Filter**: Easily find projects and templates
- 📊 **Progress Tracking**: Visual progress indicators and completion status

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or later
- npm or yarn package manager

### Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd checklist-website
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

4. **Initialize the database:**

   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

6. **Open your browser:**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Prisma ORM with SQLite (dev) / Neon PostgreSQL (production)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Theme**: next-themes for dark/light mode
- **Icons**: Lucide React

## 📦 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── projects/          # Project management pages
│   ├── templates/         # Template management pages
│   └── settings/          # Application settings
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utility functions
├── prisma/               # Database schema and migrations
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

## 🗄️ Database Schema

The application uses Prisma with the following main entities:

- **Project**: Main project entity with client info and launch dates
- **ChecklistTemplate**: Reusable checklist templates
- **ChecklistInstance**: Project-specific checklist instances
- **ChecklistItem**: Individual checklist items with completion status

## 🚀 Deployment

### Environment Variables

For production, set these environment variables:

```bash
# Database (use PostgreSQL for production)
DATABASE_URL="postgresql://username:password@hostname:port/database"

# App URL
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Deploy to Vercel

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel:**

   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push to main branch

3. **Database Setup (Recommended: Neon):**

   - Create account at [neon.tech](https://neon.tech)
   - Create new project and copy connection string
   - Add `DATABASE_URL` to Vercel environment variables
   - Prisma automatically runs: `db push` and `db seed`
   
   Alternative options: Vercel Postgres, Supabase, PlanetScale

### Deploy to Other Platforms

The app can be deployed to any Node.js hosting platform:

- **Netlify**: Use `npm run build` and deploy the `.next` folder
- **Railway**: Connect GitHub repo and set environment variables
- **DigitalOcean**: Use App Platform or deploy to a Droplet

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Database Commands

```bash
npx prisma generate    # Generate Prisma client
npx prisma db push     # Push schema changes (development)
npx prisma db seed     # Seed database with sample data
npx prisma studio      # Open Prisma Studio (database GUI)
npx prisma migrate deploy  # Run migrations (production)
```

### Adding New Components

```bash
npx shadcn-ui@latest add <component-name>
```

## 📝 API Routes

- `GET /api/projects` - List all projects
- `POST /api/projects/create` - Create new project
- `GET /api/projects/[id]` - Get project by ID
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `GET /api/templates` - List all templates
- `POST /api/templates/create` - Create new template

## 🎨 Customization

### Theme Configuration

The app supports light/dark themes using `next-themes`. Theme settings are in:

- `app/providers.tsx` - Theme provider setup
- `tailwind.config.js` - Theme colors and variants

### UI Components

All UI components are from shadcn/ui and can be customized in:

- `components/ui/` - Individual component files
- `lib/utils.ts` - Utility functions for styling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔧 Troubleshooting

### Common Issues

1. **Database connection errors**: Check your `DATABASE_URL` in `.env`
2. **Missing dependencies**: Run `npm install` 
3. **Build errors**: Ensure all TypeScript errors are resolved
4. **Prisma issues**: Run `npx prisma generate` after schema changes

### Getting Help

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Prisma documentation](https://www.prisma.io/docs)
- Browse [shadcn/ui components](https://ui.shadcn.com)

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.