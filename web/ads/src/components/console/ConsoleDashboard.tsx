'use client';

import { dashboardData } from '../../lib/analytics-api';
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Eye,
  MousePointer,
  Hand,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface DashboardSummary {
  period: string;
  startDate: string;
  endDate: string;
  campaignCounts: {
    total: number;
    active: number;
    paused: number;
    underReview: number;
    draft: number;
  };
  creativeAlertCounts: {
    rejected: number;
    pendingReview: number;
  };
  financials: {
    totalBudgetUsd: number;
    totalSpentUsd: number;
    remainingBudgetUsd: number;
  };
  performance: {
    impressions: number;
    clicks: number;
    hovers: number;
    touches: number;
    ctr: number;
    avgCpmUsd: number;
    avgCpcUsd: number;
  };
}

interface TimeseriesPoint {
  date: string;
  impressions: number;
  clicks: number;
  hovers: number;
  touches: number;
  spendUsd: number;
}

interface ChannelBreakdown {
  channel: string;
  impressions: number;
  clicks: number;
  percentage: number;
}

interface AlertItem {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  actionLabel?: string;
  actionUrl?: string;
}

interface ConsoleDashboardProps {
  onNavigateToCampaigns: (statusFilter?: string) => void;
  onNavigateToPromoterHub: (section?: string) => void;
  onOpenCreateCampaign: () => void;
}

export function ConsoleDashboard({
  onNavigateToCampaigns,
  onNavigateToPromoterHub,
  onOpenCreateCampaign,
}: ConsoleDashboardProps) {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-09-10');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-10-10');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Replacement Modal state

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [timeseries, setTimeseries] = useState<TimeseriesPoint[]>([]);
  const [channelData, setChannelData] = useState<ChannelBreakdown[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setIsLoading(true); setError(null);
    void dashboardData(period).then(result => {
      if (active) { setSummary(result.summary); setTimeseries(result.timeseries); setChannelData(result.channels); setAlerts(result.alerts); }
    }).catch(err => { if (active) setError(err instanceof Error ? err.message : 'Analytics unavailable.'); })
      .finally(() => { if (active) setIsLoading(false); });
  return () => { active = false; };
  }, [period, attempt]);

  // Compute SVG coordinates for the area chart
  const maxImp = Math.max(...timeseries.map((p) => p.impressions), 100);
  const chartHeight = 160;
  const chartWidth = 720;

  const pointsString = timeseries
    .map((p, idx) => {
      const x = (idx / (timeseries.length - 1 || 1)) * chartWidth;
      const y = chartHeight - (p.impressions / maxImp) * (chartHeight - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  const areaString = `0,${chartHeight} ${pointsString} ${chartWidth},${chartHeight}`;

  if (isLoading) return <div role="status" className="theme-card" style={{ padding: 24 }}>Loading account analytics…</div>;
  if (error || !summary) return <div role="alert" className="theme-card" style={{ padding: 24 }}>
    <p>{error || 'Account analytics unavailable.'}</p><button onClick={() => setAttempt(value => value + 1)}>Retry analytics</button>
  </div>;


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* ──────────────────────────────────────────────────────────────────────────
          1. HEADER & WORKING TIMEFRAME FILTER BAR
          ────────────────────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.5px',
              margin: '0 0 4px',
            }}
          >
            Ads Console Dashboard
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Recorded account activity, including events pending verification. Use Billing for settled charges.
          </p>
        </div>

        {/* Timeframe Selector & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {(['7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: period === p ? 'var(--color-crimson)' : 'transparent',
                  color: period === p ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '3 Months' : 'Custom'}
              </button>
            ))}
          </div>

          {/* Custom Date Pickers when 'custom' is active */}
          {period === 'custom' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                }}
              />
            </div>
          )}

          <button
            type="button"
            onClick={onOpenCreateCampaign}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-crimson)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-crimson)',
            }}
          >
            <span>+ Create Ad</span>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. ACTIONABLE ALERTS STREAM
          ────────────────────────────────────────────────────────────────────────── */}
      {alerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                borderRadius: '12px',
                padding: '16px 20px',
                backgroundColor: alert.type === 'error' ? 'var(--color-error-bg)' : 'var(--color-warning-bg)',
                border: alert.type === 'error' ? '1px solid rgba(220, 38, 38, 0.25)' : '1px solid rgba(217, 119, 6, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AlertCircle
                  style={{
                    width: 20,
                    height: 20,
                    color: alert.type === 'error' ? 'var(--color-error)' : 'var(--color-warning)',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: alert.type === 'error' ? 'var(--color-error)' : 'var(--color-warning)',
                    }}
                  >
                    {alert.title}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {alert.message}
                  </div>
                </div>
              </div>

              {alert.actionLabel && (
                <button
                  type="button"
                  onClick={() => {
                    onNavigateToCampaigns(alert.type === 'error' ? 'rejected' : 'active');
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: alert.type === 'error' ? 'var(--color-error)' : 'var(--color-warning)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {alert.actionLabel}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          3. PRIMARY KPI SUMMARY CARDS
          ────────────────────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Card 1: Campaign budget used (lifetime) */}
        <div className="theme-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Campaign budget used (lifetime)</span>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
              Lifetime
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 4px' }}>
            ${summary.financials.totalSpentUsd.toFixed(2)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Remaining campaign budget: <strong style={{ color: 'var(--color-success)' }}>${summary.financials.remainingBudgetUsd.toFixed(2)}</strong>
          </div>
        </div>

        {/* Card 2: Impressions / Views */}
        <div className="theme-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Recorded Impressions</span>
            <Eye style={{ width: 16, height: 16, color: 'var(--color-crimson)' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 4px' }}>
            {summary.performance.impressions.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Budget-based CPM: <strong>${summary.performance.avgCpmUsd.toFixed(2)} USD</strong>
          </div>
        </div>

        {/* Card 3: Clicks & CTR */}
        <div className="theme-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Clicks & Conversion</span>
            <MousePointer style={{ width: 16, height: 16, color: 'var(--color-crimson)' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-crimson)', margin: '8px 0 4px' }}>
            {summary.performance.clicks.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            CTR: <strong>{summary.performance.ctr.toFixed(2)}%</strong> (Budget-based CPC: ${summary.performance.avgCpcUsd.toFixed(2)})
          </div>
        </div>

        {/* Card 4: Hovers & Touches (Granular Attribution) */}
        <div className="theme-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Hovers & Touches</span>
            <Hand style={{ width: 16, height: 16, color: '#3B82F6' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 4px' }}>
            {(summary.performance.hovers + summary.performance.touches).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {summary.performance.hovers.toLocaleString()} Desktop • {summary.performance.touches.toLocaleString()} Mobile Touch
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          4. TIMESERIES AREA CHART & CHANNEL BREAKDOWN
          ────────────────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Left: Engagement Area Chart */}
        <div className="theme-card" style={{ padding: '28px', gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                Engagement Timeseries
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Daily recorded impression volume and interaction pacing ({period.toUpperCase()})
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-crimson)' }} />
                <span>Impressions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-fig-dark)' }} />
                <span>Estimated spend ($)</span>
              </div>
            </div>
          </div>

          {/* SVG Smooth Curve Area Chart */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              style={{ width: '100%', height: '180px', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="crimsonAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4143A" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#D4143A" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid guide lines */}
              <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="var(--border-subtle)" strokeDasharray="4 4" />
              <line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="var(--border-subtle)" strokeDasharray="4 4" />
              <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="var(--border-subtle)" strokeDasharray="4 4" />

              {/* Shaded Area */}
              <polygon points={areaString} fill="url(#crimsonAreaGrad)" />

              {/* Top Trend Line */}
              <polyline
                points={pointsString}
                fill="none"
                stroke="var(--color-crimson)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points dots */}
              {timeseries.filter((_, i) => i % (period === '90d' ? 6 : 2) === 0).map((pt, idx) => {
                const x = (timeseries.indexOf(pt) / (timeseries.length - 1 || 1)) * chartWidth;
                const y = chartHeight - (pt.impressions / maxImp) * (chartHeight - 20) - 10;
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#FFFFFF"
                    stroke="var(--color-crimson)"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            <span>{timeseries[0]?.date}</span>
            <span>{timeseries[Math.floor(timeseries.length / 2)]?.date}</span>
            <span>{timeseries[timeseries.length - 1]?.date}</span>
          </div>
        </div>

        {/* Right: Channel Breakdown */}
        <div className="theme-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
              Channel Attribution
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 24px' }}>
              Audience acquisition distribution across network surfaces
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {channelData.map((ch, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-primary)' }}>{ch.channel}</span>
                    <span style={{ color: 'var(--color-crimson)' }}>{ch.percentage}%</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '9999px', backgroundColor: 'var(--badge-bg)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${ch.percentage}%`,
                        backgroundColor: idx === 0 ? 'var(--color-crimson)' : idx === 1 ? 'var(--color-fig-dark)' : '#3B82F6',
                        borderRadius: '9999px',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>{ch.impressions.toLocaleString()} views</span>
                    <span>{ch.clicks.toLocaleString()} clicks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Deferred Verification Cron:</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
              Not monitored here
            </span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          5. QUICK ACTIONS & STATUS DIRECTORY
          ────────────────────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        <div
          className="theme-card"
          style={{
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'border-color 0.15s ease',
          }}
          onClick={() => onNavigateToCampaigns()}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>Manage Campaigns</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              View performance tables, pause, or update creatives
            </div>
          </div>
          <ChevronRight style={{ width: 18, height: 18, color: 'var(--text-muted)' }} />
        </div>

        <div
          className="theme-card"
          style={{
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'border-color 0.15s ease',
          }}
          onClick={() => onNavigateToPromoterHub('websites')}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>Promoter Channels</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Website embed codes, Mobile SDKs & Reels consent
            </div>
          </div>
          <ChevronRight style={{ width: 18, height: 18, color: 'var(--text-muted)' }} />
        </div>

        <div
          className="theme-card"
          style={{
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'border-color 0.15s ease',
          }}
          onClick={() => onNavigateToPromoterHub('marketplace')}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>Ad Marketplace</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Browse active sponsor campaigns by category
            </div>
          </div>
          <ChevronRight style={{ width: 18, height: 18, color: 'var(--text-muted)' }} />
        </div>
      </div>


    </div>
  );
}
