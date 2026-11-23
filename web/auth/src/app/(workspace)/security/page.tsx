'use client';

import React from 'react';
import Link from 'next/link';
import { Key, Lock, Clock } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { getSecuritySettingsCopy } from '../../../lib/auth-copy';
import { useLanguage } from '../../../../../../shared/ui/localization/LocalizationProvider';

export default function SecuritySettingsPage() {
  const { locale } = useLanguage();
  const copy = getSecuritySettingsCopy(locale);
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

        {/* Password Section */}
        <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={20} color="var(--color-crimson)" />
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{copy.passwordTitle}</h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            {copy.passwordDesc}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button asChild variant="outline" size="sm">
              <Link href="/forgot-password">{copy.changePassword}</Link>
            </Button>
          </div>
        </Card>

        {/* 2FA Section */}
        <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={20} color="var(--text-muted)" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{copy.mfaTitle}</h2>
            </div>
            <Badge variant="outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={12} aria-hidden="true" /> {copy.comingSoon}
            </Badge>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            {copy.mfaDesc}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            {copy.mfaComingSoonNote}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button type="button" variant="outline" size="sm" disabled aria-disabled="true">
              {copy.configureMfa}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
