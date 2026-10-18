import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  async rewrites() {
    // In production, proxy /api requests to the backend Auth API service
    // while keeping the client-facing URL on the clean subdomain (https://auth.crimfig.com/api/...)
    const backendUrl = (
      process.env.AUTH_API_BACKEND_URL ||
      process.env.AUTH_API_URL ||
      process.env.NEXT_PUBLIC_AUTH_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://auth-api-production-8e03.up.railway.app'
        : 'http://127.0.0.1:4000')
    ).replace(/\/+$/, '');

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
