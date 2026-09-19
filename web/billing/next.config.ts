import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  async rewrites() {
    return [
      {
        source: '/api/billing/:path*',
        destination: 'http://127.0.0.1:3008/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
