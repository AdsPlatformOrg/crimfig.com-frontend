'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CrimFigLogo } from './CrimFigLogo';
import { DashboardSidebar, NavGroup } from './DashboardSidebar';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Menu, X, ShieldAlert, Key, Smartphone, Users, Lock, LogOut, UserRound } from 'lucide-react';
import { Button } from './ui/button';
import { consentSession } from '../lib/consent';

interface AuthConsoleShellProps {
  children: React.ReactNode;
  activePath?: string;
  isStaff?: boolean;
}

export function AuthConsoleShell({ children, activePath = '/dashboard', isStaff = false }: AuthConsoleShellProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatar, setAvatar] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    let active = true;
    const load = () => {
      void consentSession().getProfile()
        .then((profile) => { if (active) setAvatar({ url: profile.avatar.url, alt: profile.avatar.alt }); })
        .catch(() => { /* The default avatar remains visible. */ });
    };
    load();
    window.addEventListener('crimfig-profile-updated', load);
    return () => { active = false; window.removeEventListener('crimfig-profile-updated', load); };
  }, []);

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
      {/* Top Header */}
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
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '12px 24px',
            minHeight: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              id="auth-mobile-menu-toggle"
              variant="outline"
              size="icon"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="auth-mobile-menu-toggle"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="auth-console-sidebar"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <CrimFigLogo variant="brand" size={36} app="Identity" appBadge="Zero-Trust" href="/" />
          </div>

          <div className="auth-header-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/profile"
              aria-label="Open profile and avatar settings"
              style={{ display: 'inline-flex', width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-subtle)', flexShrink: 0 }}
            >
              {/* The avatar URL is same-origin in Auth and is not a Next image domain. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar?.url || '/avatars/chibi/chibi-indigo.webp'}
                alt={avatar?.alt || 'Default chibi ninja avatar'}
                width={36}
                height={36}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Link>
            <Link
              href="/login"
              className="auth-switch-account"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(212, 20, 58, 0.08)',
                color: 'var(--color-crimson)',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <LogOut size={14} />
              <span className="auth-switch-account-label">Switch Account</span>
            </Link>
          </div>
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
