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
            How CrimFig Protects Your Identity
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Experience how the authentication pipeline coordinates between applications, biometric MFA keys, and
            enterprise organization governance.
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
              <span>Universal SSO</span>
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
              <span>TOTP Multi-Factor</span>
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
              <span>Organization Workspaces</span>
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
                      OAuth2 Authorization Pipeline
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                      Cross-domain secure token negotiation with PKCE protection
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
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>SESSION STORAGE</span>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '4px', color: 'var(--text-primary)' }}>
                    HttpOnly Cookie
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                    SameSite=Strict · Secure · Inaccessible to XSS
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
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>API ACCESS TOKEN</span>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '4px', color: 'var(--text-primary)' }}>
                    In-Memory JWT
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                    15-minute TTL · Auto-refreshed invisibly
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
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>INTEGRATED SERVICES</span>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '4px', color: 'var(--text-primary)' }}>
                    5 Subdomains
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                    ads, billing, reels, stream, chat
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
                    One click logs you into all portals without re-entering credentials.
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
                      RFC 6238 TOTP Multi-Factor Protection
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                      Guaranteed protection against compromised passwords and phishing
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
                Includes 10 hashed, single-use emergency backup codes for offline recovery.
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
                      Multi-Tenant Organization Workspaces
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                      Collaborate on campaigns, billing wallets, and channels with role isolation
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
