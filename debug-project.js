const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function testProjectCreation() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing project creation...');
    
    // Get or create user first
    let user = await prisma.user.findFirst();
    if (!user) {
      console.log('Creating default user...');
      user = await prisma.user.create({
        data: {
          name: 'Demo User',
          email: 'demo@launchcheck.com'
        }
      });
      console.log('User created:', user.id);
    } else {
      console.log('Using existing user:', user.id);
    }
    
    // Try to create a project
    console.log('Creating project...');
    const project = await prisma.project.create({
      data: {
        name: 'Test Project Debug',
        clientName: 'Test Client',
        domain: 'test.com',
        status: 'IN_PROGRESS',
        userId: user.id
      }
    });
    console.log('Project created successfully:', project.id);
    
    // Check templates
    const templates = await prisma.checklistTemplate.findMany({
      where: { isActive: true },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    });
    console.log('Available templates:', templates.length);
    
    await prisma.$disconnect();
    console.log('✅ Project creation test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    await prisma.$disconnect();
  }
}

testProjectCreation();