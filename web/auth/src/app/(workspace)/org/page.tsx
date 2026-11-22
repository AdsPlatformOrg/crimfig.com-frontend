'use client';

import React from 'react';
import Link from 'next/link';
import { Users, UserPlus, ShieldCheck, Mail } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { getOrganizationCopy } from '../../../lib/auth-copy';
import { useLanguage } from '../../../../../../shared/ui/localization/LocalizationProvider';

export default function OrganizationPage() {
  const { locale } = useLanguage();
  const copy = getOrganizationCopy(locale);
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

        {/* Current Org Status */}
        <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(212, 20, 58, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-crimson)' }}>
                <Users size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{copy.workspaceTitle}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{copy.activeSeat}</span>
              </div>
            </div>
            <Button asChild size="sm">
              <Link href="/org/accept-invite">
                <UserPlus size={14} />
                <span>{copy.inviteTeammate}</span>
              </Link>
            </Button>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            {copy.workspaceDesc}
          </p>
        </Card>
      </div>
    </>
  );
}
