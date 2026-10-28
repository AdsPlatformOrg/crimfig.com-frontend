import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  User,
  Settings,
} from 'lucide-react';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { SignOutButton } from '../SessionGate';
import { DashboardSidebar, type NavGroup } from '../DashboardSidebar';
import { apiData } from '../../lib/api-data';
import { dashboardSession } from '../../lib/session';
import { Button, Badge } from '../ui';

export interface AdsConsoleShellProps {
  children: React.ReactNode;
  role: 'advertiser' | 'promoter' | 'admin';
  activeNavId: string;
}

export function AdsConsoleShell({ children, role, activeNavId }: AdsConsoleShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => { setIsMobileNavOpen(false); }, [pathname]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isStaffUser, setIsStaffUser] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<{ url: string; alt: string } | null>(null);
  const authBase = process.env.NEXT_PUBLIC_AUTH_WEB_URL || (process.env.NODE_ENV === 'production' ? 'https://auth.crimfig.com' : 'http://localhost:3000');

  useEffect(() => {
    let active = true;
    const load = () => {
      void dashboardSession().getProfile()
        .then((profile) => { if (active) setAvatar({ url: profile.avatar.url, alt: profile.avatar.alt }); })
        .catch(() => { /* Default avatar remains visible. */ });
    };
    load();
    window.addEventListener('crimfig-profile-updated', load);
    return () => { active = false; window.removeEventListener('crimfig-profile-updated', load); };
  }, []);

  useEffect(() => {
    if (!isMobileNavOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileNavOpen(false);
        document.getElementById('ads-mobile-menu-toggle')?.focus();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileNavOpen]);

  useEffect(() => {
    let active = true;
    async function checkStaff() {
      try {
        const res = await apiData<{ isStaff: boolean }>('/api/v1/ecosystem/staff-status').catch(() => null);
        if (active && res) {
          setIsStaffUser(Boolean(res.isStaff));
        }
      } catch {
        // Safe default: non-staff
      }
    }
    void checkStaff();
    return () => {
      active = false;
    };
  }, []);

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
        { id: 'profile', label: 'User Profile', icon: User, href: '/profile' },
        { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
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
        { id: 'websites', label: 'Websites & Ad Slots', icon: Globe, href: '/promoter/websites' },
        { id: 'adstation', label: 'AdStation Direct Deals', icon: Layers, href: '/promoter/adstation' },
        { id: 'individuals', label: 'Links & Reels Social', icon: Share2, href: '/promoter/individuals' },
        { id: 'mobile_apps', label: 'Mobile Apps SDK', icon: Smartphone, href: '/promoter/mobile-apps' },
      ],
    },
    {
      title: 'Deals & Discovery',
      items: [
        { id: 'marketplace', label: 'Ad Marketplace', icon: Share2, href: '/promoter/marketplace' },
        { id: 'quality', label: 'Quality & Trust Score', icon: ShieldCheck, href: '/promoter/quality' },
      ],
    },
    {
      title: 'Earnings & Account',
      items: [
        { id: 'billing_escrow', label: 'Earnings & Payouts', icon: CreditCard, href: '/billing' },
        { id: 'profile', label: 'User Profile', icon: User, href: '/profile' },
        { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
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
        { id: 'admin_tests', label: 'API Test Suite', icon: Sparkles, href: '/admin/tests' },
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
            <Button
              id="ads-mobile-menu-toggle"
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsMobileNavOpen(true)}
              className="cf-console-mobile-menu"
              aria-label="Open navigation menu"
              aria-expanded={isMobileNavOpen}
              aria-controls="ads-dashboard-sidebar"
            >
              <Menu size={18} aria-hidden="true" />
            </Button>

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

          {/* Mode Switcher: Advertiser Studio vs Promoter Hub (Admin Console conditionally shown) */}
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
              <Button
                type="button"
                onClick={() => router.push('/dashboard')}
                variant={role === 'advertiser' ? 'secondary' : 'ghost'}
                size="sm"
                aria-pressed={role === 'advertiser'}
              >
                <BarChart3 style={{ width: 14, height: 14 }} />
                <span>Advertiser Studio</span>
              </Button>
              <Button
                type="button"
                onClick={() => router.push('/promoter')}
                variant={role === 'promoter' ? 'default' : 'ghost'}
                size="sm"
                aria-pressed={role === 'promoter'}
              >
                <UserCheck style={{ width: 14, height: 14 }} />
                <span>Promoter Hub</span>
              </Button>
              {(isStaffUser || role === 'admin') && (
                <Button
                  type="button"
                  onClick={() => router.push('/admin/moderation')}
                  variant={role === 'admin' ? 'secondary' : 'ghost'}
                  size="sm"
                  aria-pressed={role === 'admin'}
                >
                  <ShieldCheck style={{ width: 14, height: 14 }} />
                  <span>Admin Console</span>
                </Button>
              )}
            </div>
          </div>

          {/* Right Controls: Contextual Primary CTA, Wallet Trigger & Sign Out */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', maxWidth: '100%' }}>
            {role === 'advertiser' ? (
              <Button
                type="button"
                onClick={() => router.push('/campaigns/new')}
                size="sm"
              >
                <Plus style={{ width: 14, height: 14 }} />
                <span>New Campaign</span>
              </Button>
            ) : role === 'promoter' ? (
              <Button
                type="button"
                onClick={() => router.push('/promoter/websites?action=new')}
                variant="secondary"
                size="sm"
              >
                <Plus style={{ width: 14, height: 14 }} />
                <span>Add Property</span>
              </Button>
            ) : null}

            <Link
              href={`${authBase}/profile`}
              aria-label="Open profile and avatar settings"
              style={{ display: 'inline-flex', width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-subtle)', flexShrink: 0 }}
            >
              {/* Avatar is served by Auth; not a bundled Next image. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar?.url || `${authBase}/avatars/chibi/chibi-indigo.webp`}
                alt={avatar?.alt || 'Default chibi ninja avatar'}
                width={36}
                height={36}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Link>

            <SignOutButton />

            <Button
              type="button"
              onClick={() => {
                router.push('/billing');
              }}
              variant="outline"
              size="sm"
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
            </Button>
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
            } else if (['campaigns', 'conversions', 'disputes', 'notifications', 'support', 'profile', 'settings'].includes(id)) {
              router.push(`/${id}`);
            } else if (id === 'billing_escrow') {
              router.push('/billing');
            } else if (id === 'websites') {
              router.push('/promoter/websites');
            } else if (id === 'adstation') {
              router.push('/promoter/adstation');
            } else if (id === 'individuals') {
              router.push('/promoter/individuals');
            } else if (id === 'mobile_apps') {
              router.push('/promoter/mobile-apps');
            } else if (id === 'marketplace') {
              router.push('/promoter/marketplace');
            } else if (id === 'quality') {
              router.push('/promoter/quality');
            } else if (id === 'moderation') {
              router.push('/admin/moderation');
            } else if (id === 'admin_disputes') {
              router.push('/admin/disputes');
            } else if (id === 'admin_tests') {
              router.push('/admin/tests');
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
