'use client';

import React from 'react';
import { ecosystemOrigin } from '../../../../../../shared/ui/origins';
import Link from 'next/link';
import { Key, ExternalLink, ShieldCheck } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { getConnectedAppsCopy } from '../../../lib/auth-copy';
import { useLanguage } from '../../../../../../shared/ui/localization/LocalizationProvider';

export default function ConnectedAppsPage() {
  const { locale } = useLanguage();
  const copy = getConnectedAppsCopy(locale);
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

        {/* First-Party Apps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* App 1: Ads */}
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{copy.adsTitle}</h3>
              <Badge variant="secondary">
                {copy.connectedBadge}
              </Badge>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              {copy.adsDesc}
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <Button asChild variant="outline" size="sm">
                <a href={ecosystemOrigin('ads',process.env.NEXT_PUBLIC_ADS_URL)} target="_blank" rel="noreferrer">
                  <span>{copy.adsLaunch}</span>
                  <ExternalLink size={14} />
                </a>
              </Button>
            </div>
          </Card>

          {/* App 2: Billing */}
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{copy.billingTitle}</h3>
              <Badge variant="secondary">
                {copy.connectedBadge}
              </Badge>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              {copy.billingDesc}
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <Button asChild variant="outline" size="sm">
                <a href={ecosystemOrigin('billing',process.env.NEXT_PUBLIC_BILLING_URL)} target="_blank" rel="noreferrer">
                  <span>{copy.billingLaunch}</span>
                  <ExternalLink size={14} />
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
