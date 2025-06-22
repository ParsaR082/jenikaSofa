// This script is used to migrate the database on Railway deployment
const { execSync } = require('child_process');

// Execute Prisma migrations
try {
  console.log('Running database migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('Database migrations completed successfully');
} catch (error) {
  console.error('Error running database migrations:', error);
  process.exit(1);
} 