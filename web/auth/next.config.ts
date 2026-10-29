import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  async headers() {
    return [{
      source: '/session-coordinator',
      headers: [{key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://ads.crimfig.com https://billing.crimfig.com https://staging-ads.crimfig.com https://staging-billing.crimfig.com http://localhost:3005 http://localhost:3006 http://localhost:3105 http://localhost:3106 http://127.0.0.1:3005 http://127.0.0.1:3006 http://127.0.0.1:3105 http://127.0.0.1:3106"}],
    }];
  },
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
