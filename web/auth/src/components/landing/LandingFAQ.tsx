'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
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
      q: 'How does Two-Step Verification (2FA) and Passkey protection work?',
      a: 'We combine cryptographic Passkeys (biometrics) with time-based 2FA (Google Authenticator, Apple Passwords, Microsoft Authenticator, 1Password) and 10 emergency recovery codes to ensure your account remains impenetrable yet easily recoverable by you.',
    },
    {
      q: 'How are organization accounts different from personal accounts?',
      a: 'Personal accounts belong to you alone. Organization spaces allow teams, marketing studios, and developers to collaborate on campaigns and shared budgets securely, with role-scoped permissions and zero credential sharing.',
    },
    {
      q: 'What happens if I lose my device or access credentials?',
      a: 'You are supported by humane recovery workflows. In addition to emergency backup codes, our verified identity support team assists real account holders with empathy, ensuring you are never permanently locked out of your earned funds or campaigns.',
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
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp style={{ width: 18, height: 18, color: 'var(--color-crimson)' }} />
                  ) : (
                    <ChevronDown style={{ width: 18, height: 18, color: 'var(--text-muted)' }} />
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
