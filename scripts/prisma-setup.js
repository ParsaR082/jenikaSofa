// This script helps with Prisma setup on Railway
const { execSync } = require('child_process');
const fs = require('fs');

console.log('Setting up Prisma with the correct OpenSSL version...');

// Check if we're on Railway
const isRailway = process.env.RAILWAY_ENVIRONMENT === 'production';

if (isRailway) {
  console.log('Running in Railway environment, setting up OpenSSL...');
  
  try {
    // Set environment variables to help Prisma find OpenSSL
    process.env.PRISMA_SKIP_LIBSSL_COPY = "1";
    
    // Create symlinks for OpenSSL if they don't exist
    try {
      if (!fs.existsSync('/lib/libssl.so.1.1')) {
        console.log('Creating symlink for libssl.so.1.1...');
        execSync('mkdir -p /lib && ln -sf /usr/lib/libssl.so /lib/libssl.so.1.1', { stdio: 'inherit' });
      }
      
      if (!fs.existsSync('/lib/libcrypto.so.1.1')) {
        console.log('Creating symlink for libcrypto.so.1.1...');
        execSync('mkdir -p /lib && ln -sf /usr/lib/libcrypto.so /lib/libcrypto.so.1.1', { stdio: 'inherit' });
      }
    } catch (symlinkError) {
      console.warn('Warning: Could not create OpenSSL symlinks. This might be due to permissions:', symlinkError);
      // Continue anyway as the Dockerfile should have created these
    }
    
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