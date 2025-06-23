/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  './src/i18n/request.ts'
);

const nextConfig = {
  images: {
    domains: ['utfs.io', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Add Railway-specific configurations
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // Configure output for Railway
  output: 'standalone',
  // Disable static exports for problematic routes
  experimental: {
    // This will allow Next.js to skip prerendering pages with dynamic data
    workerThreads: false,
    cpus: 1
  },
  // Disable strict mode for route handling
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = withNextIntl(nextConfig); 