'use client';

import React from 'react';
import { Layers, ShieldCheck, Zap, BarChart3, Eye, MousePointer, Hand, Sparkles } from 'lucide-react';

export function LandingFeatures() {
  const features = [
    {
      icon: Layers,
      title: 'Multi-Asset Media Formats',
      description:
        'Upload high-definition JPG/PNG creatives, animated GIFs, or MP4 video reels. Inline replacement for rejected creatives ensures continuous campaign uptime.',
      tag: 'Images • GIFs • Videos',
    },
    {
      icon: Zap,
      title: 'Publisher Delivery Planning',
      description:
        'Raw embed execution and interaction events are logged in an append-only stream with high-precision timestamps. Publisher performance and browser compatibility require installation testing.',
      tag: 'Performance Testing Pending',
    },
    {
      icon: ShieldCheck,
      title: 'Deferred Verification Engine',
      description:
        'Website ownership uses explicit DNS or HTML proof checks. Mobile verification and automatic review scheduling are not currently available.',
      tag: 'Fraud-Resistant Audits',
    },
    {
      icon: BarChart3,
      title: '5-Metric Granular Reporting',
      description:
        'Track impressions, clicks, mouse hovers, mobile touches, and exact spend in real-time. Fully customizable column visibility for your analytics tables.',
      tag: 'Hovers & Touches Included',
    },
    {
      icon: Eye,
      title: 'Category-Based Ad Targeting',
      description:
        'Promoters specify the categories of ads they want on their properties. Advertisers reach genuinely engaged niche audiences across Tech, Gaming, Lifestyle & Finance.',
      tag: 'Smart Matching',
    },
    {
      icon: Hand,
      title: 'Funded Campaign Escrow',
      description:
        'Campaign activation requires server-confirmed escrow. Publisher settlement and withdrawals remain unavailable pending financial verification.',
      tag: 'Secure Settlements',
    },
  ];

  return (
    <section
      id="what-we-do"
      style={{
        padding: '96px 24px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 64px' }}>
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
            <span>The CrimFig Advantage</span>
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
            Campaign Tools &amp; Publisher Planning
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Everything you need to launch high-converting advertising campaigns or monetize your digital properties with premium sponsored creatives.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
          }}
        >
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  padding: '32px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-crimson)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                }}
              >
                <div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--badge-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-crimson)',
                      marginBottom: '20px',
                    }}
                  >
                    <Icon style={{ width: 24, height: 24 }} />
                  </div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      margin: '0 0 10px',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      margin: '0 0 20px',
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-crimson)',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '16px',
                  }}
                >
                  {item.tag}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
