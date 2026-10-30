'use client';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { AdminGuard } from './AdminGuard';
import { SessionGate } from './SessionGate';
import { AdsConsoleShell } from './console/AdsConsoleShell';
const routes: Record<string, ['advertiser' | 'promoter' | 'admin', string]> = {
  "/advertiser": [
    "advertiser",
    "overview_dash"
  ],
  "/billing": [
    "advertiser",
    "billing_escrow"
  ],
  "/campaigns": [
    "advertiser",
    "campaigns"
  ],
  "/conversions": [
    "advertiser",
    "conversions"
  ],
  "/dashboard": [
    "advertiser",
    "overview"
  ],
  "/disputes": [
    "advertiser",
    "disputes"
  ],
  "/marketplace": [
    "promoter",
    "marketplace"
  ],
  "/notifications": [
    "advertiser",
    "notifications"
  ],
  "/profile": [
    "advertiser",
    "profile"
  ],
  "/promoter": [
    "promoter",
    "websites"
  ],
  "/quality": [
    "promoter",
    "quality"
  ],
  "/settings": [
    "advertiser",
    "settings"
  ],
  "/support": [
    "advertiser",
    "support"
  ],
  "/promoter/adstation": [
    "promoter",
    "adstation"
  ],
  "/promoter/individuals": [
    "promoter",
    "individuals"
  ],
  "/promoter/marketplace": [
    "promoter",
    "marketplace"
  ],
  "/promoter/mobile-apps": [
    "promoter",
    "mobile_apps"
  ],
  "/promoter/quality": [
    "promoter",
    "quality"
  ],
  "/promoter/websites": [
    "promoter",
    "websites"
  ],
  "/campaigns/new": [
    "advertiser",
    "new_campaign"
  ],
  "/admin/disputes": [
    "admin",
    "admin_disputes"
  ],
  "/admin/moderation": [
    "admin",
    "moderation"
  ],
  "/admin/tests": [
    "admin",
    "admin_tests"
  ]
};
export function ProtectedWorkspace({ children }: { children: ReactNode }) {
 const path = usePathname();
 const [role, activeNavId] = routes[path] ?? (path.startsWith('/campaigns/') ? ['advertiser', 'campaigns'] : ['advertiser', 'overview_dash']);
 const workspace = <AdsConsoleShell role={role} activeNavId={activeNavId}>{children}</AdsConsoleShell>;
 return <SessionGate>{role === 'admin' ? <AdminGuard key={path}>{workspace}</AdminGuard> : workspace}</SessionGate>;
}
