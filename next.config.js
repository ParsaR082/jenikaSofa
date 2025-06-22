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
};

module.exports = withNextIntl(nextConfig); 