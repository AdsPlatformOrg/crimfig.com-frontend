'use client';

import { ecosystemOrigin } from '../../../../../../shared/ui/origins';
import React, { useState, useEffect } from 'react';
import { dashboardSession } from '../../../lib/session';
import { apiData } from '../../../lib/api-data';
import { Shield, Globe, Smartphone, Share2, ExternalLink, CheckCircle2, Layers } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  const [profileUnavailable, setProfileUnavailable] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [staffRoles, setStaffRoles] = useState<string[] | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [workspaceRole, setWorkspaceRole] = useState<'advertiser' | 'promoter' | 'admin'>('advertiser');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ws = new URLSearchParams(window.location.search).get('workspace');
      if (ws === 'promoter' || ws === 'admin' || ws === 'advertiser') setWorkspaceRole(ws);
    }
    let active = true;
    async function loadIdentity() {
      try {
        setIsLoading(true);
        const [identity, promoterData, staff] = await Promise.all([
          dashboardSession().getProfile(),
          apiData<PromoterProfile | null>('/api/v1/promoters/profile/existing').catch(() => undefined),
          apiData<{ isStaff: boolean; roles: string[] }>('/api/v1/ecosystem/staff-status').catch(() => null),
        ]);
        if (active) {
          setUserId(identity.userId);
          setAvatarUrl(identity.avatar?.url ?? null);
          setProfile(promoterData ?? null);
          setProfileUnavailable(promoterData === undefined);
          setStaffRoles(staff ? (staff.isStaff && Array.isArray(staff.roles) ? staff.roles : []) : null);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Profile unavailable');
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void loadIdentity();
    return () => { active = false; };
  }, []);

  const authUrl = ecosystemOrigin('auth', process.env.NEXT_PUBLIC_AUTH_WEB_URL);
  const showPromoterProperties = workspaceRole === 'promoter' || Boolean(profile);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          User Profile
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: 0 }}>
          Account identity, security access, and registered properties.
        </p>
      </div>

      {error && (
        <div role="alert" style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* Compact Identity & Account Access Card */}
      <section className="theme-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {avatarUrl ? (
                // The account service supplies the same avatar URL used in the account menu.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="" width={52} height={52} style={{ objectFit: 'cover' }} onError={() => setAvatarUrl(null)} />
              ) : profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : 'CF'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {profile?.displayName || 'CrimFig Account'}
                </span>
                {userId && <Badge variant="outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} /> Verified Session
                </Badge>}
              </div>
              {userId && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={12} color="var(--color-crimson)" /> Single Sign-On Active
              </div>}
            </div>
          </div>

          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href={`${authUrl}/security`} target="_blank" rel="noreferrer">
              <span>Manage Security &amp; Password</span>
              <ExternalLink size={14} />
            </Link>
          </Button>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Account access &amp; security</h2>
          {isLoading ? (
            <p role="status" style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Loading access details…</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <li>Promoter profile: {profileUnavailable || error ? 'unavailable' : profile ? 'registered' : 'not registered'}</li>
              <li>Ads staff access: {staffRoles === null ? 'unavailable' : staffRoles.length ? staffRoles.join(', ') : 'not assigned'}</li>
              {userId && (
                <li style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  Account ID: <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>{userId}</code>
                </li>
              )}
            </ul>
          )}
        </div>
      </section>

      {/* Registered Properties / Workspace Shortcuts */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          {showPromoterProperties ? 'Registered properties' : 'Advertiser workspace'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '14px' }}>
          {showPromoterProperties ? (
            <>
              <Link href="/promoter/websites" className="theme-card" style={{ padding: '18px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Registered Websites</span>
                  <Globe size={18} color="var(--color-crimson)" />
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Manage websites, verification proofs, and ad slots.</p>
              </Link>
              <Link href="/promoter/mobile-apps" className="theme-card" style={{ padding: '18px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Mobile Apps</span>
                  <Smartphone size={18} color="var(--color-crimson)" />
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Manage iOS &amp; Android app registrations.</p>
              </Link>
              <Link href="/promoter/individuals" className="theme-card" style={{ padding: '18px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Affiliate Links</span>
                  <Share2 size={18} color="var(--color-crimson)" />
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>View affiliate link eligibility and governance status.</p>
              </Link>
            </>
          ) : (
            <Link href="/campaigns" className="theme-card" style={{ padding: '18px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>My Ad Campaigns</span>
                <Layers size={18} color="var(--color-crimson)" />
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Manage active campaigns, stacks, and ad creatives.</p>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
