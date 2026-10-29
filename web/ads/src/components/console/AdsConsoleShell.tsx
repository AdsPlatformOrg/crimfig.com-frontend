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
import { AccountMenu } from '../../../../../shared/ui/account-menu';
import { ecosystemOrigin } from '../../../../../shared/ui/origins';
import { CrimFigLogo } from '../CrimFigLogo';
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
  const authBase = ecosystemOrigin('auth', process.env.NEXT_PUBLIC_AUTH_WEB_URL);
  const billingBase = ecosystemOrigin('billing', process.env.NEXT_PUBLIC_BILLING_WEB_URL, authBase);
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
      <header style={{borderBottom:'1px solid var(--border-subtle)',background:'var(--bg-page)',position:'sticky',top:0,zIndex:40}}>
        <div className="cf-console-row">
          <div className="cf-console-brand">
            <Button id="ads-mobile-menu-toggle" type="button" variant="outline" size="icon" className="cf-console-mobile-menu" aria-label="Open navigation menu" aria-expanded={isMobileNavOpen} aria-controls="ads-dashboard-sidebar" onClick={()=>setIsMobileNavOpen(true)}><Menu size={20} aria-hidden="true" /></Button>
            <CrimFigLogo variant="brand" app="Ads" href="/" />
          </div>
          <nav className="cf-workspace-nav" aria-label="Ads workspaces">
            <Link href="/dashboard" aria-current={role==='advertiser'?'page':undefined}>Advertiser Studio</Link>
            <Link href="/promoter" aria-current={role==='promoter'?'page':undefined}>Promoter Hub</Link>
            {(isStaffUser||role==='admin')&&<Link href="/admin/moderation" aria-current={role==='admin'?'page':undefined}>Admin Console</Link>}
          </nav>
          <div className="cf-console-actions">
            {role==='advertiser' && pathname!=='/campaigns/new' && <Button asChild size="sm" className="cf-console-context-action"><Link href="/campaigns/new"><Plus size={16} aria-hidden="true" />New Campaign</Link></Button>}
            {role==='promoter' && <Button asChild variant="secondary" size="sm" className="cf-console-context-action"><Link href="/promoter/websites?action=new"><Plus size={16} aria-hidden="true" />Add Property</Link></Button>}
            <AccountMenu session={dashboardSession()} links={[{label:'Profile & Avatar',href:`${authBase}/profile`},{label:'Ads Settings',href:'/settings'},{label:'Account Security',href:`${authBase}/security`}]} />
          </div>
        </div>
      </header>

      {/* Main Workspace Layout with DashboardSidebar Standard */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 71px)', position: 'relative' }}>
        <DashboardSidebar
          app="ads"
          groups={[{title:'Workspaces',items:[{id:'workspace_advertiser',label:'Advertiser Studio',icon:BarChart3,href:'/dashboard'},{id:'workspace_promoter',label:'Promoter Hub',icon:UserCheck,href:'/promoter'},...((isStaffUser||role==='admin')?[{id:'workspace_admin',label:'Admin Console',icon:ShieldCheck,href:'/admin/moderation'}]:[])]},...currentNavGroups]}
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
            href: billingBase,
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
