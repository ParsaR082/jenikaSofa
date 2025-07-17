const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    console.log('Checking admin user...');
    
    const admin = await prisma.user.findUnique({
      where: { username: 'admin' },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        hashedPassword: true,
        createdAt: true
      }
    });

    if (!admin) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('- ID:', admin.id);
    console.log('- Username:', admin.username);
    console.log('- Name:', admin.name);
    console.log('- Role:', admin.role);
    console.log('- Created:', admin.createdAt);
    console.log('- Has password hash:', !!admin.hashedPassword);

    // Test password
    if (admin.hashedPassword) {
      const passwordMatch = await bcrypt.compare('admin123', admin.hashedPassword);
      console.log('- Password "admin123" matches:', passwordMatch ? '✅ YES' : '❌ NO');
    }

    console.log('\nAll users in database:');
    const allUsers = await prisma.user.findMany({
      select: {
        username: true,
        name: true,
        role: true
      }
    });
    console.table(allUsers);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin(); 