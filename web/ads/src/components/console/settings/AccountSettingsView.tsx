'use client';

import React from 'react';
import { Palette, ShieldAlert, LogOut } from 'lucide-react';
import { dashboardSession } from '../../../lib/session';
import { Button } from '@/components/ui/button';

export function AccountSettingsView() {
  const handleSignOut = () => { void dashboardSession().logout().catch(() => {}); };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Account & Console Settings
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Choose a theme or sign out of this browser session.
        </p>
      </div>

      {/* Interface & Theme Settings */}
      <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Palette size={20} color="var(--color-crimson)" />
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Interface Appearance & Theme
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          CrimFig defaults to a crisp light theme. You can toggle your active theme in the platform footer or choose your default preference.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              document.documentElement.setAttribute('data-theme', 'light');
              localStorage.setItem('crimfig-theme', 'light');
            }}
          >
            Light Theme (Default)
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              document.documentElement.setAttribute('data-theme', 'dark');
              localStorage.setItem('crimfig-theme', 'dark');
            }}
          >
            Dark Mode
          </Button>
        </div>
      </div>

      {/* Session Security & Danger Zone */}
      <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
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
      </div>
    </div>
  );
}
