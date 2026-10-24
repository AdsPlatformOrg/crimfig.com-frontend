'use client';

import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Smartphone, Building2, Check, ArrowRight, Lock, Laptop } from 'lucide-react';

export function LandingSecurityDemo() {
  const [activeTab, setActiveTab] = useState<'sso' | 'mfa' | 'org'>('sso');

  return (
    <section
      id="security"
      style={{
        padding: '96px 24px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
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
              color: 'var(--color-crimson)',
              marginBottom: '16px',
            }}
          >
            <ShieldCheck style={{ width: 14, height: 14 }} />
            <span>Interactive Security Showcase</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.8px',
              marginBottom: '16px',
            }}
          >
            Digital Sanctuary &amp; Sovereign Control
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Your account is your private space. Explore how CrimFig guards your sovereign credentials, honors your consent, and keeps you in full control without third-party tracking.
          </p>

          {/* Tab Selector */}
          <div
            style={{
              display: 'inline-flex',
              padding: '4px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-page)',
              border: '1px solid var(--border-subtle)',
              marginTop: '16px',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('sso')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                backgroundColor: activeTab === 'sso' ? 'var(--color-crimson)' : 'transparent',
                color: activeTab === 'sso' ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
              }}
            >
              <KeyRound style={{ width: 15, height: 15 }} />
              <span>Single Sign-On (SSO)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('mfa')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                backgroundColor: activeTab === 'mfa' ? 'var(--color-crimson)' : 'transparent',
                color: activeTab === 'mfa' ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
              }}
            >
              <Smartphone style={{ width: 15, height: 15 }} />
              <span>Two-Step Verification</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('org')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                backgroundColor: activeTab === 'org' ? 'var(--color-crimson)' : 'transparent',
                color: activeTab === 'org' ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
              }}
            >
              <Building2 style={{ width: 15, height: 15 }} />
              <span>Team & Agency Workspaces</span>
            </button>
          </div>
        </div>

        {/* Demo Card Showcase */}
        <div
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            padding: '36px',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-page)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {activeTab === 'sso' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(212, 20, 58, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <KeyRound style={{ width: 20, height: 20, color: 'var(--color-crimson)' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      Unified Single Sign-On
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                      One account unlocks every service across the CrimFig ecosystem
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(22, 163, 74, 0.15)',
                    color: '#16A34A',
                  }}
                >
                  ACTIVE
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>FOR INDIVIDUALS</span>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '4px', color: 'var(--text-primary)' }}>
                    One Unified Profile
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                    Switch between Ads, Content & Billing without repeating logins
                  </p>
                </div>

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>FOR BUSINESSES</span>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '4px', color: 'var(--text-primary)' }}>
                    Team Workspaces
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                    Manage team permissions, campaigns, and budgets in one place
                  </p>
                </div>

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>CONNECTED HUBS</span>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '4px', color: 'var(--text-primary)' }}>
                    All 5 Platforms
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                    Ads, Billing, Reels, Stream, and Chat seamlessly unified
                  </p>
                </div>
              </div>

              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(212, 20, 58, 0.05)',
                  border: '1px solid rgba(212, 20, 58, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck style={{ width: 18, height: 18, color: 'var(--color-crimson)' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Sign in once to manage campaigns, monitor revenue, stream media, and interact across all platforms.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mfa' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(212, 20, 58, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Smartphone style={{ width: 20, height: 20, color: 'var(--color-crimson)' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      Two-Step Account Verification
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                      Add an extra layer of defense to protect your earnings, billing wallet, and brand assets
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(212, 20, 58, 0.15)',
                    color: 'var(--color-crimson)',
                  }}
                >
                  HIGH SECURITY
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '32px 20px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '24px',
                }}
              >
                {['8', '4', '2', '9', '1', '7'].map((digit, i) => (
                  <div
                    key={i}
                    style={{
                      width: '44px',
                      height: '52px',
                      borderRadius: '10px',
                      border: '2px solid var(--border-hover)',
                      backgroundColor: 'var(--bg-page)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      fontWeight: 800,
                      color: 'var(--color-crimson)',
                    }}
                  >
                    {digit}
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
                Includes 10 printable emergency backup codes so you always retain access to your account.
              </p>
            </div>
          )}

          {activeTab === 'org' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(212, 20, 58, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Building2 style={{ width: 20, height: 20, color: 'var(--color-crimson)' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      Team & Agency Workspaces
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                      Manage campaigns, advertising budgets, and creator channels with role-based access
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(37, 99, 235, 0.15)',
                    color: '#2563EB',
                  }}
                >
                  ENTERPRISE
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { role: 'Owner', desc: 'Full root privileges, billing control, organization deletion', color: 'var(--color-crimson)' },
                  { role: 'Admin', desc: 'Member management, API credentials, campaign approvals', color: '#2563EB' },
                  { role: 'Manager', desc: 'Campaign creation, creative publishing, budget monitoring', color: '#D97706' },
                  { role: 'Member', desc: 'Read-only analytics, promoter metrics, team viewer', color: '#16A34A' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--badge-bg)',
                        color: item.color,
                      }}
                    >
                      {item.role}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
