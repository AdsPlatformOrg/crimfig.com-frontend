'use client';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { AdminGuard } from './AdminGuard';
import { SessionGate } from './SessionGate';
import { AdsConsoleShell } from './console/AdsConsoleShell';

export type WorkspaceRole = 'advertiser' | 'promoter' | 'admin';

const exactRoutes: Record<string, [WorkspaceRole, string]> = {
  '/advertiser': ['advertiser', 'overview_dash'],
  '/dashboard': ['advertiser', 'overview_dash'],
  '/campaigns': ['advertiser', 'campaigns'],
  '/campaigns/new': ['advertiser', 'new_campaign'],
  '/conversions': ['advertiser', 'conversions'],
  '/disputes': ['advertiser', 'disputes'],
  '/promoter': ['promoter', 'websites'],
  '/promoter/websites': ['promoter', 'websites'],
  '/promoter/slots': ['promoter', 'slots'],
  '/promoter/adstation': ['promoter', 'adstation'],
  '/promoter/individuals': ['promoter', 'individuals'],
  '/promoter/mobile-apps': ['promoter', 'mobile_apps'],
  '/promoter/marketplace': ['promoter', 'marketplace'],
  '/promoter/quality': ['promoter', 'quality'],
  '/admin/moderation': ['admin', 'moderation'],
  '/admin/house-ads': ['admin', 'house_ads'],
  '/admin/disputes': ['admin', 'admin_disputes'],
  '/admin/tests': ['admin', 'admin_tests'],
  '/billing': ['advertiser', 'billing_escrow'],
  '/profile': ['advertiser', 'profile'],
  '/settings': ['advertiser', 'settings'],
  '/notifications': ['advertiser', 'notifications'],
  '/support': ['advertiser', 'support'],
};

export function resolveWorkspaceContext(pathname: string): [WorkspaceRole, string] {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  
  if (exactRoutes[normalized]) {
    return exactRoutes[normalized];
  }

  // Segment-safe namespace routing
  if (normalized === '/admin' || normalized.startsWith('/admin/')) {
    if (normalized.startsWith('/admin/house-ads')) return ['admin', 'house_ads'];
    if (normalized.startsWith('/admin/moderation')) return ['admin', 'moderation'];
    if (normalized.startsWith('/admin/disputes')) return ['admin', 'admin_disputes'];
    if (normalized.startsWith('/admin/tests')) return ['admin', 'admin_tests'];
    return ['admin', 'admin_overview'];
  }

  if (normalized === '/promoter' || normalized.startsWith('/promoter/')) {
    if (normalized.startsWith('/promoter/websites')) return ['promoter', 'websites'];
    if (normalized.startsWith('/promoter/slots')) return ['promoter', 'slots'];
    if (normalized.startsWith('/promoter/adstation')) return ['promoter', 'adstation'];
    if (normalized.startsWith('/promoter/individuals')) return ['promoter', 'individuals'];
    if (normalized.startsWith('/promoter/mobile-apps')) return ['promoter', 'mobile_apps'];
    if (normalized.startsWith('/promoter/marketplace')) return ['promoter', 'marketplace'];
    if (normalized.startsWith('/promoter/quality')) return ['promoter', 'quality'];
    return ['promoter', 'websites'];
  }

  if (normalized.startsWith('/campaigns/')) {
    return ['advertiser', 'campaigns'];
  }

  return ['advertiser', 'overview_dash'];
}

export function ProtectedWorkspace({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [role, activeNavId] = resolveWorkspaceContext(pathname);
  const workspace = <AdsConsoleShell role={role} activeNavId={activeNavId}>{children}</AdsConsoleShell>;

  // Safe Guarding: The ENTIRE /admin subtree requires AdminGuard
  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/');
  return (
    <SessionGate>
      {role === 'admin' || isAdminPath ? <AdminGuard key={pathname}>{workspace}</AdminGuard> : workspace}
    </SessionGate>
  );
}
