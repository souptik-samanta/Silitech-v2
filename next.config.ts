/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. It’s recommended to fix errors eventually.
    ignoreDuringBuilds: true,
  },
  // You can include any other Next.js configuration here
};

module.exports = nextConfig;

