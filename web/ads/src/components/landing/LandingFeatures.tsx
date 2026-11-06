'use client';

import React from 'react';
import { Layers, ShieldCheck, BarChart3, Sparkles } from 'lucide-react';

export function LandingFeatures() {
  const features = [
    { icon: Layers, title: 'Flexible Ad Formats', description: 'Use images, GIFs and video creatives for your campaigns.', tag: 'Images • GIFs • Video' },
    { icon: ShieldCheck, title: 'Verified Publishers', description: 'Verify website ownership with DNS or HTML meta tags, then choose the categories you accept.', tag: 'Publisher controls' },
    { icon: BarChart3, title: 'Campaign Reporting', description: 'Review impressions, clicks and spend from your campaign dashboard.', tag: 'Performance in one place' },
  ];

  return (
    <section
      id="what-we-do"
      style={{
        padding: '64px 24px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
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
            <span>Campaign tools</span>
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
            From creative to campaign
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Create your ads, choose your audience and follow the results.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
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
