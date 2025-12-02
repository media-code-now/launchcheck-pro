# Netlify Deployment Guide for LaunchCheck Pro

## 🚀 Netlify Deployment Setup

### 1. Environment Variables (CRITICAL)

Add these environment variables in your Netlify dashboard (`Site settings > Environment variables`):

```bash
DATABASE_URL=postgresql://neondb_owner:npg_kthy93AiWXgG@ep-aged-salad-af3z38pv-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXT_PUBLIC_APP_URL=https://launchcheck-pro.netlify.app
```

### 2. Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Functions directory**: `netlify/functions`

### 3. Required Netlify Plugins

Install the Next.js plugin for Netlify:

```bash
npm install @netlify/plugin-nextjs
```

### 4. Common Issues & Solutions

#### Issue: "500 Internal Server Error" on API routes
**Cause**: Missing DATABASE_URL environment variable
**Solution**: Add DATABASE_URL to Netlify environment variables

#### Issue: Prisma client not working
**Cause**: Prisma needs to be generated during build
**Solution**: Ensure `postinstall` script runs `prisma generate`

#### Issue: Database connection timeout  
**Cause**: Cold start delays in serverless environment
**Solution**: Use connection pooling (already configured with Neon)

### 5. Deployment Checklist

- [ ] Environment variables added to Netlify
- [ ] DATABASE_URL points to Neon database
- [ ] Build completes successfully
- [ ] API routes return 200 (not 500)
- [ ] Database seeded with templates

### 6. Testing After Deployment

Visit these URLs to verify deployment:
- `https://launchcheck-pro.netlify.app/` - Main app
- `https://launchcheck-pro.netlify.app/api/projects` - Should return JSON
- `https://launchcheck-pro.netlify.app/projects` - Projects page

### 7. Debug Mode

If still getting 500 errors, enable debug logging:
- Check Netlify Function logs in dashboard
- Use the `/api/projects/create-debug` endpoint for detailed logging