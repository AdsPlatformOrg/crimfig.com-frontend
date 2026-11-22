'use client';

import { useEffect, useState } from 'react';
import { Award, Trophy } from 'lucide-react';
import { sessionFetch } from '../../lib/session';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import styles from './AdvertiserMilestonesCard.module.css';

interface Rewards {
  policyVersion: string;
  evaluatedAt: string;
  monetaryProgram: { status: string; reason: string };
  progress: {
    totalCampaigns: number;
    completedCampaignsAwaitingVerification: number;
    verifiedCompletedCampaigns: number | null;
    eligibleClearedSpendCents: number | null;
    explanation: string;
  };
  definitions: { tier: string; title: string; requirement: string; state: string }[];
  badges?: { id: string; tier: string; achievedAt: string; state: string }[];
  achievements: {
    id: string; badgeTitle: string; achievedAt: string;
    bonusCreditCents: number; bonusCreditRemainingCents: number;
    creditExpiresAt: string | null; isClawedBack: boolean; status: string;
  }[];
}

const usd = (cents: number) => new Intl.NumberFormat(undefined, {
  style: 'currency', currency: 'USD',
}).format(cents / 100);
const milestoneStates: Record<string, string> = {
  EARNED: 'Earned Badge', QUALIFIED: 'Qualification verified', IN_PROGRESS: 'In Progress',
  PENDING_CLEARANCE: 'Pending verification', LOCKED: 'Locked',
};

export function AdvertiserMilestonesCard() {
  const [rewards, setRewards] = useState<Rewards>();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setFailed(false);
    async function loadRewards() {
      try {
        const response = await sessionFetch('/api/v1/advertiser/milestones');
        if (!response.ok) throw new Error('Rewards request failed');
        const result = await response.json();
        const data = result.data;
        if (result.status !== 'success' || !data?.progress || !Array.isArray(data.definitions)
          || !Array.isArray(data.achievements) || !data.monetaryProgram) throw new Error('Rewards unavailable');
        if (active) setRewards(data);
      } catch {
        if (active) setFailed(true);
      }
    }
    void loadRewards();
    return () => { active = false; };
  }, [attempt]);

  return (
    <section className={styles.rewards} aria-labelledby="advertiser-rewards-heading">
      <header className={styles.header}>
        <div>
          <h1 id="advertiser-rewards-heading">Advertiser Rewards</h1>
          <p>Track your campaign milestones and verified achievements.</p>
        </div>
      </header>
      {failed && <div role="alert">
        <p>Rewards status is temporarily unavailable.</p>
        <Button variant="outline" onClick={() => setAttempt(value => value + 1)}>Try again</Button>
      </div>}
      {!rewards && !failed && <p role="status">Loading rewards status…</p>}
      {rewards && <>
        <Card><CardContent className={styles.content}>
          <h2>Milestone progress</h2>
          <dl className={styles.summary}>
            <div><dt>Campaigns</dt><dd>{rewards.progress.totalCampaigns}</dd></div>
            <div><dt>Completed campaigns awaiting verification</dt><dd>{rewards.progress.completedCampaignsAwaitingVerification}</dd></div>
            <div><dt>Verified completed campaigns</dt><dd>{rewards.progress.verifiedCompletedCampaigns ?? 'Pending verification'}</dd></div>
            <div><dt>Eligible cleared spend</dt><dd>{rewards.progress.eligibleClearedSpendCents === null ? 'Pending verification' : usd(rewards.progress.eligibleClearedSpendCents)}</dd></div>
          </dl>
          <p>{rewards.progress.explanation}</p>
        </CardContent></Card>
        <Card><CardContent className={styles.content}>
          <h2>Badges and trophies</h2>
          <ul className={styles.list} role="list">
            {rewards.definitions.map(({ tier, title, requirement, state }) => (
              <li key={tier} className={styles.trophy}>
                <span className={styles.emblem}>{tier.startsWith('PRESTIGE') ? <Trophy size={24} aria-hidden="true" /> : <Award size={24} aria-hidden="true" />}</span>
                <div className={styles.details}><h3>{title}</h3><p>{requirement}</p></div>
                <Badge className={styles.status} variant="outline">{milestoneStates[state] ?? 'Unavailable'}</Badge>
              </li>
            ))}
          </ul>
        </CardContent></Card>
        {!!rewards.badges?.length && <Card><CardContent className={styles.content}>
          <h2>Earned badges</h2>
          <ul className={styles.list}>{rewards.badges.map(badge => <li key={badge.id} className={styles.history}>
            <div className={styles.details}><h3>{rewards.definitions.find(definition => definition.tier === badge.tier)?.title ?? 'Advertiser achievement'}</h3>
              <p>First earned {new Date(badge.achievedAt).toLocaleDateString()}</p></div>
            <Badge variant="outline">{badge.state === 'qualified' ? 'Earned Badge' : badge.state === 'revoked' ? 'Eligibility revoked' : 'Under review'}</Badge>
          </li>)}</ul>
        </CardContent></Card>}
        <Card><CardContent className={styles.content}>
          <h2>Bonus ad credit</h2>
          <p>{rewards.monetaryProgram.reason}</p>
        </CardContent></Card>
        <Card><CardContent className={styles.content}>
          <h2>Reward history</h2>
          {rewards.achievements.length === 0 ? <p>Your recorded awards will appear here.</p> : <ul className={styles.list}>
            {rewards.achievements.map(award => <li key={award.id} className={styles.history}>
              <div className={styles.details}>
                <h3>{award.badgeTitle}</h3>
                <p>{new Date(award.achievedAt).toLocaleDateString()} · Recorded award {usd(award.bonusCreditCents)}</p>
                <p>Recorded remaining credit {usd(award.bonusCreditRemainingCents)}{award.creditExpiresAt ? ' · Expires ' + new Date(award.creditExpiresAt).toLocaleDateString() : ''}</p>
              </div>
              <Badge variant="outline">{award.isClawedBack ? 'Reversed · Review required' : 'Under review'}</Badge>
            </li>)}
          </ul>}
          <p>Historical awards are being reconciled against credit records.</p>
        </CardContent></Card>
        <p>Updated {new Date(rewards.evaluatedAt).toLocaleString()}</p>
      </>}
    </section>
  );
}
