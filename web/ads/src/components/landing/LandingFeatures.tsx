'use client';

import React from 'react';
import { Layers, ShieldCheck, Zap, BarChart3, Eye, MousePointer, Hand, Sparkles } from 'lucide-react';

export function LandingFeatures() {
  const features = [
    {
      icon: Layers,
      title: 'Dignified Creative Formats',
      description:
        'Upload high-definition JPG/PNG creatives, animated GIFs, or MP4 video reels. Non-coercive, elegant ad units designed to enhance, rather than disrupt, user reading flow.',
      tag: 'Images • GIFs • Video Reels',
    },
    {
      icon: Zap,
      title: 'Ultra-Lightweight Embed Runtimes',
      description:
        'Sub-12KB embed script engineered with deep care for publisher websites and user devices. Zero memory leaks, zero battery drain, and zero intrusive surveillance tracking.',
      tag: '<12KB • Device Respect',
    },
    {
      icon: ShieldCheck,
      title: 'Ethical Ownership Verification',
      description:
        'Verified via transparent DNS TXT records or HTML meta proofs. Respects publisher sovereignty without demanding sensitive credentials or intrusive server access.',
      tag: 'Publisher Sovereignty',
    },
    {
      icon: BarChart3,
      title: 'Absolute Transparency & Honest Metrics',
      description:
        'Zero fabricated clicks or bot surges. Track impressions, clicks, hovers, touches, and exact spend in real-time. Unadorned truth in every report.',
      tag: 'Zero Fake Traffic • Real People',
    },
    {
      icon: Eye,
      title: 'Ethical Niche Matching',
      description:
        'Publishers maintain full autonomy over ad categories displayed on their properties. Advertisers connect with genuine, receptive audiences who share common passions.',
      tag: 'Partner Autonomy',
    },
    {
      icon: Hand,
      title: 'Atomic Escrow & Payout Dignity',
      description:
        'Pre-funded advertiser escrows protect promoter earnings. 55% direct performance share to promoters, 30% CrimFig platform base, and 15% dynamic growth & rewards fund—with prompt 72-hour clearance schedules.',
      tag: '55% Promoters • 30% CrimFig • 15% Growth',
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
            <span>Built on Love &amp; Mutual Dignity</span>
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
            Ethical Tools for Meaningful Reach
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Everything you need to connect with genuine human audiences or sustainably monetize your digital properties with respect, transparency, and care.
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
