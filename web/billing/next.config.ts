import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  async rewrites() {
    const backendUrl =
      process.env.BILLING_API_BACKEND_URL ||
      process.env.NEXT_PUBLIC_BILLING_API_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://billing-api-production-bb4c.up.railway.app'
        : 'http://127.0.0.1:3008');

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
