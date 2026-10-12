'use client';

import React from 'react';
import { Globe, Smartphone, UserCheck, CheckCircle2, ArrowRight, Code2, ShieldAlert, Sparkles } from 'lucide-react';

interface LandingPartnersProps {
  onJoinAsPromoter: (type: 'websites' | 'mobile_apps' | 'individuals') => void;
}

export function LandingPartners({ onJoinAsPromoter }: LandingPartnersProps) {
  const tiers = [
    {
      id: 'websites' as const,
      icon: Globe,
      title: 'Websites & Publishers',
      subtitle: 'Paste responsive embed code and start earning',
      badge: 'Webmasters',
      description:
        'Display adaptive banner ads, cards, and interstitial units across your web pages. Domain ownership is validated via DNS TXT record or HTML meta tag.',
      features: [
        'Responsive ad units (728x90, 300x250, 160x600)',
        'Asynchronous embed script with zero layout shift',
        'Auto-verification via deferred ping matching',
        'Filter out unwanted advertiser categories',
      ],
      ctaText: 'Register Website',
    },
    {
      id: 'mobile_apps' as const,
      icon: Smartphone,
      title: 'Mobile App Developers',
      subtitle: 'Integrate native Android & iOS ad placements',
      badge: 'SDK Ready',
      description:
        'Monetize your iOS and Android mobile games, utilities, and apps with native banner, card, and video interstitial placements with bundle ID verification.',
      features: [
        'Lightweight React Native & iOS/Android SDKs',
        'Rewarded video & high-engagement interstitials',
        'Transparent bundle ID ping verification',
        'High eCPM optimization by audience category',
      ],
      ctaText: 'Connect Mobile App',
    },
    {
      id: 'individuals' as const,
      icon: UserCheck,
      title: 'Creators & Social Promoters',
      subtitle: 'Share signed links on Reels, Bio, and Socials',
      badge: '1-Click Reels Consent',
      description:
        'No website needed. Get cryptographically signed share links to promote in your bio, post comments, and grant 1-click consent for automated Crimfig Reels monetization.',
      features: [
        'HMAC-signed tamper-proof promoter share links',
        '1-Click OAuth consent for Crimfig Reels placement',
        'Earn with every verified follower click and view',
        'Real-time earnings tracking in personal dashboard',
      ],
      ctaText: 'Start as Creator',
    },
  ];

  return (
    <section
      id="partners"
      style={{
        padding: '96px 24px',
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 64px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--color-crimson)',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '12px',
            }}
          >
            <Sparkles style={{ width: 14, height: 14 }} />
            <span>Monetization Channels</span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.8px',
              margin: '0 0 16px',
            }}
          >
            Partner with CrimFig: 3 Ways to Earn
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Whether you own a high-traffic news portal, publish an indie mobile app, or build an active social following, CrimFig Ads provides tailored tools to monetize your audience.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '32px',
          }}
        >
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.id}
                style={{
                  borderRadius: '20px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  padding: '36px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-crimson)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        backgroundColor: 'var(--badge-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-crimson)',
                      }}
                    >
                      <Icon style={{ width: 26, height: 26 }} />
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        backgroundColor: 'var(--badge-bg)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {tier.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                    {tier.title}
                  </h3>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-crimson)', marginBottom: '14px' }}>
                    {tier.subtitle}
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 24px' }}>
                    {tier.description}
                  </p>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onJoinAsPromoter(tier.id)}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-crimson)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: 'var(--shadow-crimson)',
                    transition: 'opacity 0.15s ease',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.92')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight style={{ width: 15, height: 15 }} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
