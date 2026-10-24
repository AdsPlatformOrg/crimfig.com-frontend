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
      title: 'Websites & Independent Publishers',
      subtitle: 'Monetize with dignity • Sub-12KB embeds',
      badge: '55% Revenue Share',
      description:
        'Display non-intrusive, adaptive banners and cards that respect user reading flow. Validate domain ownership via DNS TXT or HTML meta tags with full creative veto power.',
      features: [
        'Responsive, device-caring ad units (728x90, 300x250, 160x600)',
        'Guaranteed 55% publisher revenue share',
        'Independent DNS/Meta verification without credential risks',
        'Complete control over displayed ad categories',
      ],
      ctaText: 'Partner Your Website',
    },
    {
      id: 'mobile_apps' as const,
      icon: Smartphone,
      title: 'Mobile App Developers',
      subtitle: 'Native SDK monetization in development',
      badge: 'Transparent Payouts',
      description:
        'Monetize your iOS and Android mobile games, utilities, and applications with native, privacy-preserving card and rewarded video placements.',
      features: [
        'Lightweight, battery-efficient SDK architecture',
        'Rewarded video & high-engagement respectful interstitials',
        'Transparent clearance timelines without surprise chargebacks',
        'Honest reporting without simulated engagement data',
      ],
      ctaText: 'Explore Mobile SDK',
    },
    {
      id: 'individuals' as const,
      icon: UserCheck,
      title: 'Creators & Village Voices',
      subtitle: 'Monetize your audience with genuine care',
      badge: 'Performance Share Pool',
      description:
        'Share verified HMAC-signed recommendations across Reels, bios, and communities. Zero spam—recommend products you believe in and earn from the 55% performance pool plus milestone rewards.',
      features: [
        'Cryptographically signed tamper-proof promoter share links',
        '1-Click consent for verified CrimFig Reels integration',
        'Real-time earnings tracking with transparent fees',
        'Direct creator advocacy and compassionate support',
      ],
      ctaText: 'Join as a Creator',
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
            <span>The Creator Village</span>
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
            People Over Transactions: 3 Ways to Partner
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Whether you run an independent blog, publish an indie utility, or speak to a dedicated creator audience, CrimFig honors your work with radical transparency and dignified rewards.
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
