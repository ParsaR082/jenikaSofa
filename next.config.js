/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  './src/i18n/request.ts'
);

const nextConfig = {
  images: {
    domains: ['utfs.io', 'res.cloudinary.com'],
  }
};

module.exports = withNextIntl(nextConfig); 