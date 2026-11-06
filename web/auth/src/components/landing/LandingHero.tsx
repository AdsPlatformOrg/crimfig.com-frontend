'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export function LandingHero() {
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
      {/* Radial crimson glow */}
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
          {/* Badge */}
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
            <ShieldCheck style={{ width: 15, height: 15, color: 'var(--color-crimson)' }} />
            <span>CrimFig Account</span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-1.5px',
              color: 'var(--text-primary)',
              marginBottom: '24px',
            }}
          >
            One account.{' '}
            <span
              style={{
                background: 'var(--gradient-crimson)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Connected
            </span>{' '}
            across CrimFig.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: '720px',
              margin: '0 auto 40px',
            }}
          >
            Sign in to Ads and Billing, manage your account security, and work with your team.
          </p>

          {/* CTAs */}
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
            <Link
              href="/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 32px',
                borderRadius: '12px',
                background: 'var(--gradient-crimson)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 700,
                boxShadow: 'var(--shadow-crimson)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <span>Create Free Account</span>
              <ArrowRight style={{ width: 17, height: 17 }} />
            </Link>

            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 28px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                border: '1px solid var(--border-subtle)',
                fontSize: '15px',
                fontWeight: 600,
                transition: 'background-color 0.15s ease',
              }}
            >
              <KeyRound style={{ width: 17, height: 17, color: 'var(--color-crimson)' }} />
              <span>Sign In to SSO</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
