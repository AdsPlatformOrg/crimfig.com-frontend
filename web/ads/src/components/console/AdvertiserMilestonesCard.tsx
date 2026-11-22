'use client';

import { useEffect, useRef, useState } from 'react';
import { Award, CheckCircle2, Coins, Trophy } from 'lucide-react';
import { sessionFetch } from '../../lib/session';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import styles from './AdvertiserMilestonesCard.module.css';

interface MilestoneDefinition {
  tier: string;
  title: string;
  requirement: string;
  state: string;
  claimed?: boolean;
  isPrestige?: boolean;
  cumulativeSpendTargetCents?: number;
  bonusCreditCents?: number;
  maxPromoterEarningsCents?: number;
}

interface Rewards {
  policyVersion: string;
  evaluatedAt: string;
  monetaryProgram: {
    status: string;
    bonusClaimsEnabled?: boolean;
    bonusDeliveryEnabled?: boolean;
    promotionalReserveAvailableCents?: number;
    reason: string;
  };
  progress: {
    totalCampaigns: number;
    completedCampaignsAwaitingVerification: number;
    verifiedCompletedCampaigns: number | null;
    eligibleClearedSpendCents: number | null;
    tenureMonths?: number;
    complianceClean?: boolean;
    explanation: string;
  };
  definitions: MilestoneDefinition[];
  badges?: { id: string; tier: string; achievedAt: string; state: string }[];
  bonusWallet?: {
    availableBonusCreditCents: number;
    reservedBonusCreditCents: number;
    consumedBonusCreditCents: number;
    lifetimeClaimedCents: number;
    lifetimeMaxCents: number;
    claims: {
      id: string;
      milestoneId: string;
      creditCents: number;
      remainingCreditCents: number;
      reservedCreditCents: number;
      consumedCreditCents: number;
      state: string;
      claimedAt: string;
    }[];
  };
  achievements: {
    id: string;
    badgeTitle: string;
    achievedAt: string;
    bonusCreditCents: number;
    bonusCreditRemainingCents: number;
    creditExpiresAt: string | null;
    isClawedBack: boolean;
    status: string;
  }[];
}

const usd = (cents: number) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);

const milestoneStates: Record<string, string> = {
  CLAIMED: 'Credit claimed',
  CLAIMABLE: 'Ready to claim',
  EARNED: 'Earned Badge',
  QUALIFIED: 'Qualification verified',
  IN_PROGRESS: 'In Progress',
  PENDING_CLEARANCE: 'Pending verification',
  LOCKED: 'Locked',
};

export function AdvertiserMilestonesCard() {
  const [rewards, setRewards] = useState<Rewards>();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [claimingTier, setClaimingTier] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const claimRequestIds = useRef<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    setFailed(false);
    async function loadRewards() {
      try {
        const response = await sessionFetch('/api/v1/advertiser/milestones');
        if (!response.ok) throw new Error('Rewards request failed');
        const result = await response.json();
        const data = result.data;
        if (
          result.status !== 'success' ||
          !data?.progress ||
          !Array.isArray(data.definitions) ||
          !Array.isArray(data.achievements) ||
          !data.monetaryProgram
        ) {
          throw new Error('Rewards unavailable');
        }
        if (active) setRewards(data);
      } catch {
        if (active) setFailed(true);
      }
    }
    void loadRewards();
    return () => {
      active = false;
    };
  }, [attempt]);

  async function handleClaim(milestoneId: string) {
    if (!acceptTerms) {
      setClaimError('Please confirm the non-withdrawable Bonus Ad Credit terms above before claiming.');
      return;
    }
    setClaimError(null);
    setClaimSuccess(null);
    setClaimingTier(milestoneId);
    const requestId =
      claimRequestIds.current[milestoneId] ??
      (claimRequestIds.current[milestoneId] = crypto.randomUUID());

    try {
      const response = await sessionFetch('/api/v1/advertiser/milestones/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, requestId, acceptTerms: true }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.status !== 'success') {
        throw new Error(result?.message || `Claim failed (${response.status})`);
      }
      setRewards(result.data);
      setClaimSuccess(`Claimed bonus ad credit for ${milestoneId}. No deadline or expiry applies.`);
    } catch (e) {
      setClaimError(e instanceof Error ? e.message : 'Unable to claim bonus credit');
    } finally {
      setClaimingTier(null);
    }
  }

  return (
    <section className={styles.rewards} aria-labelledby="advertiser-rewards-heading">
      <header className={styles.header}>
        <div>
          <h1 id="advertiser-rewards-heading">Advertiser Rewards</h1>
          <p>Track your lifetime cleared cash spend milestones, Prestige badges, and Bonus Ad Credit ($3,320 max lifetime).</p>
        </div>
      </header>

      {failed && (
        <div role="alert">
          <p>Rewards status is temporarily unavailable.</p>
          <Button variant="outline" onClick={() => setAttempt(value => value + 1)}>
            Try again
          </Button>
        </div>
      )}
      {!rewards && !failed && <p role="status">Loading rewards status…</p>}

      {rewards && (
        <>
          <Card>
            <CardContent className={styles.content}>
              <h2>Milestone progress</h2>
              <dl className={styles.summary}>
                <div>
                  <dt>Campaigns</dt>
                  <dd>{rewards.progress.totalCampaigns}</dd>
                </div>
                <div>
                  <dt>Completed campaigns awaiting verification</dt>
                  <dd>{rewards.progress.completedCampaignsAwaitingVerification}</dd>
                </div>
                <div>
                  <dt>Verified completed campaigns</dt>
                  <dd>{rewards.progress.verifiedCompletedCampaigns ?? 'Pending verification'}</dd>
                </div>
                <div>
                  <dt>Eligible cumulative cleared cash spend</dt>
                  <dd>
                    {rewards.progress.eligibleClearedSpendCents === null
                      ? 'Pending verification'
                      : usd(rewards.progress.eligibleClearedSpendCents)}
                  </dd>
                </div>
                {rewards.bonusWallet && (
                  <>
                    <div>
                      <dt>Available Bonus Ad Credit</dt>
                      <dd>{usd(rewards.bonusWallet.availableBonusCreditCents)}</dd>
                    </div>
                    <div>
                      <dt>Reserved in Bonus Campaigns</dt>
                      <dd>{usd(rewards.bonusWallet.reservedBonusCreditCents)}</dd>
                    </div>
                    <div>
                      <dt>Lifetime Claimed</dt>
                      <dd>
                        {usd(rewards.bonusWallet.lifetimeClaimedCents)} / {usd(rewards.bonusWallet.lifetimeMaxCents)}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
              <p>{rewards.progress.explanation}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className={styles.content}>
              <h2>Bonus ad credit terms &amp; status</h2>
              <p>{rewards.monetaryProgram.reason}</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                />
                <span>
                  I accept that Bonus Ad Credit is non-withdrawable, non-transferable, never expires once claimed, and runs only on eligible unsold inventory after paid demand.
                </span>
              </label>
              {claimError && (
                <p role="alert" style={{ color: 'var(--color-crimson, #D4143A)', marginTop: 8 }}>
                  {claimError}
                </p>
              )}
              {claimSuccess && (
                <p role="status" style={{ marginTop: 8 }}>
                  {claimSuccess}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className={styles.content}>
              <h2>All 7 Milestones — A1–A4 &amp; Prestige Tiers</h2>
              <p>Permanent Prestige recognition plus one-time bonus ad credits across lifetime cumulative cleared cash spend.</p>
              <ul className={styles.list} role="list">
                {rewards.definitions.map(({
                  tier,
                  title,
                  requirement,
                  state,
                  isPrestige,
                  cumulativeSpendTargetCents,
                  bonusCreditCents,
                }) => (
                  <li key={tier} className={styles.trophy}>
                    <span className={styles.emblem}>
                      {isPrestige || tier.startsWith('PRESTIGE') ? (
                        <Trophy size={24} aria-hidden="true" />
                      ) : (
                        <Award size={24} aria-hidden="true" />
                      )}
                    </span>
                    <div className={styles.details}>
                      <h3>{title}</h3>
                      <p>{requirement}</p>
                      <p>
                        {typeof cumulativeSpendTargetCents === 'number'
                          ? `Target: ${usd(cumulativeSpendTargetCents)} cumulative cleared cash spend`
                          : null}
                        {typeof bonusCreditCents === 'number'
                          ? ` · Bonus Credit: ${usd(bonusCreditCents)}`
                          : null}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <Badge className={styles.status} variant="outline">
                        {milestoneStates[state] ?? 'Unavailable'}
                      </Badge>
                      {state === 'CLAIMABLE' && (
                        <Button
                          size="sm"
                          disabled={claimingTier === tier || !acceptTerms}
                          onClick={() => void handleClaim(tier)}
                        >
                          <Coins size={14} aria-hidden="true" style={{ marginRight: 6 }} />
                          {claimingTier === tier
                            ? 'Claiming…'
                            : `Claim ${typeof bonusCreditCents === 'number' ? usd(bonusCreditCents) : 'Credit'}`}
                        </Button>
                      )}
                      {state === 'CLAIMED' && (
                        <span style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle2 size={14} aria-hidden="true" /> Claimed
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {!!rewards.bonusWallet?.claims?.length && (
            <Card>
              <CardContent className={styles.content}>
                <h2>Claimed Bonus Ad Credits</h2>
                <ul className={styles.list}>
                  {rewards.bonusWallet.claims.map(claim => (
                    <li key={claim.id} className={styles.history}>
                      <div className={styles.details}>
                        <h3>
                          {rewards.definitions.find(d => d.tier === claim.milestoneId)?.title ?? claim.milestoneId}
                        </h3>
                        <p>
                          Claimed {new Date(claim.claimedAt).toLocaleDateString()} · Total {usd(claim.creditCents)} · Remaining{' '}
                          {usd(claim.remainingCreditCents)} · Reserved {usd(claim.reservedCreditCents)} · No expiry
                        </p>
                      </div>
                      <Badge variant="outline">{claim.state}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {!!rewards.badges?.length && (
            <Card>
              <CardContent className={styles.content}>
                <h2>Earned badges</h2>
                <ul className={styles.list}>
                  {rewards.badges.map(badge => (
                    <li key={badge.id} className={styles.history}>
                      <div className={styles.details}>
                        <h3>
                          {rewards.definitions.find(definition => definition.tier === badge.tier)?.title ??
                            'Advertiser achievement'}
                        </h3>
                        <p>First earned {new Date(badge.achievedAt).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="outline">
                        {badge.state === 'qualified'
                          ? 'Earned Badge'
                          : badge.state === 'revoked'
                            ? 'Eligibility revoked'
                            : 'Under review'}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {rewards.achievements.length > 0 && (
            <Card>
              <CardContent className={styles.content}>
                <h2>Legacy recorded awards</h2>
                <ul className={styles.list}>
                  {rewards.achievements.map(award => (
                    <li key={award.id} className={styles.history}>
                      <div className={styles.details}>
                        <h3>{award.badgeTitle}</h3>
                        <p>
                          {new Date(award.achievedAt).toLocaleDateString()} · Recorded award {usd(award.bonusCreditCents)}
                        </p>
                        <p>
                          Recorded remaining credit {usd(award.bonusCreditRemainingCents)}
                          {award.creditExpiresAt ? ' · Expires ' + new Date(award.creditExpiresAt).toLocaleDateString() : ''}
                        </p>
                      </div>
                      <Badge variant="outline">{award.isClawedBack ? 'Reversed · Review required' : 'Under review'}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          <p>Updated {new Date(rewards.evaluatedAt).toLocaleString()}</p>
        </>
      )}
    </section>
  );
}
