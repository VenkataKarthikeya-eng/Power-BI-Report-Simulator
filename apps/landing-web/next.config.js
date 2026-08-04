/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@dcaps/ui', '@dcaps/types', '@dcaps/config', '@dcaps/utils'],
};

module.exports = nextConfig;
