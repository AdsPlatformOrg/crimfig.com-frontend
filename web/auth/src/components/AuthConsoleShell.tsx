'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CrimFigLogo } from './CrimFigLogo';
import { DashboardSidebar, NavGroup } from './DashboardSidebar';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Menu, ShieldAlert, Key, Smartphone, Users, Lock, LogOut } from 'lucide-react';

interface AuthConsoleShellProps {
  children: React.ReactNode;
  activePath?: string;
  isStaff?: boolean;
}

export function AuthConsoleShell({ children, activePath = '/dashboard', isStaff = false }: AuthConsoleShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const authNavGroups: NavGroup[] = [
    {
      label: 'Identity & Security',
      items: [
        { label: 'Security Overview', href: '/dashboard', icon: Lock },
        { label: 'Credentials & 2FA', href: '/security', icon: Key },
        { label: 'Active Sessions', href: '/sessions', icon: Smartphone },
        { label: 'Connected Apps', href: '/apps', icon: Key },
      ],
    },
    {
      label: 'Workspace',
      items: [
        { label: 'Organization & Team', href: '/org', icon: Users },
      ],
    },
    ...(isStaff
      ? [
          {
            label: 'Administration',
            items: [
              { label: 'Staff Identity Console', href: '/admin', icon: ShieldAlert },
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
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                padding: '4px',
              }}
              className="auth-mobile-menu-toggle"
              aria-label="Toggle Navigation"
            >
              <Menu size={22} />
            </button>
            <CrimFigLogo variant="brand" size={36} app="Identity" appBadge="Zero-Trust" href="/" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/login"
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
              <span>Switch Account</span>
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
          style={{
            width: '260px',
            flexShrink: 0,
            borderRight: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-page)',
          }}
          className="auth-desktop-sidebar"
        >
          <DashboardSidebar
            navGroups={authNavGroups}
            activePath={activePath}
            app="auth"
            themeToggleSlot={<ThemeSwitcher showLabel labelPrefix="Theme:" />}
          />
        </aside>

        {/* Content View */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            padding: '32px 24px',
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
