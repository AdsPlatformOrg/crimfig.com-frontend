'use client';

import React, { useState } from 'react';
import { Settings, Bell, Palette, Layout, ShieldAlert, LogOut, Check } from 'lucide-react';
import { dashboardSession } from '../../../lib/session';
import { Button } from '@/components/ui/button';

export function AccountSettingsView() {
  const [budgetAlerts, setBudgetAlerts] = useState<boolean>(true);
  const [moderationUpdates, setModerationUpdates] = useState<boolean>(true);
  const [rebateNotices, setRebateNotices] = useState<boolean>(true);
  const [weeklyDigest, setWeeklyDigest] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSignOutAll = async () => {
    try {
      await dashboardSession().logout();
    } catch {
      window.location.href = '/';
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Account & Console Settings
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Configure notification preferences, interface display behaviors, and active session controls.
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bell size={20} color="var(--color-crimson)" />
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Email Notifications & System Alerts
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Low Campaign Budget Warnings
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Notify me when a campaign has less than 10% remaining budget to avoid unexpected pauses.
              </div>
            </div>
            <input
              type="checkbox"
              checked={budgetAlerts}
              onChange={(e) => setBudgetAlerts(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-crimson)', cursor: 'pointer' }}
            />
          </label>

          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Creative Asset Review Updates
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Instant notification when submitted creative assets are approved or require moderation replacement.
              </div>
            </div>
            <input
              type="checkbox"
              checked={moderationUpdates}
              onChange={(e) => setModerationUpdates(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-crimson)', cursor: 'pointer' }}
            />
          </label>

          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Invalid Click Rebate Slips
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Automated monthly statements of credited refunds resulting from anti-fraud audits.
              </div>
            </div>
            <input
              type="checkbox"
              checked={rebateNotices}
              onChange={(e) => setRebateNotices(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-crimson)', cursor: 'pointer' }}
            />
          </label>

          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Weekly Publisher Earnings Digest
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Summary of impressions delivered, fill rates, and cleared promoter payouts.
              </div>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => setWeeklyDigest(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-crimson)', cursor: 'pointer' }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button
            type="button"
            onClick={handleSave}
            variant="default"
            className="flex items-center gap-2"
          >
            {isSaved ? <Check size={14} /> : null}
            <span>{isSaved ? 'Preferences Saved' : 'Save Notifications'}</span>
          </Button>
        </div>
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
            Session Termination & Security
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          Sign out of all active browser sessions across devices. This clears active access tokens while preserving all account data and campaigns.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            type="button"
            variant="destructive"
            onClick={handleSignOutAll}
            className="flex items-center gap-2"
          >
            <LogOut size={14} />
            <span>Sign Out All Active Sessions</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
