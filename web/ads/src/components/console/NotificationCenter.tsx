'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Settings,
  Shield,
  CreditCard,
  Layers,
  Trash2,
  CheckCheck,
  Eye,
  Sliders,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  eventType: string;
  title: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
  createdAt: string;
  isRead: boolean;
  actionUrl?: string;
}

export function NotificationCenter() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'settings'>('inbox');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      eventType: 'moderation.decision',
      title: 'Campaign Creative Approved',
      message: 'Your creative for campaign "Genesis Launch" passed automated and secondary inspection.',
      severity: 'success',
      createdAt: '15 minutes ago',
      isRead: false,
    },
    {
      id: '2',
      eventType: 'billing.settlement',
      title: 'Performance Batch Settled',
      message: 'Batch #B-9142 settlement complete: verified impressions debited to escrow.',
      severity: 'info',
      createdAt: '2 hours ago',
      isRead: false,
    },
    {
      id: '3',
      eventType: 'security.alert',
      title: 'New Device Session Confirmed',
      message: 'Signed in from Chrome on Windows (102.89.x.x). MFA verified.',
      severity: 'info',
      createdAt: 'Yesterday',
      isRead: true,
    },
  ]);

  // Preference toggles
  const [preferences, setPreferences] = useState({
    campaignAlerts: true,
    billingAlerts: true,
    moderationAlerts: true,
    supportAlerts: true,
    emailNotifications: true,
    quietHoursEnabled: false,
  });

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const markItemAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? ({ ...n, isRead: true }) : n));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'var(--color-crimson)',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Unified Alerts
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real-time Notifications &amp; Settings</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Notification Center
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="button"
            onClick={() => setActiveTab('inbox')}
            aria-pressed={activeTab === 'inbox'}
            variant={activeTab === 'inbox' ? 'default' : 'outline'}
            size="sm"
          >
            Inbox {unreadCount > 0 && `(${unreadCount} unread)`}
          </Button>
          <Button
            type="button"
            onClick={() => setActiveTab('settings')}
            aria-pressed={activeTab === 'settings'}
            variant={activeTab === 'settings' ? 'default' : 'outline'}
            size="sm"
          >
            <Settings style={{ width: 14, height: 14 }} />
            <span>Preferences</span>
          </Button>
        </div>
      </div>

      {/* TAB 1: INBOX */}
      {activeTab === 'inbox' && (
        <Card className="theme-card" style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Recent Alerts
            </h3>
            {unreadCount > 0 && (
              <Button
                type="button"
                onClick={markAllAsRead}
                variant="outline"
                size="sm"
              >
                <CheckCheck style={{ width: 14, height: 14 }} />
                <span>Mark All as Read</span>
              </Button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markItemAsRead(item.id)}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  backgroundColor: item.isRead ? 'var(--bg-page)' : 'rgba(212,20,58,0.03)',
                  border: `1px solid ${item.isRead ? 'var(--border-subtle)' : 'var(--color-crimson)'}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: item.severity === 'success' ? 'var(--color-success-bg)' : 'rgba(212,20,58,0.08)',
                      color: item.severity === 'success' ? 'var(--color-success)' : 'var(--color-crimson)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Bell style={{ width: 16, height: 16 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {item.message}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                      {item.createdAt} • {item.eventType}
                    </div>
                  </div>
                </div>

                {!item.isRead && (
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-crimson)',
                      marginTop: '6px',
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 2: PREFERENCES */}
      {activeTab === 'settings' && (
        <Card className="theme-card" style={{ padding: '28px', borderRadius: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Notification Dispatch Settings
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
            Select which categories and events should deliver immediate in-app alerts and notifications.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Campaign Status Alerts</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Updates when ads are approved, paused, or require creative revisions</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.campaignAlerts}
                onChange={(e) => setPreferences({ ...preferences, campaignAlerts: e.target.checked })}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Billing &amp; Escrow Statements</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Receipts, wallet deposits, and 30-minute settlement run notices</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.billingAlerts}
                onChange={(e) => setPreferences({ ...preferences, billingAlerts: e.target.checked })}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Helpdesk Ticket Replies</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Notifications when support specialists respond to your inquiries</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.supportAlerts}
                onChange={(e) => setPreferences({ ...preferences, supportAlerts: e.target.checked })}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Verified Email Dispatch</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Forward critical security notices and payment receipts to your verified account email</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
              />
            </label>
          </div>
        </Card>
      )}
    </div>
  );
}
