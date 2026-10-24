'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  DollarSign,
  Menu,
  Sparkles,
  Globe,
  Share2,
  Smartphone,
  CreditCard,
  Bell,
  HelpCircle,
  Plus,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { SignOutButton } from '../SessionGate';
import { DashboardSidebar, type NavGroup } from '../DashboardSidebar';

export interface AdsConsoleShellProps {
  children: React.ReactNode;
  role: 'advertiser' | 'promoter' | 'admin';
  activeNavId: string;
}

export function AdsConsoleShell({ children, role, activeNavId }: AdsConsoleShellProps) {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Advertiser Nav Groups
  const advertiserNavGroups: NavGroup[] = [
    {
      title: 'Campaign Management',
      items: [
        { id: 'overview_dash', label: 'Overview Dashboard', icon: BarChart3, href: '/dashboard' },
        { id: 'campaigns', label: 'Active Campaigns', icon: Layers, href: '/campaigns' },
        { id: 'new_campaign', label: 'Create Campaign', icon: Plus, href: '/campaigns/new' },
      ],
    },
    {
      title: 'Performance & Traffic',
      items: [
        { id: 'conversions', label: 'Conversion Tracking', icon: Sparkles, href: '/conversions' },
        { id: 'disputes', label: 'Invalid Traffic Audits', icon: ShieldCheck, href: '/disputes' },
      ],
    },
    {
      title: 'Finance & Account',
      items: [
        { id: 'billing_escrow', label: 'Billing & Escrow', icon: CreditCard, href: '/billing' },
        { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications' },
        { id: 'support', label: 'Help & Support', icon: HelpCircle, href: '/support' },
      ],
    },
  ];

  // Promoter Nav Groups
  const promoterNavGroups: NavGroup[] = [
    {
      title: 'Monetization',
      items: [
        { id: 'websites', label: 'Websites & Ad Slots', icon: Globe, href: '/websites' },
        { id: 'adstation', label: 'AdStation Direct Deals', icon: Layers, href: '/adstation' },
        { id: 'individuals', label: 'Links & Reels Social', icon: Share2, href: '/individuals' },
        { id: 'mobile_apps', label: 'Mobile Apps SDK', icon: Smartphone, href: '/mobile_apps' },
      ],
    },
    {
      title: 'Deals & Discovery',
      items: [
        { id: 'marketplace', label: 'Ad Marketplace', icon: Share2, href: '/marketplace' },
        { id: 'quality', label: 'Quality & Trust Score', icon: ShieldCheck, href: '/quality' },
      ],
    },
    {
      title: 'Earnings & Account',
      items: [
        { id: 'billing_escrow', label: 'Earnings & Payouts', icon: CreditCard, href: '/billing' },
        { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications' },
        { id: 'support', label: 'Support & Knowledge', icon: HelpCircle, href: '/support' },
      ],
    },
  ];

  // Admin Nav Groups
  const adminNavGroups: NavGroup[] = [
    {
      title: 'Governance & Audits',
      items: [
        { id: 'moderation', label: 'Creative Review Queue', icon: ShieldCheck, href: '/admin/moderation' },
        { id: 'admin_disputes', label: 'Traffic Adjustments', icon: ShieldAlert, href: '/admin/disputes' },
      ],
    },
    {
      title: 'System & Health',
      items: [
        { id: 'quality', label: 'Traffic Integrity Engine', icon: ShieldCheck, href: '/quality' },
        { id: 'notifications', label: 'Admin Alerts', icon: Bell, href: '/notifications' },
        { id: 'support', label: 'Support Queue', icon: HelpCircle, href: '/support' },
      ],
    },
  ];

  const currentNavGroups: NavGroup[] =
    role === 'admin' ? adminNavGroups : role === 'promoter' ? promoterNavGroups : advertiserNavGroups;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
      {/* Top Console Navigation Bar */}
      <header
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-page)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '12px 24px',
            minHeight: '70px',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Brand Identity & Back to Landing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', maxWidth: '100%' }}>
            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                borderRadius: '8px',
                backgroundColor: 'var(--badge-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
              title="Open Navigation Menu"
            >
              <Menu style={{ width: 18, height: 18 }} />
            </button>

            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
              title="Return to CrimFig Ads Home"
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'var(--gradient-crimson)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '18px',
                  color: '#FFFFFF',
                  boxShadow: 'var(--shadow-crimson)',
                }}
              >
                CF
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--text-primary)',
                  }}
                >
                  CrimFig <span style={{ color: 'var(--color-crimson)' }}>Ads</span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--badge-bg)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    Console
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Mode Switcher: Advertiser Studio vs Promoter Hub vs Admin Console */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', maxWidth: '100%', minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                flexWrap: 'wrap',
                maxWidth: '100%',
                boxSizing: 'border-box',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: role === 'advertiser' ? 'var(--color-fig-dark)' : 'transparent',
                  color: role === 'advertiser' ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                <BarChart3 style={{ width: 14, height: 14 }} />
                <span>Advertiser Studio</span>
              </button>
              <button
                type="button"
                onClick={() => router.push('/websites')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: role === 'promoter' ? 'var(--color-crimson)' : 'transparent',
                  color: role === 'promoter' ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                <UserCheck style={{ width: 14, height: 14 }} />
                <span>Promoter Hub</span>
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/moderation')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: role === 'admin' ? 'var(--color-fig-dark)' : 'transparent',
                  color: role === 'admin' ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                <ShieldCheck style={{ width: 14, height: 14 }} />
                <span>Admin Console</span>
              </button>
            </div>
          </div>

          {/* Right Controls: Sign Out & Wallet Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', maxWidth: '100%' }}>
            <SignOutButton />

            <button
              type="button"
              onClick={() => {
                router.push('/billing');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--badge-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
              }}
            >
              <DollarSign style={{ width: 14, height: 14, color: 'var(--color-success)' }} />
              <span>Financial Ledger</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout with DashboardSidebar Standard */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 71px)', position: 'relative' }}>
        <DashboardSidebar
          app="ads"
          groups={currentNavGroups}
          activeId={activeNavId}
          onSelect={(id) => {
            if (id === 'overview_dash') {
              router.push('/dashboard');
            } else if (id === 'new_campaign') {
              router.push('/campaigns/new');
            } else if (['campaigns', 'conversions', 'disputes', 'notifications', 'support'].includes(id)) {
              router.push(`/${id}`);
            } else if (id === 'billing_escrow') {
              router.push('/billing');
            } else if (['websites', 'adstation', 'individuals', 'mobile_apps', 'marketplace', 'quality'].includes(id)) {
              router.push(`/${id}`);
            } else if (id === 'moderation') {
              router.push('/admin/moderation');
            } else if (id === 'admin_disputes') {
              router.push('/admin/disputes');
            }
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          switchAppLink={{
            label: 'Billing & Wallet',
            href: 'https://billing.crimfig.com',
            icon: CreditCard,
          }}
        />

        {/* Page Content Slot */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <main
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '32px 24px',
              flex: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
              minWidth: 0,
            }}
          >
            {children}
          </main>

          {/* Console Workspace Footer */}
          <footer
            style={{
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              padding: '18px 24px',
              marginTop: 'auto',
            }}
          >
            <div
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                fontSize: '12px',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>CrimFig Ads</span>
                <span>•</span>
                <span>© {new Date().getFullYear()} CrimFig Ecosystem</span>
              </div>

              <ThemeSwitcher showLabel labelPrefix="Theme:" />
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
