// This ensures Prisma works correctly in Netlify serverless environment
import { PrismaClient } from '@prisma/client'

// Configure Prisma for serverless environment
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

// Prevent hot reloading from creating new instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Export runtime configuration for Netlify
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  // Maxium execution time for Netlify Functions (10 seconds)
  maxDuration: 10,
}