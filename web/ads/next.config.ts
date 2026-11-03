import { backendOrigin } from '../../shared/ui/backend-origin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@crimfig/api-client'],
  async rewrites() {
    const backendUrl = backendOrigin('ads',process.env);

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
