import { workspaceNavigation } from '../../lib/workspace-navigation';
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
  const [staffRoles,setStaffRoles]=useState<string[]>([]);
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
        const res = await apiData<{ isStaff: boolean; roles:string[] }>('/api/v1/ecosystem/staff-status').catch(() => null);
        if (active && res) {
          setIsStaffUser(Boolean(res.isStaff));
          setStaffRoles(Array.isArray(res.roles)?res.roles:[]);
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

  const currentNavGroups=workspaceNavigation(role,staffRoles);

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
            <AccountMenu session={dashboardSession()} links={[{label:'Profile & Avatar',href:`${authBase}/profile`},{label:'Ads Settings',href:`/settings?workspace=${role}`},{label:'Account Security',href:`${authBase}/security`}]} />
          </div>
        </div>
      </header>

      {/* Main Workspace Layout with DashboardSidebar Standard */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 71px)', position: 'relative' }}>
        <DashboardSidebar
          app="ads"
          groups={currentNavGroups}
          activeId={activeNavId}
          onSelect={(id)=>{const item=currentNavGroups.flatMap(group=>group.items.flatMap(item=>item.children||[item])).find(item=>item.id===id);if(item?.href)router.push(item.href);}}

          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          switchAppLink={
            role === 'advertiser'
              ? {
                  label: 'Billing & Wallet',
                  href: billingBase,
                  icon: CreditCard,
                }
              : undefined
          }
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
