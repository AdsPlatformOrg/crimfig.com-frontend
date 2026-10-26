'use client';
import { sessionFetch } from '../../lib/session';

import React, { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, RefreshCw, Activity, ArrowUpRight, Ban } from 'lucide-react';
import { Button } from '../ui/button';

interface QualityData {
  promoterId: string;
  trustScore: number;
  isSuspended: boolean;
  suspensionReason: string | null;
  totalInteractions: number;
  validInteractions: number;
  invalidInteractions: number;
  invalidRatePct: number;
  status: 'good' | 'warning' | 'suspended';
}

interface QualityCardProps {
  apiBase: string;
}

export function PromoterQualityCard({ apiBase }: QualityCardProps) {
  const [data, setData] = useState<QualityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuality = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const res = await sessionFetch(`${apiBase}/api/v1/promoters/quality`);
      if (!res.ok) throw new Error('Quality telemetry could not be loaded.');
      const json = await res.json();
      if (!json.data || typeof json.data.trustScore !== 'number') throw new Error('Invalid quality response.');
      setData(json.data);
    } catch (err) { setData(null); setError(err instanceof Error ? err.message : 'Quality telemetry unavailable.'); }
    finally { setIsLoading(false); }
  }, [apiBase]);
  useEffect(() => { void fetchQuality(); }, [fetchQuality]);

  if (isLoading) {
    return (
      <div className="theme-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <RefreshCw style={{ width: 16, height: 16, animation: 'spin 1s linear infinite', color: 'var(--color-crimson)' }} />
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Loading quality &amp; trust telemetry...</span>
      </div>
    );
  }

  if (!data) return <div role="alert" className="theme-card" style={{ padding: 24 }}><p>{error || 'Quality telemetry unavailable.'}</p><Button type="button" onClick={fetchQuality} variant="outline" size="sm">Retry</Button></div>;

  const scoreColor = data.isSuspended
    ? 'var(--color-danger, #D4143A)'
    : data.trustScore >= 80
    ? '#10B981'
    : data.trustScore >= 50
    ? '#F59E0B'
    : 'var(--color-danger, #D4143A)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner / Status Alert */}
      {data.isSuspended ? (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            backgroundColor: 'rgba(212, 20, 58, 0.1)',
            border: '1px solid rgba(212, 20, 58, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Ban style={{ width: 20, height: 20, color: 'var(--color-crimson)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-crimson)' }}>
              Promoter Account Temporarily Suspended
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Reason: {data.suspensionReason || 'Compliance review pending. Please contact support.'}
            </div>
          </div>
        </div>
      ) : data.invalidRatePct > 5 ? (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <AlertTriangle style={{ width: 20, height: 20, color: '#F59E0B', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#F59E0B' }}>
              Elevated Invalid Traffic Detected
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {data.invalidRatePct}% of incoming clicks/impressions were flagged by anti-fraud heuristics. Placements with &gt;10% invalid rates are auto-throttled.
            </div>
          </div>
        </div>
      ) : null}

      {/* Grid of Key Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* Trust Score */}
        <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Ecosystem Trust Score</span>
            <ShieldCheck style={{ width: 16, height: 16, color: scoreColor }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: scoreColor }}>{data.trustScore}</span>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            Recomputed daily based on verified embed pings, domain age, and organic audience engagement.
          </p>
        </div>

        {/* Valid Traffic Rate */}
        <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Verified Valid Volume</span>
            <CheckCircle style={{ width: 16, height: 16, color: '#10B981' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {data.validInteractions.toLocaleString()}
            </span>
            <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>
              ({(100 - data.invalidRatePct).toFixed(1)}%)
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            Eligible for revenue distribution under the 55/30/15 ecosystem constants.
          </p>
        </div>

        {/* Filtered / Invalid Traffic */}
        <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Filtered Invalid Events</span>
            <Activity style={{ width: 16, height: 16, color: data.invalidRatePct > 5 ? '#F59E0B' : 'var(--text-muted)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {data.invalidInteractions.toLocaleString()}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              ({data.invalidRatePct}%)
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            Automated burst deduping (&lt;30s), headless bot crawlers, and self-referrals filtered out.
          </p>
        </div>
      </div>

      {/* Guidelines Card */}
      <div
        className="theme-card"
        style={{
          padding: '24px',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          How to Maintain a High Trust Score (≥ 80)
        </h4>
        <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li>Ensure embed codes are placed exclusively on your verified top-level domains.</li>
          <li>Never click your own ads or deploy automated testing scripts against production placements.</li>
          <li>Ensure ad containers adhere to IAB standard responsive heights without causing sudden layout shifts.</li>
          <li>Promoters with Trust Scores ≥ 90 receive priority placement matching and higher eCPM clearing auctions.</li>
        </ul>
      </div>
    </div>
  );
}
