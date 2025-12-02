// This file helps Netlify understand how to handle Next.js API routes

const { withNewtifyNextjs } = require('@netlify/plugin-nextjs')

module.exports = withNewtifyNextjs({
  // Next.js config
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('_http_common')
    }
    return config
  }
})