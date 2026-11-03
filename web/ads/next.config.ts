import { backendOrigin } from '../../shared/ui/backend-origin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@crimfig/api-client'],
  async rewrites() {
    const backendUrl = backendOrigin('ads',process.env);
    const authUrl = backendOrigin('auth',process.env);
    const legacyInventoryRoutes = process.env.ADS_LEGACY_INVENTORY_ROUTES === 'true' ? [
      ['/api/v1/publisher/:path*', '/api/v1/adstation/:path*'],
      ['/api/v1/admin/ads/websites/:path*', '/api/v1/adstation/admin/websites/:path*'],
      ['/api/v1/admin/ads/auction-decisions/:path*', '/api/v1/adstation/admin/auction-decisions/:path*'],
      ['/api/v1/admin/ads/slots/:id/check-installation', '/api/v1/adstation/admin/slots/:id/check-installation'],
      ['/api/v1/admin/ads/slots/:id/lifecycle', '/api/v1/adstation/admin/slots/:id/lifecycle'],
    ].map(([source, path]) => ({ source, destination: `${backendUrl}${path}` })) : [];

    return [
      {
        source: '/api/v1/auth/:path*',
        destination: `${authUrl}/api/v1/auth/:path*`,
      },
      ...legacyInventoryRoutes,
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
