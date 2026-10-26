'use client';

import React from 'react';
import Link from 'next/link';
import { AuthConsoleShell } from '../../components/AuthConsoleShell';
import { Key, ExternalLink, ShieldCheck } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export default function ConnectedAppsPage() {
  return (
    <AuthConsoleShell activePath="/apps">
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-crimson)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Single Sign-On Integrations
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 8px' }}>
            Connected Portals &amp; Authorized Apps
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Manage OAuth2 clients, API keys, and first-party CrimFig ecosystem portals linked to your identity.
          </p>
        </div>

        {/* First-Party Apps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* App 1: Ads */}
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>CrimFig Ads &amp; Publishing</h3>
              <Badge variant="secondary">
                Connected
              </Badge>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Full access to advertiser campaigns, creative assets, and promoter ad spaces.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <Button asChild variant="outline" size="sm">
                <a href="https://ads.crimfig.com" target="_blank" rel="noreferrer">
                  <span>Launch Ads Portal</span>
                  <ExternalLink size={14} />
                </a>
              </Button>
            </div>
          </Card>

          {/* App 2: Billing */}
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Billing &amp; Escrow</h3>
              <Badge variant="secondary">
                Connected
              </Badge>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Manage wallet funding, bank payouts, subscription renewals, and publisher milestones.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <Button asChild variant="outline" size="sm">
                <a href="https://billing.crimfig.com" target="_blank" rel="noreferrer">
                  <span>Launch Billing Portal</span>
                  <ExternalLink size={14} />
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AuthConsoleShell>
  );
}
