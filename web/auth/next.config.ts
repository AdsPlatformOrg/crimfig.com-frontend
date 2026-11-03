import { backendOrigin } from '../../shared/ui/backend-origin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  async headers() {
    return [{
      source: '/session-coordinator',
      headers: [{key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://ads.crimfig.com https://billing.crimfig.com https://staging-ads.crimfig.com https://staging-billing.crimfig.com http://localhost:3005 http://localhost:3006 http://localhost:3007 http://localhost:3105 http://localhost:3106 http://localhost:3107 http://127.0.0.1:3005 http://127.0.0.1:3006 http://127.0.0.1:3007 http://127.0.0.1:3105 http://127.0.0.1:3106 http://127.0.0.1:3107"}],
    }];
  },
  async rewrites() {
    // In production, proxy /api requests to the backend Auth API service
    // while keeping the client-facing URL on the clean subdomain (https://auth.crimfig.com/api/...)
    const backendUrl = backendOrigin('auth',process.env);

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
