'use client';

import React, { useState, useEffect } from 'react';
import { dashboardSession } from '../../../lib/session';
import { apiData } from '../../../lib/api-data';
import { User, Shield, Globe, Smartphone, Share2, ExternalLink, Calendar, Mail, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface PromoterProfile {
  id: string;
  userId: string;
  type: string;
  displayName: string;
  allowedCategories?: string[];
  createdAt?: string;
}

export function UserProfileView() {
  const [profile, setProfile] = useState<PromoterProfile | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadIdentity() {
      try {
        setIsLoading(true);
        // Attempt to fetch promoter profile info
        const promoterData = await apiData<PromoterProfile>('/api/v1/promoters/profile').catch(() => null);
        if (active && promoterData) {
          setProfile(promoterData);
          setUserId(promoterData.userId);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Profile unavailable');
      } finally {
        if (active) setIsLoading(false);
      }
    }
    loadIdentity();
    return () => { active = false; };
  }, []);

  const authUrl = process.env.NEXT_PUBLIC_AUTH_WEB_URL || (process.env.NODE_ENV === 'production' ? 'https://auth.crimfig.com' : 'http://localhost:3000');

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          User Profile
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Manage your CrimFig account credentials, persona roles, and verified properties across the Ads ecosystem.
        </p>
      </div>

      {/* Main Profile Identity Card */}
      <div className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-crimson)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 800,
              boxShadow: 'var(--shadow-crimson)',
            }}
          >
            {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : 'CF'}
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {profile?.displayName || 'CrimFig Account User'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-success-bg)',
                  color: 'var(--color-success)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckCircle2 size={12} /> Verified Session
              </span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {userId && <span>ID: <code style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{userId}</code></span>}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={13} color="var(--color-crimson)" /> Single Sign-On Active
              </span>
            </div>
          </div>
          <Link
            href={`${authUrl}/dashboard`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--badge-bg)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'border-color 0.15s ease',
            }}
          >
            <span>Manage Security & Password</span>
            <ExternalLink size={14} />
          </Link>
        </div>

        {/* Roles & Personas */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0' }}>
            Ecosystem Personas & Roles
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-crimson)' }}></span>
                Advertiser Studio
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
                Create multi-format ads, set daily budgets, and target high-yield publisher placements.
              </p>
            </div>
            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></span>
                Publisher & Promoter Hub
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
                Monetize verified websites, mobile SDK traffic, and individual social reels.
              </p>
            </div>
            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-info)' }}></span>
                Financial Escrow & Billing
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
                Fund advertiser wallets, track escrow clearances, and request bank payouts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <Link
          href="/websites"
          className="theme-card"
          style={{ padding: '20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Registered Websites</span>
            <Globe size={18} color="var(--color-crimson)" />
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            Manage ad tags, DNS TXT verification, and placement health.
          </p>
        </Link>
        <Link
          href="/mobile_apps"
          className="theme-card"
          style={{ padding: '20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Mobile Applications</span>
            <Smartphone size={18} color="var(--color-crimson)" />
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            Inspect iOS & Android app-ads.txt compliance and app tokens.
          </p>
        </Link>
        <Link
          href="/individuals"
          className="theme-card"
          style={{ padding: '20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Reels & Social Links</span>
            <Share2 size={18} color="var(--color-crimson)" />
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            Automated social video distribution and promoter tracking tags.
          </p>
        </Link>
      </div>
    </div>
  );
}
