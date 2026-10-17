'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export function LandingFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need separate logins for Ads, Billing, and Reels?',
      a: 'No. Your CrimFig account functions as a single unified identity across all present and future CrimFig subdomains. Once logged in, your active session seamlessly grants you access to Ads, Billing, Reels, Stream, and Chat.',
    },
    {
      q: 'How does Multi-Factor Authentication (MFA) work?',
      a: 'We implement standard RFC 6238 Time-Based One-Time Passwords (TOTP). You can scan a QR code using Google Authenticator, Apple Passwords, Authy, or 1Password. You also receive 10 single-use emergency recovery codes to guarantee you never lose access.',
    },
    {
      q: 'How are organization accounts different from personal accounts?',
      a: 'Personal accounts belong to an individual user. An Organization account allows businesses, marketing agencies, and developer teams to share ownership of campaigns and billing budgets without sharing personal passwords or credit cards.',
    },
    {
      q: 'What is the 3-Layer Hybrid Auth Model?',
      a: 'Unlike vulnerable web apps that store access tokens in localStorage (where malicious browser extensions and XSS can steal them), CrimFig uses HttpOnly SameSite=Strict cookies to maintain sessions and short-lived in-memory JWTs for API calls.',
    },
    {
      q: 'How can third-party apps integrate with CrimFig SSO?',
      a: 'We provide standard OAuth2 / OpenID Connect (OIDC) endpoints (/api/v1/oauth/authorize, /api/v1/oauth/token, /api/v1/oauth/userinfo) with PKCE (Proof Key for Code Exchange) support for mobile and Single Page Applications.',
    },
  ];

  return (
    <section
      id="faq"
      style={{
        padding: '96px 24px',
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
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
              marginBottom: '16px',
            }}
          >
            <HelpCircle style={{ width: 14, height: 14, color: 'var(--color-crimson)' }} />
            <span>Got Questions?</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.8px',
            }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '16px',
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp style={{ width: 18, height: 18, color: 'var(--color-crimson)' }} />
                  ) : (
                    <ChevronDown style={{ width: 18, height: 18, color: 'var(--text-muted)' }} />
                  )}
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 24px 20px',
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      lineHeight: 1.6,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
