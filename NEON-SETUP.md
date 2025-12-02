# Setting Up Neon Database for LaunchCheck Pro

## 🚀 Quick Neon Setup Guide

### Step 1: Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up with your GitHub account (recommended)
3. Create a new project called "launchcheck-pro"

### Step 2: Get Database Connection String
After creating your project, you'll get a connection string that looks like:
```
postgresql://username:password@hostname.neon.tech/database?sslmode=require
```

### Step 3: Configure Environment Variables

#### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add these variables for all environments (Development, Preview, Production):

```
DATABASE_URL=postgresql://username:password@hostname.neon.tech/database?sslmode=require
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

#### For Local Development:
Create a `.env` file in your project root:

```bash
# Neon Database
DATABASE_URL="postgresql://username:password@hostname.neon.tech/database?sslmode=require"

# Local Development
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 4: Update Prisma for Production
The current schema should work perfectly with Neon PostgreSQL, but let's make sure it's optimized.

### Step 5: Deploy Database Schema
Once you've set the DATABASE_URL in Vercel:

1. **Trigger a new deployment** (push any small change)
2. **Prisma will automatically run**:
   - `prisma generate` - Generate the client
   - `prisma db push` - Create tables in Neon
   - `prisma db seed` - Add sample data

### Step 6: Verify Setup
- Check Vercel deployment logs for successful database connection
- Visit your app and test creating/viewing projects
- Use Neon's dashboard to view your database tables

## 🎯 Why Neon is Perfect for This Project:

- ✅ **Serverless**: Pay only for what you use
- ✅ **PostgreSQL**: Full compatibility with Prisma
- ✅ **Generous Free Tier**: 3GB storage, 100 hours compute time
- ✅ **Instant Scaling**: Automatically scales with your app
- ✅ **Branch Database**: Create database branches like Git
- ✅ **Built-in Connection Pooling**: Better performance
- ✅ **Easy Backup & Recovery**: Point-in-time recovery

## 🔧 Troubleshooting:

If you encounter SSL issues, make sure your DATABASE_URL includes `?sslmode=require` at the end.

For connection pooling (recommended for production), use the pooled connection string that Neon provides.