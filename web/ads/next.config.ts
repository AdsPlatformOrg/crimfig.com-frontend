import { backendOrigin } from '../../shared/ui/backend-origin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@crimfig/api-client'],
  async rewrites() {
    const backendUrl = backendOrigin('ads',process.env);
    const authUrl = backendOrigin('auth',process.env);

    return [
      {
        source: '/api/v1/auth/:path*',
        destination: `${authUrl}/api/v1/auth/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
