'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { CrimFigLogo } from '../CrimFigLogo';

export function LandingNavbar() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand identity */}
        <CrimFigLogo
          variant="brand"
          size={42}
          app="Auth"
          appBadge="SSO"
          subtext="Central Identity, Passkeys & Enterprise MFA"
          href="/"
        />

        {/* Navigation Anchor Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '28px',
            fontSize: '14px',
            fontWeight: 500,
          }}
          className="auth-nav-desktop"
        >
          <a
            href="#features"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-crimson)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
          >
            Capabilities
          </a>
          <a
            href="#security"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-crimson)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
          >
            Security & MFA
          </a>
          <a
            href="#oauth"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-crimson)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
          >
            Developer OAuth2
          </a>
          <a
            href="#faq"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-crimson)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
          >
            FAQ
          </a>
        </nav>

        {/* Action Controls & Sign In */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <ThemeSwitcher />

          <Link
            href="/login"
            style={{
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              textDecoration: 'none',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              transition: 'background-color 0.15s ease',
            }}
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              background: 'var(--gradient-crimson)',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 700,
              boxShadow: 'var(--shadow-crimson)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            <span>Create Account</span>
            <ArrowRight style={{ width: 15, height: 15 }} />
          </Link>
        </div>
      </div>
    </header>
  );
}
