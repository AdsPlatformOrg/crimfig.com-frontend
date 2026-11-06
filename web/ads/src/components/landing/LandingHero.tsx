'use client';

import React from 'react';
import { ArrowRight, Sparkles, UserCheck } from 'lucide-react';
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
        padding: '64px 24px',
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
            <span>Advertising &amp; publishing</span>
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
            Reach your audience.{' '}
            <span
              style={{
                background: 'var(--gradient-crimson)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              Grow with CrimFig.
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
            Create campaigns, connect with publishers and creators, and track performance in one place.
          </p>

          {/* Dual Action CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '0',
            }}
          >
            <Button
              type="button"
              onClick={onStartAdvertising}
              size="lg"
            >
              <span>Start Advertising</span>
              <ArrowRight style={{ width: 17, height: 17 }} />
            </Button>

            <Button
              type="button"
              onClick={onBecomePromoter}
              variant="outline"
              size="lg"
            >
              <UserCheck style={{ width: 17, height: 17, color: 'var(--color-crimson)' }} />
              <span>Become a Promoter</span>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
