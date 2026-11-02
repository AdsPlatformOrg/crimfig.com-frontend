import type { NextConfig } from 'next';
import {billingBackends} from './src/lib/backend-origins';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  async rewrites() {
    const {billing:backendUrl,auth:authBackendUrl}=billingBackends(process.env);

    return [
      {
        source: '/api/v1/financial-authorizations/:path*',
        destination: `${authBackendUrl}/api/v1/financial-authorizations/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
