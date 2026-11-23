'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';

export function LandingFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need separate logins for Ads, Billing, and Reels?',
      a: 'No. Your CrimFig account functions as a single unified identity across all present and future CrimFig portals. Once logged in, your active session seamlessly grants you access to Ads, Billing, Reels, Stream, and Chat—without redundant credential prompts.',
    },
    {
      q: 'Does CrimFig ever sell or broker my personal data or activity?',
      a: 'Never. In accordance with our core commitment to human dignity (LOVE.md), your data is treated as a sacred trust. We never sell your personal information, share tracking profiles with third-party ad brokers, or compromise your privacy for ad targeting.',
    },
    {
      q: 'When will Two-Step Verification (2FA) and Passkey protection be available?',
      a: 'Self-service Two-Step Verification (MFA) and Passkey support are coming soon. Today, CrimFig accounts are protected by verified email checks, rotating HTTP-only refresh tokens, device fingerprint verification, and password reset controls.',
    },
    {
      q: 'How will team workspaces work on CrimFig?',
      a: 'Role-based team workspaces and member invitations are coming soon, allowing organizations to collaborate cleanly without sharing personal login credentials.',
    },
    {
      q: 'What happens if I lose my device or forget my password?',
      a: 'You can reset your password anytime from the login screen via your verified email address, or contact CrimFig Support at support@crimfig.com if you need help recovering access to your account.',
    },
  ];

  return (
    <section
      id="faq"
      style={{
        padding: '64px 24px',
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
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
                <Button
                  type="button"
                  id={`auth-faq-trigger-${idx}`}
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  variant="ghost"
                  aria-expanded={isOpen}
                  aria-controls={`auth-faq-${idx}`}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    textAlign: 'left',
                    whiteSpace: 'normal',
                    height: 'auto',
                    minHeight: '56px',
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp style={{ width: 18, height: 18, flexShrink: 0, color: 'var(--color-crimson)' }} />
                  ) : (
                    <ChevronDown style={{ width: 18, height: 18, flexShrink: 0, color: 'var(--text-muted)' }} />
                  )}
                </Button>

                <div
                  id={`auth-faq-${idx}`}
                  role="region"
                  aria-labelledby={`auth-faq-trigger-${idx}`}
                  hidden={!isOpen}
                  style={{
                    padding: '0 24px 20px',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    lineHeight: 1.6,
                  }}
                >
                  {faq.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
