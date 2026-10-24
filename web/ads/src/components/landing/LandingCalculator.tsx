'use client';

import React, { useState } from 'react';
import { DollarSign, Sparkles, TrendingUp, ArrowRight, Calculator } from 'lucide-react';

interface LandingCalculatorProps {
  onStartEarning: () => void;
}

export function LandingCalculator({ onStartEarning }: LandingCalculatorProps) {
  const [channel, setChannel] = useState<'website' | 'app' | 'creator'>('website');
  const [monthlyImpressions, setMonthlyImpressions] = useState<number>(250000);
  const [ctrPercent, setCtrPercent] = useState<number>(2.5);

  // Financial baseline formulas (LOVE.md transparent 55/30/15 model):
  // 55% Promoters Pool: Shared among promoters based on verified ad slot performance
  // 30% CrimFig Base: Core platform margin, zero commissions or deductions
  // 15% Dynamic Pool: Absorbed fee buffer, Rewards Fund seed (10% default), and Marketer/Referral distribution
  const promoterShare = 0.55;
  const cpmRateUsd = channel === 'app' ? 2.5 : channel === 'creator' ? 3.0 : 1.8;
  const cpcRateUsd = channel === 'app' ? 0.25 : channel === 'creator' ? 0.30 : 0.2;

  const estimatedClicks = Math.round(monthlyImpressions * (ctrPercent / 100));
  const impressionEarnings = (monthlyImpressions / 1000) * cpmRateUsd * promoterShare;
  const clickEarnings = estimatedClicks * cpcRateUsd * promoterShare;
  const totalMonthlyEarningsUsd = Math.round(impressionEarnings + clickEarnings);
  const totalMonthlyEarningsNgn = totalMonthlyEarningsUsd * 1550; // Reference NGN rate

  return (
    <section
      id="calculator"
      style={{
        padding: '96px 24px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 56px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--color-crimson)',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '12px',
            }}
          >
            <Calculator style={{ width: 14, height: 14 }} />
            <span>Honest Revenue Simulator</span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.8px',
              margin: '0 0 16px',
            }}
          >
            Transparent Earnings Simulation
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Zero fabricated ROI. Model your potential earnings using our transparent revenue allocations (55% Publisher, 30% Creator, 15% Sustainability) before deploying a single line of code.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div
          style={{
            borderRadius: '24px',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xl)',
            padding: '40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Controls Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Channel Selection Toggle */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Your Primary Channel
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  backgroundColor: 'var(--bg-surface)',
                  padding: '4px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {[
                  { id: 'website' as const, label: 'Website' },
                  { id: 'app' as const, label: 'Mobile App' },
                  { id: 'creator' as const, label: 'Social / Reels' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setChannel(item.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      backgroundColor: channel === item.id ? 'var(--color-crimson)' : 'transparent',
                      color: channel === item.id ? '#FFFFFF' : 'var(--text-secondary)',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: Monthly Impressions */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Monthly Impressions / Views</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {monthlyImpressions.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="5000000"
                step="10000"
                value={monthlyImpressions}
                onChange={(e) => setMonthlyImpressions(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--color-crimson)',
                  cursor: 'pointer',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>10K views</span>
                <span>1M views</span>
                <span>5M views</span>
              </div>
            </div>

            {/* Slider 2: Click-Through Rate (CTR) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Audience Engagement (CTR)</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-crimson)' }}>
                  {ctrPercent.toFixed(1)}% ({estimatedClicks.toLocaleString()} clicks)
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.1"
                value={ctrPercent}
                onChange={(e) => setCtrPercent(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--color-crimson)',
                  cursor: 'pointer',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>0.5% (Conservative)</span>
                <span>3.0% (Average)</span>
                <span>8.0% (High Impact)</span>
              </div>
            </div>
          </div>

          {/* Revenue Display Card */}
          <div
            style={{
              borderRadius: '20px',
              padding: '36px 32px',
              background: 'var(--gradient-crimson)',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-crimson)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            <div>
              <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Simulated Partner Earnings
              </span>
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, margin: '8px 0 4px', letterSpacing: '-1px' }}>
                ${totalMonthlyEarningsUsd.toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                ≈ ₦{totalMonthlyEarningsNgn.toLocaleString()} NGN / month
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.15)',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Promoter Performance Share</span>
                <span style={{ fontWeight: 700 }}>55% Campaign Performance Pool</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Platform &amp; Growth</span>
                <span style={{ fontWeight: 700 }}>30% CrimFig Base • 15% Dynamic Pool</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Clearance Schedule</span>
                <span style={{ fontWeight: 700 }}>72-Hour Anti-Chargeback Hold</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onStartEarning}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                color: 'var(--color-crimson)',
                border: 'none',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-md)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
            >
              <span>View Promoter Console</span>
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
