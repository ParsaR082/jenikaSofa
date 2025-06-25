// This script helps with Prisma setup on Railway
const { execSync } = require('child_process');

console.log('Setting up Prisma with the correct OpenSSL version...');

// Check if we're on Railway
const isRailway = process.env.RAILWAY_ENVIRONMENT === 'production';

if (isRailway) {
  console.log('Running in Railway environment, setting up Prisma...');
  
  try {
    // Set environment variables to help Prisma
    process.env.PRISMA_SKIP_LIBSSL_COPY = "1";
    process.env.PRISMA_ENGINE_PROTOCOL = "binary";
    
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        PRISMA_SKIP_LIBSSL_COPY: "1",
        PRISMA_ENGINE_PROTOCOL: "binary"
      }
    });
    
    console.log('Prisma setup completed successfully');
  } catch (error) {
    console.error('Error setting up Prisma:', error);
    // Don't exit on error in production - let Next.js try to start anyway
    console.log('Continuing with application startup...');
  }
} else {
  console.log('Not running in Railway environment, skipping special setup');
  try {
    // For local development, use standard generation
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        PRISMA_SKIP_LIBSSL_COPY: "1"
      }
    });
  } catch (error) {
    console.error('Error generating Prisma client:', error);
    console.log('Continuing anyway - Prisma client may have been generated during build...');
  }
} 