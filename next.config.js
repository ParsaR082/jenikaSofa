/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  './src/i18n/request.ts'
);

const nextConfig = {
  images: {
    domains: ['utfs.io', 'res.cloudinary.com'],
  },
  env: {
    _next_intl_trailing_slash: ''
  }
};

module.exports = withNextIntl(nextConfig); 