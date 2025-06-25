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
    process.env.PRISMA_ENGINE_PROTOCOL = "binary";
    
    // Force using a specific OpenSSL version
    process.env.PRISMA_CLI_QUERY_ENGINE_TYPE = "binary";
    process.env.PRISMA_CLIENT_ENGINE_TYPE = "binary";
    
    // Create symlinks for OpenSSL if they don't exist
    try {
      // Check all possible OpenSSL paths
      const possibleLibSSLPaths = [
        '/usr/lib/libssl.so',
        '/usr/lib/libssl.so.1.1',
        '/usr/lib/libssl.so.3',
        '/lib/libssl.so'
      ];
      
      const possibleLibCryptoPaths = [
        '/usr/lib/libcrypto.so',
        '/usr/lib/libcrypto.so.1.1',
        '/usr/lib/libcrypto.so.3',
        '/lib/libcrypto.so'
      ];
      
      // Find available OpenSSL libraries
      let libSSLPath = null;
      for (const path of possibleLibSSLPaths) {
        if (fs.existsSync(path)) {
          libSSLPath = path;
          break;
        }
      }
      
      let libCryptoPath = null;
      for (const path of possibleLibCryptoPaths) {
        if (fs.existsSync(path)) {
          libCryptoPath = path;
          break;
        }
      }
      
      // Create symlinks if libraries were found
      if (libSSLPath && !fs.existsSync('/lib/libssl.so.1.1')) {
        console.log(`Creating symlink for libssl.so.1.1 from ${libSSLPath}...`);
        execSync(`mkdir -p /lib && ln -sf ${libSSLPath} /lib/libssl.so.1.1`, { stdio: 'inherit' });
      }
      
      if (libCryptoPath && !fs.existsSync('/lib/libcrypto.so.1.1')) {
        console.log(`Creating symlink for libcrypto.so.1.1 from ${libCryptoPath}...`);
        execSync(`mkdir -p /lib && ln -sf ${libCryptoPath} /lib/libcrypto.so.1.1`, { stdio: 'inherit' });
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
    // For local development, use standard generation but with environment variables
    // to help with OpenSSL detection
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        PRISMA_SKIP_LIBSSL_COPY: "1"
      }
    });
  } catch (error) {
    console.error('Error generating Prisma client:', error);
    process.exit(1);
  }
} 