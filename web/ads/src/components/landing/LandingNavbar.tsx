'use client';

import React from 'react';
import { ArrowRight, Sparkles, Layers, DollarSign, ShieldCheck } from 'lucide-react';
import { ThemeSwitcher } from '../ThemeSwitcher';

interface LandingNavbarProps {
  onLaunchConsole: (defaultRole?: 'advertiser' | 'promoter') => void;
}

export function LandingNavbar({ onLaunchConsole }: LandingNavbarProps) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--gradient-crimson)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '19px',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-crimson)',
              letterSpacing: '-0.5px',
            }}
          >
            CF
          </div>
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: '19px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-primary)',
                letterSpacing: '-0.3px',
              }}
            >
              CrimFig <span style={{ color: 'var(--color-crimson)' }}>Ads</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-crimson)',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Network
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
              Performance Advertising & 3-Tier Publishing
            </p>
          </div>
        </div>

        {/* Navigation Anchor Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '28px',
            fontSize: '14px',
            fontWeight: 500,
          }}
          className="landing-nav-links"
        >
          <a
            href="#what-we-do"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-crimson)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
          >
            What We Do
          </a>
          <a
            href="#partners"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-crimson)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
          >
            Publishers & Promoters
          </a>
          <a
            href="#calculator"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-crimson)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
          >
            Earnings Calculator
          </a>
          <a
            href="#technology"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-crimson)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
          >
            Technology
          </a>
        </nav>

        {/* Action Controls & Launch Console */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <ThemeSwitcher />

          <button
            type="button"
            onClick={() => onLaunchConsole('advertiser')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              background: 'var(--gradient-crimson)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-crimson)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
          >
            <span>Launch Console</span>
            <ArrowRight style={{ width: 15, height: 15 }} />
          </button>
        </div>
      </div>
    </header>
  );
}
