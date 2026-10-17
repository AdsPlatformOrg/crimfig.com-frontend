'use client';

import React, { useState } from 'react';
import {
  Coins,
  Gift,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Tv,
  Layers,
  Users,
  Award,
  Wallet,
  TrendingUp
} from 'lucide-react';

interface LandingRewardsProps {
  onExploreRewards: () => void;
}

export function LandingRewards({ onExploreRewards }: LandingRewardsProps) {
  const [pointsSlider, setPointsSlider] = useState<number>(5000);
  const fxRate = 1550;
  const calculatedUsd = pointsSlider / 100;
  const calculatedNgn = calculatedUsd * fxRate;

  const rewardChannels = [
    {
      icon: Layers,
      title: 'Ads Network Monetization',
      source: 'CrimFig Ads Network',
      description: 'Webmasters, bloggers, and app developers earn rewards points on every verified ad impression, click, and user engagement across their traffic.',
      yieldRate: 'Up to 75% Publisher Share'
    },
    {
      icon: Tv,
      title: 'Creator Video & Reels Tips',
      source: 'CrimFig Stream & Social',
      description: 'Streamers and video creators receive community tip gifts and badges from live viewers. 100% of gift values convert directly to CF-Points.',
      yieldRate: 'Instant Settlement'
    },
    {
      icon: Users,
      title: 'Developer & User Referrals',
      source: 'Ecosystem Growth Protocol',
      description: 'Earn persistent points cashback whenever invited creators launch campaigns, fund wallets, or subscribe to premium developer tiers.',
      yieldRate: 'Lifetime Tier Residuals'
    }
  ];

  return (
    <section
      id="rewards"
      style={{
        padding: '80px 24px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 56px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(212, 20, 58, 0.08)',
              border: '1px solid rgba(212, 20, 58, 0.2)',
              color: 'var(--color-crimson)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '12px'
            }}
          >
            <Gift style={{ width: 14, height: 14 }} />
            CrimFig Rewards &amp; Creator Cashback
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: '0 0 16px',
            }}
          >
            Turn Ecosystem Engagement Into Real Bank Balance
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Rewards are not isolated loyalty points. Powered by our unified financial ledger, every point earned across Ads, Live Streaming, and Referrals settles directly to your wallet at a transparent peg: <strong>100 Points = $1.00 USD</strong>.
          </p>
        </div>

        {/* 3 Channel Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}
        >
          {rewardChannels.map((chan, idx) => {
            const Icon = chan.icon;
            return (
              <div
                key={idx}
                className="theme-card"
                style={{
                  padding: '28px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-page)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(212, 20, 58, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-crimson)',
                    }}
                  >
                    <Icon style={{ width: 20, height: 20 }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-success)', backgroundColor: 'var(--color-success-bg)', padding: '2px 8px', borderRadius: '9999px' }}>
                    {chan.yieldRate}
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {chan.source}
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 8px' }}>
                    {chan.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {chan.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Points to Cash Converter Box */}
        <div
          className="theme-card converter-grid"
          style={{
            borderRadius: '20px',
            backgroundColor: 'var(--bg-page)',
            border: '1px solid var(--border-subtle)',
            padding: '36px',
            boxShadow: 'var(--shadow-md)',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '32px',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Coins style={{ width: 20, height: 20, color: 'var(--color-crimson)' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Interactive Points-to-Cash Meter
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 24px', lineHeight: 1.6 }}>
              Select or slide your accumulated rewards points to calculate their immediate cash value. Once redeemed in your console, funds are immediately unlocked for withdrawal to your Nigerian bank.
            </p>

            {/* Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                <span>Points Accumulated:</span>
                <span style={{ color: 'var(--color-crimson)', fontSize: '16px' }}>{pointsSlider.toLocaleString()} CF-Points</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={pointsSlider}
                onChange={(e) => setPointsSlider(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-crimson)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>500 pts ($5)</span>
                <span>25,000 pts ($250)</span>
                <span>50,000 pts ($500)</span>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div
            style={{
              padding: '28px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Instant Redeemable Value
            </div>
            <div>
              <div style={{ fontSize: '38px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                ${calculatedUsd.toFixed(2)}{' '}
                <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-muted)' }}>USD</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-crimson)', marginTop: '4px' }}>
                ≈ ₦{calculatedNgn.toLocaleString('en-NG', { maximumFractionDigits: 0 })} NGN
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              1-Click Settlement into your main USD balance with zero commission or lock-in period.
            </div>

            <button
              type="button"
              onClick={onExploreRewards}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-crimson)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-crimson)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <Wallet style={{ width: 16, height: 16 }} />
              <span>Redeem in Console</span>
              <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 900px) {
          .converter-grid {
            grid-template-columns: 1.2fr 0.8fr !important;
          }
        }
      `}</style>
    </section>
  );
}
