'use client';

import React from 'react';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';

interface LandingFooterProps {
  onLaunchConsole: (defaultRole?: 'advertiser' | 'promoter') => void;
}

export function LandingFooter({ onLaunchConsole }: LandingFooterProps) {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-page)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '64px 24px 32px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'var(--gradient-crimson)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '15px',
                  color: '#FFFFFF',
                }}
              >
                CF
              </div>
              <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text-primary)' }}>
                CrimFig <span style={{ color: 'var(--color-crimson)' }}>Ads</span>
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
              Next-generation advertising network and publisher monetization platform. Low latency, verifiable transparency, and global reach.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ThemeSwitcher />
            </div>
          </div>

          {/* Advertisers Col */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 16px' }}>
              For Advertisers
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li>
                <button
                  type="button"
                  onClick={() => onLaunchConsole('advertiser')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                >
                  Campaign Studio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onLaunchConsole('advertiser')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                >
                  Performance Dashboard
                </button>
              </li>
              <li>
                <a href="#what-we-do" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Asset Formats & Specs
                </a>
              </li>
              <li>
                <a href="https://billing-frontend-production-4256.up.railway.app" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Billing & Escrow <ExternalLink style={{ width: 12, height: 12 }} />
                </a>
              </li>
            </ul>
          </div>

          {/* Promoters Col */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 16px' }}>
              For Promoters
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li>
                <button
                  type="button"
                  onClick={() => onLaunchConsole('promoter')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                >
                  Website Embed Codes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onLaunchConsole('promoter')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                >
                  Mobile App SDK Setup
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onLaunchConsole('promoter')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                >
                  Creator Share Links
                </button>
              </li>
              <li>
                <a href="#calculator" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Earnings Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Ecosystem Col */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 16px' }}>
              CrimFig Ecosystem
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li>
                <a href="https://crimfig.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  CrimFig Hub <ExternalLink style={{ width: 12, height: 12 }} />
                </a>
              </li>
              <li>
                <a href="https://shop.crimfig.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  CrimFig Store <ExternalLink style={{ width: 12, height: 12 }} />
                </a>
              </li>
              <li>
                <a href="https://reels.crimfig.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  CrimFig Reels <ExternalLink style={{ width: 12, height: 12 }} />
                </a>
              </li>
              <li>
                <a href="https://auth.crimfig.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  CrimFig Single Sign-On <ExternalLink style={{ width: 12, height: 12 }} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>© 2026 CrimFig.com Inc. All rights reserved.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>System Latency: &lt;15ms</span>
            <span>•</span>
            <span>Deferred Audits: Active</span>
            <span>•</span>
            <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
