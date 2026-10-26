'use client';

import React from 'react';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Zap, Globe, Smartphone, UserCheck, Play } from 'lucide-react';
import { Button } from '../ui/button';

interface LandingHeroProps {
  onStartAdvertising: () => void;
  onBecomePromoter: () => void;
}

export function LandingHero({ onStartAdvertising, onBecomePromoter }: LandingHeroProps) {
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '72px 24px 96px',
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Subtle radial background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(212, 20, 58, 0.08) 0%, rgba(212, 20, 58, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
          {/* Top Pill Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'var(--badge-bg)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '24px',
            }}
          >
            <Sparkles style={{ width: 14, height: 14, color: 'var(--color-crimson)' }} />
            <span>Built on Love &amp; Purpose • People Over Extractive Clicks</span>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success)',
              }}
            />
          </div>

          {/* Figma-Inspired Display Title */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-1.5px',
              color: 'var(--text-primary)',
              margin: '0 0 24px',
            }}
          >
            Empower human creators.{' '}
            <span
              style={{
                background: 'var(--gradient-crimson)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              Advertise with dignity and truth.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              margin: '0 auto 40px',
              maxWidth: '720px',
            }}
          >
            CrimFig Ads connects purposeful businesses with ethical website publishers and genuine social creators. We reject surveillance bloat and extractive dark patterns—offering ultra-lightweight embeds, absolute reporting honesty, and fair revenue splits that honor creator labor.
          </p>

          {/* Dual Action CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '48px',
            }}
          >
            <Button
              type="button"
              onClick={onStartAdvertising}
              size="lg"
            >
              <span>Advertise Purposefully</span>
              <ArrowRight style={{ width: 17, height: 17 }} />
            </Button>

            <Button
              type="button"
              onClick={onBecomePromoter}
              variant="outline"
              size="lg"
            >
              <UserCheck style={{ width: 17, height: 17, color: 'var(--color-crimson)' }} />
              <span>Monetize with Dignity</span>
            </Button>
          </div>

          {/* Social Proof Stats Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '24px',
              padding: '24px 32px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>&lt;12KB</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Device-Respecting Embeds</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-crimson)' }}>55 / 30 / 15</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>55% Promoters • 30% CrimFig • 15% Growth</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>100%</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Human Verified Impressions</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-success)' }}>$0.00</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Honest Base • Zero Fake ROI</div>
            </div>
          </div>
        </div>

        {/* Floating Live Ad Preview Simulation Card */}
        <div
          style={{
            marginTop: '56px',
            maxWidth: '920px',
            margin: '56px auto 0',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-elevated)',
            boxShadow: 'var(--shadow-xl)',
            overflow: 'hidden',
          }}
        >
          {/* Header of simulated browser/app window */}
          <div
            style={{
              padding: '12px 20px',
              backgroundColor: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px', fontFamily: 'monospace' }}>
                ads.crimfig.com/delivery/v1
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
              Creative Preview Only
            </div>
          </div>

          {/* Interactive Card Body showcasing multi-asset creative */}
          <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', backgroundColor: 'var(--color-crimson)', color: '#FFFFFF' }}>
                  SPONSORED
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '9999px', backgroundColor: 'var(--badge-bg)', color: 'var(--text-secondary)' }}>
                  Interactive Banner 300x250
                </span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px' }}>
                CrimFig HyperSpeed Cloud Infrastructure
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 20px' }}>
                Illustrative creative preview. No measured latency, availability SLA or hosting guarantee is offered here.
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <a
                  href="#calculator"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: 'var(--gradient-crimson)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  Explore Free Tier
                </a>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified by CrimFig</span>
              </div>
            </div>

            {/* Visual Multi-Media Graphic */}
            <div
              style={{
                borderRadius: '14px',
                padding: '24px',
                background: 'var(--gradient-dark)',
                color: '#FFFFFF',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>Multi-Channel Rollout</span>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'rgba(212, 20, 58, 0.3)', color: '#E31B45', fontWeight: 700 }}>
                  ACTIVE
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
                <div style={{ padding: '12px 8px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <Globe style={{ width: 20, height: 20, margin: '0 auto 6px', color: '#60A5FA' }} />
                  <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>Websites</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>Embed Code</div>
                </div>
                <div style={{ padding: '12px 8px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <Smartphone style={{ width: 20, height: 20, margin: '0 auto 6px', color: '#34D399' }} />
                  <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>Mobile Apps</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>Native SDK</div>
                </div>
                <div style={{ padding: '12px 8px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <Play style={{ width: 20, height: 20, margin: '0 auto 6px', color: '#F472B6' }} />
                  <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>Creators</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>Reels Links</div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Illustrative Performance</span>
                <span style={{ color: '#34D399', fontWeight: 600 }}>4.82% Example CTR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
