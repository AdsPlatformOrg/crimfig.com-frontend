import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  async rewrites() {
    const backendUrl =
      process.env.ADS_API_BACKEND_URL ||
      process.env.NEXT_PUBLIC_ADS_API_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://ads-api-production-d889.up.railway.app'
        : 'http://127.0.0.1:4001');

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
