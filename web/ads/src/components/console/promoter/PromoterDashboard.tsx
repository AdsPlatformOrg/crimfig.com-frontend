'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Eye,
  MousePointer,
  Target,
  Globe,
  Share2,
  Sparkles,
  RefreshCw,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { apiData } from '../../../lib/api-data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

export interface PromoterSummaryData {
  period: string;
  startDate: string;
  endDate: string;
  earnings: {
    netEarnedUsd: number;
    clearedUsd: number;
    pendingUsd: number;
    reversedUsd: number;
    withdrawnUsd: number;
  };
  performance: {
    impressions: number;
    grossImpressions: number;
    clicks: number;
    grossClicks: number;
    ctr: number;
    acquisitions: number | null;
    acquisitionsSupported: boolean;
  };
  adNetwork: {
    websitesCount: number;
    activeWebsitesCount: number;
    appsCount: number;
    slotsCount: number;
    activeSlotsCount: number;
    directSlotsCount: number;
  };
  timeseries: Array<{
    date: string;
    impressions: number;
    clicks: number;
    earningsUsd: number;
  }>;
}

export function PromoterDashboard() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [summary, setSummary] = useState<PromoterSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = async (selectedPeriod: '7d' | '30d' | '90d') => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiData<PromoterSummaryData>(
        `/api/v1/analytics/promoter/summary?period=${selectedPeriod}`,
      );
      setSummary(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load Promoter Hub overview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSummary(period);
  }, [period]);

  if (loading && !summary) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[0, 1, 2, 3].map((idx) => (
            <div key={idx} className="cf-shimmer" style={{ height: '132px', borderRadius: '14px' }} />
          ))}
        </div>
        <div className="cf-shimmer" style={{ height: '260px', borderRadius: '14px' }} />
      </div>
    );
  }

  if (error && !summary) {
    return (
      <Card>
        <CardContent style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-error)' }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => void loadSummary(period)}>
            <RefreshCw size={14} /> Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const maxDailyImpressions = Math.max(
    1,
    ...(summary?.timeseries.map((point) => point.impressions) ?? [0]),
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Period Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Promoter Hub
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Central earnings and verified delivery overview across CrimFig Ad Network and AdStation.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {(['7d', '30d', '90d'] as const).map((option) => (
            <Button
              key={option}
              type="button"
              size="sm"
              variant={period === option ? 'default' : 'outline'}
              onClick={() => setPeriod(option)}
            >
              {option === '7d' ? '7 Days' : option === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 1: Earnings (Prominent first card) */}
        <Card style={{ borderColor: 'var(--color-crimson)' }}>
          <CardHeader style={{ padding: '18px 20px 6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-crimson)' }}>Earnings</span>
              <DollarSign size={16} style={{ color: 'var(--color-crimson)' }} />
            </div>
          </CardHeader>
          <CardContent style={{ padding: '0 20px 18px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 6px' }}>
              ${(summary?.earnings.netEarnedUsd ?? 0).toFixed(2)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Cleared: <strong>${(summary?.earnings.clearedUsd ?? 0).toFixed(2)}</strong> · Pending (72h hold):{' '}
              <strong>${(summary?.earnings.pendingUsd ?? 0).toFixed(2)}</strong>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Impressions */}
        <Card>
          <CardHeader style={{ padding: '18px 20px 6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Impressions</span>
              <Eye size={16} style={{ color: 'var(--color-crimson)' }} />
            </div>
          </CardHeader>
          <CardContent style={{ padding: '0 20px 18px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 6px' }}>
              {(summary?.performance.impressions ?? 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Valid attributable impressions
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Clicks */}
        <Card>
          <CardHeader style={{ padding: '18px 20px 6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Clicks</span>
              <MousePointer size={16} style={{ color: 'var(--color-crimson)' }} />
            </div>
          </CardHeader>
          <CardContent style={{ padding: '0 20px 18px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 6px' }}>
              {(summary?.performance.clicks ?? 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Valid attributable clicks · CTR: {(summary?.performance.ctr ?? 0).toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Acquisitions */}
        <Card>
          <CardHeader style={{ padding: '18px 20px 6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Acquisitions</span>
              <Target size={16} style={{ color: 'var(--color-crimson)' }} />
            </div>
          </CardHeader>
          <CardContent style={{ padding: '0 20px 18px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 6px' }}>
              {summary?.performance.acquisitionsSupported && summary.performance.acquisitions !== null
                ? summary.performance.acquisitions.toLocaleString()
                : 'Unavailable'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {summary?.performance.acquisitionsSupported
                ? 'Verified attributed conversions'
                : 'Conversion attribution not active for this account'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings & Payout Details + Timeseries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <Card>
          <CardHeader style={{ padding: '20px 24px 8px' }}>
            <CardTitle style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Daily Delivery Trend</CardTitle>
            <CardDescription style={{ fontSize: '12px', margin: '4px 0 0' }}>
              Valid impressions and earnings over the selected {period} window
            </CardDescription>
          </CardHeader>
          <CardContent style={{ padding: '8px 24px 20px' }}>
            {summary && summary.timeseries.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '140px', paddingTop: '12px' }}>
                {summary.timeseries.slice(-14).map((point) => {
                  const pct = Math.max(4, Math.round((point.impressions / maxDailyImpressions) * 100));
                  return (
                    <div
                      key={point.date}
                      title={`${point.date}: ${point.impressions} valid impressions, ${point.clicks} clicks, $${point.earningsUsd.toFixed(2)}`}
                      style={{
                        flex: 1,
                        height: `${pct}%`,
                        backgroundColor: point.impressions > 0 ? 'var(--color-crimson)' : 'var(--border-subtle)',
                        borderRadius: '4px 4px 0 0',
                        minWidth: '6px',
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '24px 0' }}>
                No valid delivery activity recorded in this period.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader style={{ padding: '20px 24px 8px' }}>
            <CardTitle style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Earnings Ledger Breakdown</CardTitle>
            <CardDescription style={{ fontSize: '12px', margin: '4px 0 0' }}>
              72-hour clearance hold, withdrawals, and invalid-traffic adjustments
            </CardDescription>
          </CardHeader>
          <CardContent style={{ padding: '8px 24px 20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Cleared &amp; Available</span>
              <strong>${(summary?.earnings.clearedUsd ?? 0).toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Pending (72h Clearance Hold)</span>
              <strong>${(summary?.earnings.pendingUsd ?? 0).toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Withdrawn ({period})</span>
              <strong>${(summary?.earnings.withdrawnUsd ?? 0).toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Reversed / Adjusted</span>
              <strong>${(summary?.earnings.reversedUsd ?? 0).toFixed(2)}</strong>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workspace Entry Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <Card>
          <CardContent style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>CrimFig Ad Network</span>
              <Globe size={16} style={{ color: 'var(--color-crimson)' }} />
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
              {summary?.adNetwork.activeWebsitesCount ?? 0} approved websites · {summary?.adNetwork.activeSlotsCount ?? 0} active network slots
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/promoter/ad-network">
                Open Ad Network <ArrowRight size={14} />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Get Started</span>
              <Sparkles size={16} style={{ color: 'var(--color-crimson)' }} />
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
              Set up Website or Mobile App ad slots, or review Affiliate Link terms.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/promoter/ad-network/get-started">
                View Setup Guide <ArrowRight size={14} />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>AdStation</span>
              <Share2 size={16} style={{ color: 'var(--color-crimson)' }} />
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
              {summary?.adNetwork.directSlotsCount ?? 0} Direct Ad Slots configured. Requires active Ad Network + manual approval.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/promoter/adstation">
                Open AdStation <ArrowRight size={14} />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

