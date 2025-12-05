import prisma from '../src/shared/prisma';

async function main() {
  try {
    console.log('Connecting to database...');
    const userCount = await prisma.user.count();
    console.log(`Successfully connected! Found ${userCount} users.`);
    
    // Create a test user if none exist
    if (userCount === 0) {
      console.log('Creating test user...');
      const user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'manager',
        },
      });
      console.log('Created user:', user.id);
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
