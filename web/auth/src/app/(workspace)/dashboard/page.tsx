'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, UserCheck, Key, Lock, ExternalLink, Smartphone, Clock } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';
import { getAuthDashboardCopy } from '../../../lib/auth-copy';
import { useLanguage } from '../../../../../../shared/ui/localization/LocalizationProvider';

export default function AuthDashboardPage() {
  const { locale } = useLanguage();
  const copy = getAuthDashboardCopy(locale);
  return (
    <>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-crimson)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {copy.eyebrow}
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 8px' }}>
            {copy.title}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            {copy.subtitle}
          </p>
        </div>

        {/* Status Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Card 1: Session Status */}
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(22, 163, 74, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{copy.ssoTitle}</h3>
                <Badge variant="secondary">{copy.ssoBadge}</Badge>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {copy.ssoDesc}
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <Link href="/sessions" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-crimson)', textDecoration: 'none' }}>
                {copy.ssoLink}
              </Link>
            </div>
          </Card>

          {/* Card 2: 2FA MFA */}
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(212, 20, 58, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-crimson)' }}>
                <Lock size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{copy.mfaTitle}</h3>
                <Badge variant="outline" style={{ marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={12} aria-hidden="true" /> {copy.comingSoon}
                </Badge>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {copy.mfaDesc}
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <Link href="/security" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-crimson)', textDecoration: 'none' }}>
                {copy.mfaLink}
              </Link>
            </div>
          </Card>

          {/* Card 3: Connected Apps */}
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                <Key size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{copy.appsTitle}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{copy.appsSub}</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Seamlessly sign in to Ads Studio, Billing &amp; Escrow, and Creator Portals.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: 'auto', paddingTop: '10px' }}>
              <Link href="/apps" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-crimson)', textDecoration: 'none' }}>
                Manage Authorizations →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
