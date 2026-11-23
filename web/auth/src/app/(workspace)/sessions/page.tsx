'use client';

import React from 'react';
import { Monitor, ShieldAlert, LogOut, Clock } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { getSessionsCopy } from '../../../lib/auth-copy';
import { useLanguage } from '../../../../../../shared/ui/localization/LocalizationProvider';

export default function SessionsPage() {
  const { locale } = useLanguage();
  const copy = getSessionsCopy(locale);
  return (
    <>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-crimson)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {copy.eyebrow}
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 8px' }}>
            {copy.title}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            {copy.subtitle}
          </p>
        </div>

        {/* Current Active Session */}
        <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(22, 163, 74, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
                <Monitor size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>{copy.currentBrowser}</h3>
                  <Badge variant="secondary">
                    {copy.thisDevice}
                  </Badge>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{copy.activeNow}</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            {copy.sessionDesc}
          </p>
        </Card>

        {/* Remote Logout Danger Zone */}
        <Card variant="outline" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={20} color="var(--text-muted)" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{copy.remoteTitle}</h2>
            </div>
            <Badge variant="outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={12} aria-hidden="true" /> {copy.comingSoon}
            </Badge>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            {copy.remoteDesc}
          </p>
          <div>
            <Button type="button" variant="outline" size="sm" disabled aria-disabled="true">
              <LogOut size={14} aria-hidden="true" />
              <span>{copy.signOutAll}</span>
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
