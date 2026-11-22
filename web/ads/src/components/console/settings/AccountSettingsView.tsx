'use client';

import React, { useEffect, useState } from 'react';
import { Palette, ShieldAlert, LogOut } from 'lucide-react';
import { dashboardSession } from '../../../lib/session';
import { Button } from '@/components/ui/button';

export function AccountSettingsView() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const active = document.documentElement.getAttribute('data-theme');
    setTheme(active === 'dark' ? 'dark' : 'light');
  }, []);

  const chooseTheme = (next: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('crimfig-theme', next);
    setTheme(next);
  };

  const handleSignOut = () => { void dashboardSession().logout().catch(() => {}); };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Account Settings
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Choose your display appearance or sign out of this browser session.
        </p>
      </div>

      <section className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Palette size={20} color="var(--color-crimson)" />
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Appearance
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          CrimFig defaults to a crisp light theme. Active theme: <strong>{theme === 'dark' ? 'Dark' : 'Light'}</strong>.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            type="button"
            variant={theme === 'light' ? 'default' : 'outline'}
            aria-pressed={theme === 'light'}
            onClick={() => chooseTheme('light')}
          >
            Light (Default)
          </Button>
          <Button
            type="button"
            variant={theme === 'dark' ? 'default' : 'outline'}
            aria-pressed={theme === 'dark'}
            onClick={() => chooseTheme('dark')}
          >
            Dark
          </Button>
        </div>
      </section>

      <section className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert size={20} color="var(--color-error)" />
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Session
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          Sign out and return to CrimFig sign-in.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            type="button"
            variant="destructive"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
