'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { CrimFigLogo } from './CrimFigLogo';
import { DashboardSidebar, NavGroup } from './DashboardSidebar';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Menu, X, ShieldAlert, Key, Smartphone, Users, Lock, LogOut, UserRound } from 'lucide-react';
import { Button } from './ui/button';
import { AccountMenu } from '../../../../shared/ui/account-menu';
import { consentSession } from '../lib/consent';

interface AuthConsoleShellProps {
  children: React.ReactNode;
  activePath?: string;
  isStaff?: boolean;
}

export function AuthConsoleShell({ children, activePath = '/dashboard', isStaff = false }: AuthConsoleShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        document.getElementById('auth-mobile-menu-toggle')?.focus();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  const authNavGroups: NavGroup[] = [
    {
      title: 'Identity & Security',
      items: [
        { id: 'dashboard', label: 'Security Overview', href: '/dashboard', icon: Lock },
        { id: 'profile', label: 'Profile & Avatar', href: '/profile', icon: UserRound },
        { id: 'security', label: 'Credentials & 2FA', href: '/security', icon: Key },
        { id: 'sessions', label: 'Active Sessions', href: '/sessions', icon: Smartphone },
        { id: 'apps', label: 'Connected Apps', href: '/apps', icon: Key },
      ],
    },
    {
      title: 'Workspace',
      items: [
        { id: 'org', label: 'Organization & Team', href: '/org', icon: Users },
      ],
    },
    ...(isStaff
      ? [
        {
          title: 'Administration',
          items: [
            { id: 'admin', label: 'Staff Identity Console', href: '/admin', icon: ShieldAlert },
          ],
        },
      ]
      : []),
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-primary)',
        fontFamily: "'Poppins', Arial, Helvetica, sans-serif",
      }}
    >
      <header style={{borderBottom:'1px solid var(--border-subtle)',background:'var(--bg-page)',position:'sticky',top:0,zIndex:40}}>
        <div className="cf-console-row">
          <div className="cf-console-brand">
            <Button id="auth-mobile-menu-toggle" variant="outline" size="icon" className="auth-mobile-menu-toggle" aria-label={mobileMenuOpen?'Close navigation menu':'Open navigation menu'} aria-expanded={mobileMenuOpen} aria-controls="auth-console-sidebar" onClick={()=>setMobileMenuOpen(value=>!value)}>{mobileMenuOpen?<X size={20} />:<Menu size={20} />}</Button>
            <CrimFigLogo variant="brand" app="Auth" href="/" />
          </div>
          <AccountMenu session={consentSession()} links={[{label:'Profile & Avatar',href:'/profile'},{label:'Account Security',href:'/security'},{label:'Switch Account',href:'/login'}]} />
        </div>
      </header>

      {/* Main Layout Area */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Desktop Sidebar */}
        <aside
          id="auth-console-sidebar"
          data-open={mobileMenuOpen}
          style={{
            width: '260px',
            flexShrink: 0,
            borderRight: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-page)',
          }}
          className="auth-desktop-sidebar"
        >
          <DashboardSidebar
            groups={authNavGroups}
            activeId={activePath.replace('/', '') || 'dashboard'}
            onSelect={(id) => {
              setMobileMenuOpen(false);
              if (id === 'dashboard') router.push('/dashboard');
              else router.push(`/${id}`);
            }}
            app="auth"
            isMobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        </aside>

        {/* Content View */}
        <main
          className="auth-console-main"
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-elevated)',
          padding: '18px 24px',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
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
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>CrimFig Central Auth</span>
            <span>•</span>
            <span>© {new Date().getFullYear()} CrimFig Technologies</span>
          </div>

          <ThemeSwitcher showLabel labelPrefix="Theme:" />
        </div>
      </footer>
    </div>
  );
}
