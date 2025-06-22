// This script helps with Prisma setup on Railway
const { execSync } = require('child_process');
const fs = require('fs');

console.log('Setting up Prisma with the correct OpenSSL version...');

// Check if we're on Railway
const isRailway = process.env.RAILWAY_ENVIRONMENT === 'production';

if (isRailway) {
  console.log('Running in Railway environment, setting up OpenSSL...');
  
  try {
    // Install OpenSSL 1.1 if not already installed
    console.log('Ensuring OpenSSL 1.1 is installed...');
    
    // Generate Prisma client with the correct binary target
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        PRISMA_SCHEMA_ENGINE_BINARY: "libquery_engine-linux-musl.so.node",
        PRISMA_QUERY_ENGINE_BINARY: "libquery_engine-linux-musl.so.node",
        PRISMA_QUERY_ENGINE_LIBRARY: "libquery_engine-linux-musl.so.node"
      }
    });
    
    console.log('Prisma setup completed successfully');
  } catch (error) {
    console.error('Error setting up Prisma:', error);
    process.exit(1);
  }
} else {
  console.log('Not running in Railway environment, skipping special setup');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error generating Prisma client:', error);
    process.exit(1);
  }
} 