/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['mysql2']
  },
  images: {
    domains: ['localhost'],
    unoptimized: false
  },
  env: {
    DB_HOST: process.env.DB_HOST || 'uhai.africa',
    DB_PORT: process.env.DB_PORT || '3306',
    DB_DATABASE: process.env.DB_DATABASE || 'uhaiafri_test_last',
    DB_USERNAME: process.env.DB_USERNAME || 'uhaiafri_pos_api',
    DB_PASSWORD: process.env.DB_PASSWORD || 'PAunr5anBYL2kHTHxe2E',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  typescript: {
    // Enable this if you want to fail builds on type errors
    ignoreBuildErrors: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if ESLint errors
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;