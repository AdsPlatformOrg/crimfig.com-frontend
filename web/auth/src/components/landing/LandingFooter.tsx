'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { CrimFigLogo } from '../CrimFigLogo';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '64px 24px 32px',
        color: 'var(--text-secondary)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand info */}
          <div style={{ maxWidth: '320px' }}>
            <CrimFigLogo
              variant="brand"
              size={32}
              app="Auth"
              style={{ marginBottom: '14px' }}
            />
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              High-throughput central identity, OAuth2 server, and enterprise multi-factor authentication for the
              CrimFig digital ecosystem.
            </p>
          </div>

          {/* Identity Links */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.5px' }}>
              Identity & Access
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li><Link href="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Sign In</Link></li>
              <li><Link href="/signup" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Create Account</Link></li>
              <li><Link href="/forgot-password" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Reset Password</Link></li>
              <li><Link href="/org/accept-invite" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Accept Org Invite</Link></li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.5px' }}>
              CrimFig Ecosystem
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li>
                <a href="https://ads.crimfig.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>CrimFig Ads</span>
                  <ArrowUpRight style={{ width: 12, height: 12 }} />
                </a>
              </li>
              <li>
                <a href="https://billing.crimfig.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>CrimFig Billing & Rewards</span>
                  <ArrowUpRight style={{ width: 12, height: 12 }} />
                </a>
              </li>
              <li>
                <a href="https://reels.crimfig.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>CrimFig Reels</span>
                  <ArrowUpRight style={{ width: 12, height: 12 }} />
                </a>
              </li>
              <li>
                <a href="https://stream.crimfig.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>CrimFig Stream</span>
                  <ArrowUpRight style={{ width: 12, height: 12 }} />
                </a>
              </li>
            </ul>
          </div>

          {/* Security & Compliance */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.5px' }}>
              Security Standards
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <li>• RFC 6749 OAuth2 with PKCE</li>
              <li>• RFC 6238 TOTP Multi-Factor</li>
              <li>• Argon2id Key Derivation</li>
              <li>• NDPA 2023 Privacy Compliant</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <span>© {currentYear} CrimFig Technologies. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Whitepaper</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
