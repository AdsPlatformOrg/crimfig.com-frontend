import { workspaceNavigation } from '../../lib/workspace-navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Plus } from 'lucide-react';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { AccountMenu } from '../../../../../shared/ui/account-menu';
import { LanguagePicker } from '../../../../../shared/ui/localization/LanguagePicker';
import { publishedLocales } from '../../../../../shared/ui/localization/locale';
import { ecosystemOrigin } from '../../../../../shared/ui/origins';
import { CrimFigLogo } from '../CrimFigLogo';
import { DashboardSidebar } from '../DashboardSidebar';
import { apiData } from '../../lib/api-data';
import { dashboardSession } from '../../lib/session';
import { Button } from '../ui';
import { Dialog, DialogOverlay, DialogPanel, DialogPortal, DialogTitle, DialogTrigger } from '../ui/dialog';
import sidebar from '../DashboardSidebar.module.css';

export interface AdsConsoleShellProps {
  children: React.ReactNode;
  role: 'advertiser' | 'promoter' | 'admin';
  activeNavId: string;
  pendingSession?: boolean;
}

export function AdsConsoleShell({ children, role, activeNavId, pendingSession = false }: AdsConsoleShellProps) {
  const pathname = usePathname();
  useEffect(() => { setIsMobileNavOpen(false); }, [pathname]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [staffRoles, setStaffRoles] = useState<string[]>([]);
  const [isStaffUser, setIsStaffUser] = useState<boolean>(false);
  const authBase = ecosystemOrigin('auth', process.env.NEXT_PUBLIC_AUTH_WEB_URL);
  useEffect(() => {
    const viewport = window.matchMedia('(max-width: 960px)');
    const closeOnDesktop = () => {
      if (!viewport.matches) setIsMobileNavOpen(false);
    };
    if (typeof viewport.addEventListener === 'function') {
      viewport.addEventListener('change', closeOnDesktop);
      return () => viewport.removeEventListener('change', closeOnDesktop);
    }
    viewport.addListener(closeOnDesktop);
    return () => viewport.removeListener(closeOnDesktop);
  }, []);

  useEffect(() => {
    if (pendingSession) return;
    let active = true;
    async function checkStaff() {
      try {
        const res = await apiData<{ isStaff: boolean; roles: string[] }>('/api/v1/ecosystem/staff-status').catch(() => null);
        if (active && res) {
          setIsStaffUser(Boolean(res.isStaff));
          setStaffRoles(Array.isArray(res.roles) ? res.roles : []);
        }
      } catch {
        // Safe default: non-staff
      }
    }
    void checkStaff();
    return () => {
      active = false;
    };
  }, [pendingSession]);

  const currentNavGroups = workspaceNavigation(role, staffRoles);

  return (
    <Dialog open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
        <header style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-page)', position: 'sticky', top: 0, zIndex: 40 }}>
          <div className="cf-console-row">
            <div className="cf-console-brand">
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="icon" className="cf-console-mobile-menu" aria-label="Open navigation menu">
                  <Menu size={20} aria-hidden="true" />
                </Button>
              </DialogTrigger>
              <CrimFigLogo variant="brand" app="Ads" href="/" />
            </div>
            <nav className="cf-workspace-nav" aria-label="Ads workspaces">
              <Link href="/dashboard" aria-current={role === 'advertiser' ? 'page' : undefined}>Advertiser Studio</Link>
              <Link href="/promoter" aria-current={role === 'promoter' ? 'page' : undefined}>Promoter Hub</Link>
              {(isStaffUser || role === 'admin') && <Link href="/admin/overview" aria-current={role === 'admin' ? 'page' : undefined}>Admin Console</Link>}
            </nav>
            <div className="cf-console-actions">
              {role === 'advertiser' && pathname !== '/campaigns/new' && <Button asChild size="sm" className="cf-console-context-action"><Link href="/campaigns/new"><Plus size={16} aria-hidden="true" />New Campaign</Link></Button>}
              {role === 'promoter' && <Button asChild variant="secondary" size="sm" className="cf-console-context-action"><Link href="/promoter/websites?action=new"><Plus size={16} aria-hidden="true" />Add Property</Link></Button>}
              {publishedLocales.length > 1 && <LanguagePicker publishedOnly />}
              {!pendingSession && <AccountMenu session={dashboardSession()} links={[{ label: 'Profile & Avatar', href: `${authBase}/profile` }, { label: 'Ads Settings', href: `/settings?workspace=${role}` }, { label: 'Account Security', href: `${authBase}/security` }]} />}
            </div>
          </div>
        </header>

        {/* Main Workspace Layout with DashboardSidebar Standard */}
        <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 71px)', position: 'relative' }}>
          <div className={sidebar.desktop}>
            <DashboardSidebar
              groups={currentNavGroups}
              activeId={activeNavId}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed((previous) => !previous)}
            />
          </div>
          <DialogPortal>
            <DialogOverlay className={sidebar.overlay} />
            <DialogPanel className={sidebar.drawer} aria-describedby={undefined}>
              <DialogTitle className={sidebar.srOnly}>Ads navigation</DialogTitle>
              <DashboardSidebar
                groups={currentNavGroups}
                activeId={activeNavId}
                onNavigate={() => setIsMobileNavOpen(false)}
                mobile
              />
            </DialogPanel>
          </DialogPortal>

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
    </Dialog>
  );
}
