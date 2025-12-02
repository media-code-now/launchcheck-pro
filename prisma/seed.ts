import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create PRE Launch Template
  console.log('📋 Creating Pre Launch template...')
  const preTemplate = await prisma.checklistTemplate.create({
    data: {
      type: 'PRE',
      name: 'Default Pre Launch',
      description: 'Essential tasks to complete before your website goes live',
      items: {
        create: [
          // Technical Category
          {
            category: 'Technical',
            title: 'SSL Certificate Setup',
            description: 'Configure HTTPS encryption and ensure all pages redirect properly',
            priority: "HIGH",
            order: 1,
          },
          {
            category: 'Technical',
            title: 'Domain Configuration',
            description: 'Set up DNS records and ensure domain points to production server',
            priority: "HIGH",
            order: 2,
          },
          {
            category: 'Technical',
            title: 'Database Backup Strategy',
            description: 'Implement automated database backups and test restoration process',
            priority: "HIGH",
            order: 3,
          },
          {
            category: 'Technical',
            title: 'Error Pages Setup',
            description: 'Create custom 404, 500 error pages and test error handling',
            priority: "MEDIUM",
            order: 4,
          },
          {
            category: 'Technical',
            title: 'Form Validation Testing',
            description: 'Test all contact forms, newsletters, and user input validation',
            priority: "MEDIUM",
            order: 5,
          },

          // SEO Category
          {
            category: 'SEO',
            title: 'Meta Tags Optimization',
            description: 'Add title tags, meta descriptions, and Open Graph tags to all pages',
            priority: "HIGH",
            order: 6,
          },
          {
            category: 'SEO',
            title: 'XML Sitemap Generation',
            description: 'Generate and submit XML sitemap to search engines',
            priority: "HIGH",
            order: 7,
          },
          {
            category: 'SEO',
            title: 'Robots.txt Configuration',
            description: 'Configure robots.txt file and ensure proper crawl directives',
            priority: "MEDIUM",
            order: 8,
          },
          {
            category: 'SEO',
            title: 'Internal Linking Structure',
            description: 'Optimize internal linking and ensure proper anchor text usage',
            priority: "MEDIUM",
            order: 9,
          },
          {
            category: 'SEO',
            title: 'Schema Markup Implementation',
            description: 'Add structured data markup for better search engine understanding',
            priority: "LOW",
            order: 10,
          },

          // Content Category
          {
            category: 'Content',
            title: 'Content Proofreading',
            description: 'Review all website copy for grammar, spelling, and consistency',
            priority: "HIGH",
            order: 11,
          },
          {
            category: 'Content',
            title: 'Image Optimization',
            description: 'Compress images, add alt text, and ensure proper sizing',
            priority: "HIGH",
            order: 12,
          },
          {
            category: 'Content',
            title: 'Legal Pages Creation',
            description: 'Add Privacy Policy, Terms of Service, and Cookie Policy',
            priority: "HIGH",
            order: 13,
          },
          {
            category: 'Content',
            title: 'Contact Information Verification',
            description: 'Verify all contact details, addresses, and phone numbers are correct',
            priority: "MEDIUM",
            order: 14,
          },
          {
            category: 'Content',
            title: 'Call-to-Action Optimization',
            description: 'Review and optimize all CTAs for clarity and effectiveness',
            priority: "MEDIUM",
            order: 15,
          },

          // Analytics Category
          {
            category: 'Analytics',
            title: 'Google Analytics Setup',
            description: 'Install GA4 tracking code and configure basic goals and events',
            priority: "HIGH",
            order: 16,
          },
          {
            category: 'Analytics',
            title: 'Google Search Console Setup',
            description: 'Verify website ownership and submit sitemap to Search Console',
            priority: "HIGH",
            order: 17,
          },
          {
            category: 'Analytics',
            title: 'Conversion Tracking Setup',
            description: 'Set up goal tracking for key conversion events (forms, purchases, etc.)',
            priority: "HIGH",
            order: 18,
          },
          {
            category: 'Analytics',
            title: 'Heat Mapping Tool Installation',
            description: 'Install tools like Hotjar or Crazy Egg for user behavior analysis',
            priority: "LOW",
            order: 19,
          },

          // Performance Category
          {
            category: 'Performance',
            title: 'Page Speed Optimization',
            description: 'Optimize loading times and achieve good Core Web Vitals scores',
            priority: "HIGH",
            order: 20,
          },
          {
            category: 'Performance',
            title: 'CDN Configuration',
            description: 'Set up Content Delivery Network for global performance optimization',
            priority: "MEDIUM",
            order: 21,
          },
          {
            category: 'Performance',
            title: 'Caching Strategy Implementation',
            description: 'Configure browser caching and server-side caching mechanisms',
            priority: "MEDIUM",
            order: 22,
          },
          {
            category: 'Performance',
            title: 'Mobile Performance Testing',
            description: 'Test website performance on various mobile devices and connections',
            priority: "HIGH",
            order: 23,
          },

          // UX Category
          {
            category: 'UX',
            title: 'Cross-Browser Testing',
            description: 'Test website functionality across different browsers and versions',
            priority: "HIGH",
            order: 24,
          },
          {
            category: 'UX',
            title: 'Mobile Responsiveness Check',
            description: 'Verify proper display and functionality on all device sizes',
            priority: "HIGH",
            order: 25,
          },
          {
            category: 'UX',
            title: 'Accessibility Audit',
            description: 'Ensure WCAG compliance and test with screen readers',
            priority: "HIGH",
            order: 26,
          },
          {
            category: 'UX',
            title: 'Navigation Testing',
            description: 'Test all menu items, links, and user flow paths',
            priority: "MEDIUM",
            order: 27,
          },
          {
            category: 'UX',
            title: 'User Acceptance Testing',
            description: 'Conduct final testing with real users or stakeholders',
            priority: "MEDIUM",
            order: 28,
          },
        ],
      },
    },
  })

  // Create POST Launch Template
  console.log('🚀 Creating Post Launch template...')
  const postTemplate = await prisma.checklistTemplate.create({
    data: {
      type: "POST",
      name: 'Default Post Launch',
      description: 'Essential tasks to complete after your website goes live',
      items: {
        create: [
          // Indexing Category
          {
            category: 'Indexing',
            title: 'Search Engine Indexing Check',
            description: 'Verify that search engines are properly indexing your pages',
            priority: "HIGH",
            order: 1,
          },
          {
            category: 'Indexing',
            title: 'Sitemap Submission Verification',
            description: 'Confirm XML sitemap has been successfully submitted and processed',
            priority: "HIGH",
            order: 2,
          },
          {
            category: 'Indexing',
            title: 'Search Console Coverage Report',
            description: 'Review Google Search Console coverage report for any issues',
            priority: "MEDIUM",
            order: 3,
          },
          {
            category: 'Indexing',
            title: 'Bing Webmaster Tools Setup',
            description: 'Submit website to Bing Webmaster Tools and verify indexing',
            priority: "LOW",
            order: 4,
          },

          // Real User Checks Category
          {
            category: 'Real user checks',
            title: 'Contact Form Testing',
            description: 'Test all contact forms with real submissions and verify delivery',
            priority: "HIGH",
            order: 5,
          },
          {
            category: 'Real user checks',
            title: 'Newsletter Signup Verification',
            description: 'Test newsletter signup process and email delivery',
            priority: "HIGH",
            order: 6,
          },
          {
            category: 'Real user checks',
            title: 'E-commerce Transaction Testing',
            description: 'Process test orders and verify payment processing (if applicable)',
            priority: "HIGH",
            order: 7,
          },
          {
            category: 'Real user checks',
            title: 'User Registration Testing',
            description: 'Test user account creation and login processes',
            priority: "MEDIUM",
            order: 8,
          },
          {
            category: 'Real user checks',
            title: 'Social Media Integration Check',
            description: 'Verify social media sharing and integration functionality',
            priority: "MEDIUM",
            order: 9,
          },

          // Analytics Validation Category
          {
            category: 'Analytics validation',
            title: 'Google Analytics Data Verification',
            description: 'Confirm GA4 is tracking visitors and events correctly',
            priority: "HIGH",
            order: 10,
          },
          {
            category: 'Analytics validation',
            title: 'Conversion Goal Tracking Check',
            description: 'Verify that conversion goals are firing properly',
            priority: "HIGH",
            order: 11,
          },
          {
            category: 'Analytics validation',
            title: 'E-commerce Tracking Validation',
            description: 'Confirm e-commerce events and revenue tracking (if applicable)',
            priority: "HIGH",
            order: 12,
          },
          {
            category: 'Analytics validation',
            title: 'Traffic Source Attribution',
            description: 'Verify proper tracking of traffic sources and campaigns',
            priority: "MEDIUM",
            order: 13,
          },
          {
            category: 'Analytics validation',
            title: 'Custom Event Tracking Check',
            description: 'Test any custom events and ensure proper data collection',
            priority: "MEDIUM",
            order: 14,
          },

          // Monitoring Category
          {
            category: 'Monitoring',
            title: 'Uptime Monitoring Setup',
            description: 'Configure uptime monitoring alerts for website availability',
            priority: "HIGH",
            order: 15,
          },
          {
            category: 'Monitoring',
            title: 'Performance Monitoring Implementation',
            description: 'Set up continuous performance monitoring and alerts',
            priority: "HIGH",
            order: 16,
          },
          {
            category: 'Monitoring',
            title: 'Error Monitoring Configuration',
            description: 'Configure error tracking and notification systems',
            priority: "HIGH",
            order: 17,
          },
          {
            category: 'Monitoring',
            title: 'Security Monitoring Setup',
            description: 'Implement security monitoring and vulnerability scanning',
            priority: "MEDIUM",
            order: 18,
          },
          {
            category: 'Monitoring',
            title: 'Backup Verification',
            description: 'Verify automated backups are working and test restoration process',
            priority: "HIGH",
            order: 19,
          },

          // SEO Follow Up Category
          {
            category: 'SEO follow up',
            title: 'Search Ranking Baseline Establishment',
            description: 'Record initial search rankings for target keywords',
            priority: "MEDIUM",
            order: 20,
          },
          {
            category: 'SEO follow up',
            title: 'Local SEO Optimization',
            description: 'Set up Google My Business and local directory listings (if applicable)',
            priority: "MEDIUM",
            order: 21,
          },
          {
            category: 'SEO follow up',
            title: 'Link Building Strategy Implementation',
            description: 'Begin outreach for quality backlinks and partnerships',
            priority: "LOW",
            order: 22,
          },
          {
            category: 'SEO follow up',
            title: 'Content Marketing Plan Execution',
            description: 'Launch blog content calendar and content marketing initiatives',
            priority: "LOW",
            order: 23,
          },
          {
            category: 'SEO follow up',
            title: 'Search Console Performance Review',
            description: 'Monitor search performance and identify optimization opportunities',
            priority: "MEDIUM",
            order: 24,
          },
        ],
      },
    },
  })

  console.log(`✅ Created Pre Launch template with ${await prisma.checklistItemTemplate.count({ where: { templateId: preTemplate.id } })} items`)
  console.log(`✅ Created Post Launch template with ${await prisma.checklistItemTemplate.count({ where: { templateId: postTemplate.id } })} items`)

  // Display summary
  const totalTemplates = await prisma.checklistTemplate.count()
  const totalItems = await prisma.checklistItemTemplate.count()
  
  console.log('\n📊 Seed Summary:')
  console.log(`   Templates created: ${totalTemplates}`)
  console.log(`   Total checklist items: ${totalItems}`)
  console.log('\n🎉 Database seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })