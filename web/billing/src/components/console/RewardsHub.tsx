'use client';

import React, { useState, useEffect } from 'react';
import {
  Coins,
  Gift,
  Sparkles,
  Share2,
  Copy,
  Check,
  Award,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Loader2,
  Lock,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import {
  fetchRewardsData,
  fetchReferralsData,
  redeemRewardsPoints,
  generateShareLink,
  RewardsMeData,
  ReferralsMeData,
} from '../../lib/rewards-api';

interface RewardsHubProps {
  onReturnToWallet?: () => void;
  onRefreshWalletBalance?: () => void;
}

export function RewardsHub({ onReturnToWallet, onRefreshWalletBalance }: RewardsHubProps) {
  const [rewards, setRewards] = useState<RewardsMeData | null>(null);
  const [referrals, setReferrals] = useState<ReferralsMeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redemption state
  const [redeemPointsAmount, setRedeemPointsAmount] = useState<number>(1000);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  // Share link copy state
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isCreatingShare, setIsCreatingShare] = useState(false);
  const [customShareLink, setCustomShareLink] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [rewData, refData] = await Promise.all([
        fetchRewardsData(),
        fetchReferralsData(),
      ]);
      setRewards(rewData);
      setReferrals(refData);
    } catch (err: any) {
      setError(err?.message || 'Failed to load rewards details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCreateShare = async (channel: string) => {
    setIsCreatingShare(true);
    try {
      const res = await generateShareLink(channel);
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://billing.crimfig.com';
      const shareUrl = `${origin}/r/${res.shareCode}`;
      setCustomShareLink(shareUrl);
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch (err: any) {
      setError('Could not generate share link.');
    } finally {
      setIsCreatingShare(false);
    }
  };

  const handleRedeem = async () => {
    if (!rewards) return;
    if (rewards.availablePoints < redeemPointsAmount) {
      setRedeemError(`Insufficient points. You have ${rewards.availablePoints.toLocaleString()} available.`);
      return;
    }
    if (redeemPointsAmount < 1000) {
      setRedeemError('Minimum redemption is 1,000 points ($10.00 USD).');
      return;
    }

    setIsRedeeming(true);
    setRedeemError(null);
    setRedeemSuccess(null);

    try {
      const idempotencyKey = `red-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const res = await redeemRewardsPoints(redeemPointsAmount, idempotencyKey);
      setRedeemSuccess(`Successfully redeemed ${res.pointsRedeemed.toLocaleString()} points for $${(res.creditedUsdCents / 100).toFixed(2)} USD cash credit in your wallet!`);
      await loadData();
      if (onRefreshWalletBalance) onRefreshWalletBalance();
    } catch (err: any) {
      setRedeemError(err?.message || 'Redemption request failed.');
    } finally {
      setIsRedeeming(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
        <Loader2 style={{ width: 28, height: 28, color: 'var(--color-crimson)', animation: 'spin 0.75s linear infinite' }} />
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading Rewards Hub...</span>
      </div>
    );
  }

  if (error || !rewards) {
    return (
      <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', textAlign: 'center' }}>
        <AlertCircle style={{ width: 32, height: 32, color: 'var(--color-crimson)' }} />
        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{error || 'Rewards system temporarily unavailable'}</div>
        <button
          type="button"
          onClick={loadData}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-crimson)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const availableUsd = (rewards.availablePoints / 100).toFixed(2);
  const pendingUsd = (rewards.pendingPoints / 100).toFixed(2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'var(--color-crimson)',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Fund-Backed Rewards
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>100 Points = $1.00 USD</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Rewards Hub &amp; Growth Network
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '640px' }}>
            Earn fund-backed points through advertising performance, referrals, and ecosystem milestones. Redeem directly into your cash wallet.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            backgroundColor: 'var(--badge-bg)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw style={{ width: 14, height: 14 }} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Rewards Status Alert (if paused/suspended) */}
      {rewards.isSuspended && (
        <div style={{ padding: '14px 18px', borderRadius: '10px', backgroundColor: 'rgba(212,20,58,0.08)', border: '1px solid var(--color-crimson)', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-crimson)', fontSize: '13px', fontWeight: 600 }}>
          <Lock style={{ width: 18, height: 18 }} />
          <span>Account rewards activity is under review. Point accrual and redemptions are temporarily paused.</span>
        </div>
      )}

      {/* Primary Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Available Points */}
        <div
          className="theme-card"
          style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Available to Redeem</span>
            <Coins style={{ width: 18, height: 18, color: 'var(--color-crimson)' }} />
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-crimson)' }}>
              {rewards.availablePoints.toLocaleString()} <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>pts</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              ≈ ${availableUsd} USD Cash Backing
            </div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 'auto' }}>
            100% solvent. Backed 1:1 by real unallocated cash in the CrimFig Rewards Fund.
          </div>
        </div>

        {/* Pending Points (72h hold) */}
        <div
          className="theme-card"
          style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>In Clearance Hold (72h)</span>
            <ShieldCheck style={{ width: 18, height: 18, color: 'var(--text-muted)' }} />
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {rewards.pendingPoints.toLocaleString()} <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>pts</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '2px' }}>
              ≈ ${pendingUsd} USD Pending Hold
            </div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 'auto' }}>
            Cash reserved 1:1 in fund. Promoted automatically upon fraud/verification clearance.
          </div>
        </div>

        {/* Lifetime Earned & Redeemed */}
        <div
          className="theme-card"
          style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lifetime Activity</span>
            <TrendingUp style={{ width: 18, height: 18, color: 'var(--color-success)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lifetime Earned:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{rewards.lifetimeEarned.toLocaleString()} pts</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lifetime Redeemed:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{rewards.lifetimeRedeemed.toLocaleString()} pts</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Prestige Badges:</span>
              <strong style={{ color: 'var(--color-crimson)' }}>{rewards.badges.length} Unlocked</strong>
            </div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 'auto' }}>
            Points expire after 365 days of inactivity. Prestige badges are permanent.
          </div>
        </div>
      </div>

      {/* Redemption & Referral Action Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Redeem Card */}
        <div
          className="theme-card"
          style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Gift style={{ width: 20, height: 20, color: 'var(--color-crimson)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Redeem Points to Cash Wallet
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
            Convert available points directly into spendable or withdrawable USD cash in your <code>billing_wallets</code> account.
          </p>

          {redeemSuccess && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 style={{ width: 16, height: 16 }} />
              <span>{redeemSuccess}</span>
            </div>
          )}

          {redeemError && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(212,20,58,0.08)', color: 'var(--color-crimson)', fontSize: '12px', fontWeight: 600 }}>
              {redeemError}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Redemption Amount (100-pt increments)
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="number"
                step="100"
                min="1000"
                max={rewards.availablePoints || 1000}
                value={redeemPointsAmount}
                onChange={(e) => setRedeemPointsAmount(parseInt(e.target.value, 10) || 1000)}
                disabled={rewards.availablePoints < 1000 || isRedeeming}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-page)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', minWidth: '70px' }}>
                = ${(redeemPointsAmount / 100).toFixed(2)} USD
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={rewards.availablePoints < 1000 || isRedeeming || rewards.isSuspended}
            onClick={handleRedeem}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: rewards.availablePoints >= 1000 ? 'var(--color-crimson)' : 'var(--badge-bg)',
              color: rewards.availablePoints >= 1000 ? '#FFFFFF' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: rewards.availablePoints >= 1000 ? 'pointer' : 'not-allowed',
              boxShadow: rewards.availablePoints >= 1000 ? 'var(--shadow-crimson)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {isRedeeming ? <Loader2 style={{ width: 16, height: 16, animation: 'spin 0.75s linear infinite' }} /> : <Sparkles style={{ width: 16, height: 16 }} />}
            <span>{isRedeeming ? 'Redeeming...' : 'Confirm Redemption to Wallet'}</span>
          </button>
        </div>

        {/* Referrals & Share Card */}
        {referrals && (
          <div
            className="theme-card"
            style={{
              padding: '24px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Share2 style={{ width: 20, height: 20, color: 'var(--color-crimson)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Single-Level Referral Link
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Earn <strong>200 points ($2.00)</strong> for every qualified friend who signs up. Friends receive a <strong>50-point ($0.50)</strong> welcome bonus.
            </p>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-page)',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: 'var(--text-primary)',
                }}
              >
                {referrals.code}
              </div>
              <button
                type="button"
                onClick={() => handleCopyCode(referrals.code)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--badge-bg)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {copiedCode ? <Check style={{ width: 14, height: 14, color: 'var(--color-success)' }} /> : <Copy style={{ width: 14, height: 14 }} />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Share buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                disabled={isCreatingShare}
                onClick={() => handleCreateShare('whatsapp')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--badge-bg)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                disabled={isCreatingShare}
                onClick={() => handleCreateShare('x')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--badge-bg)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>X / Twitter</span>
              </button>
            </div>

            {/* Referral Stats Counters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{referrals.clicksCount}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Clicks</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{referrals.signupsCount}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Signups</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-success)' }}>{referrals.qualifiedCount}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Qualified</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Prestige Badges Showcase */}
      <div
        className="theme-card"
        style={{
          padding: '24px',
          borderRadius: '16px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Prestige Milestone Badges (Category A)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Permanent honors awarded for performance volume up to 1 Trillion impressions. Badges remain unlocked forever.
            </p>
          </div>
        </div>

        {rewards.badges.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', backgroundColor: 'var(--bg-page)', borderRadius: '12px', border: '1px dashed var(--border-subtle)' }}>
            <Award style={{ width: 28, height: 28, color: 'var(--text-muted)', margin: '0 auto 8px' }} />
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>No milestone badges unlocked yet</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Start sharing ads or running campaigns to unlock your first Bronze Pioneer badge!
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
            {rewards.badges.map((b) => (
              <div
                key={b.id}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-page)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{ fontSize: '24px' }}>{b.badgeIcon}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{b.badgeTitle}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Tier {b.tier ?? '—'} • {new Date(b.achievedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rewards Ledger History */}
      <div
        className="theme-card"
        style={{
          padding: '24px',
          borderRadius: '16px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Points Ledger History
        </h3>

        {rewards.recentLedger.length === 0 ? (
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
            No point transactions recorded yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rewards.recentLedger.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-page)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: item.deltaPoints > 0 ? 'var(--color-success-bg)' : 'rgba(212,20,58,0.08)',
                      color: item.deltaPoints > 0 ? 'var(--color-success)' : 'var(--color-crimson)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Coins style={{ width: 16, height: 16 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.activityCode}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {new Date(item.createdAt).toLocaleString()} • State: {item.state}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: item.deltaPoints > 0 ? 'var(--color-success)' : 'var(--color-crimson)',
                    }}
                  >
                    {item.deltaPoints > 0 ? `+${item.deltaPoints.toLocaleString()}` : item.deltaPoints.toLocaleString()} pts
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    ≈ ${(Math.abs(item.deltaPoints) / 100).toFixed(2)} USD
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
