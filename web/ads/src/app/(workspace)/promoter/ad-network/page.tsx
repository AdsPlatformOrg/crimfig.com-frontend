'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Globe, Smartphone, Layers, BarChart3, AlertTriangle, ArrowRight } from 'lucide-react';
import { apiData } from '../../../../lib/api-data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import type { PromoterSummaryData } from '../../../../components/console/promoter/PromoterDashboard';

export default function CrimFigAdNetworkDashboardPage() {
  const [summary, setSummary] = useState<PromoterSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiData<PromoterSummaryData>('/api/v1/analytics/promoter/summary?period=30d')
      .then((data) => {
        if (active) setSummary(data);
      })
      .catch(() => {
        if (active) setSummary(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const needsSetup =
    !loading &&
    summary &&
    (summary.adNetwork.activeWebsitesCount === 0 || summary.adNetwork.activeSlotsCount === 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
              CrimFig Ad Network — Dashboard
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Manage registered websites, mobile apps, network ad slots, readiness status, and attributable network performance.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button asChild variant="outline" size="sm">
              <Link href="/reports?workspace=promoter">
                <BarChart3 size={14} /> Reports
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/promoter/ad-network/get-started">
                Get Started <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        </div>

        {needsSetup && (
          <Card style={{ borderColor: 'var(--color-warning)' }}>
            <CardContent style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <AlertTriangle size={18} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
                <span>
                  Complete domain verification, policy approval, and at least one verified active CrimFig Ad Network slot to start receiving network traffic (and unlock AdStation Direct Ad Slots on that website).
                </span>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/promoter/websites">Manage Websites &amp; Slots</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Card>
            <CardHeader style={{ padding: '18px 20px 6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Websites</span>
                <Globe size={16} style={{ color: 'var(--color-crimson)' }} />
              </div>
            </CardHeader>
            <CardContent style={{ padding: '0 20px 18px' }}>
              <div style={{ fontSize: '26px', fontWeight: 800 }}>
                {loading ? '—' : summary?.adNetwork.websitesCount ?? 0}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {summary?.adNetwork.activeWebsitesCount ?? 0} verified &amp; approved
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ padding: '18px 20px 6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Network Ad Slots</span>
                <Layers size={16} style={{ color: 'var(--color-crimson)' }} />
              </div>
            </CardHeader>
            <CardContent style={{ padding: '0 20px 18px' }}>
              <div style={{ fontSize: '26px', fontWeight: 800 }}>
                {loading ? '—' : summary?.adNetwork.slotsCount ?? 0}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {summary?.adNetwork.activeSlotsCount ?? 0} active
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ padding: '18px 20px 6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Mobile Apps</span>
                <Smartphone size={16} style={{ color: 'var(--color-crimson)' }} />
              </div>
            </CardHeader>
            <CardContent style={{ padding: '0 20px 18px' }}>
              <div style={{ fontSize: '26px', fontWeight: 800 }}>
                {loading ? '—' : summary?.adNetwork.appsCount ?? 0}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Registered app profiles
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ padding: '18px 20px 6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>30d Network Earnings</span>
                <Badge variant="secondary">Net</Badge>
              </div>
            </CardHeader>
            <CardContent style={{ padding: '0 20px 18px' }}>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-crimson)' }}>
                {loading ? '—' : `$${(summary?.earnings.netEarnedUsd ?? 0).toFixed(2)}`}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {(summary?.performance.impressions ?? 0).toLocaleString()} valid impressions · {(summary?.performance.clicks ?? 0).toLocaleString()} valid clicks
              </div>
            </CardContent>
          </Card>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: '15px' }}>Website Ad Slots</CardTitle>
              <CardDescription style={{ fontSize: '12px' }}>
                Verify domain ownership, configure embed snippets, and monitor placement health.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link href="/promoter/websites">Open Websites &amp; Slots</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: '15px' }}>Mobile App Profiles</CardTitle>
              <CardDescription style={{ fontSize: '12px' }}>
                Register mobile apps and track app-channel readiness.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link href="/promoter/mobile-apps">Open Mobile Apps</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: '15px' }}>Affiliate &amp; Creator Links</CardTitle>
              <CardDescription style={{ fontSize: '12px' }}>
                Review affiliate link eligibility, governance status, and traffic rules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link href="/promoter/individuals">Open Affiliate Links</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
