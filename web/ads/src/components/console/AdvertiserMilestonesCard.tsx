'use client';

import { useEffect, useState } from 'react';
import { Award, Crown, Medal, Trophy } from 'lucide-react';
import { sessionFetch } from '../../lib/session';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import styles from './AdvertiserMilestonesCard.module.css';

interface Rewards {
  achievements: { tier: string }[];
  totalBonusCreditRemainingUsd: string;
}

const milestones = [
  { tier: 'A1_FIRST_CAMPAIGN', title: 'First Campaign', icon: Award, bonus: '$5.00', requirement: 'Launch and complete an approved campaign with at least $5 in cleared spend.' },
  { tier: 'A2_CONSISTENT', title: 'Consistent Advertiser', icon: Medal, bonus: '$15.00', requirement: 'Complete five approved campaigns with no policy violations or chargebacks.' },
  { tier: 'A3_GROWTH', title: 'Growth Advertiser', icon: Trophy, bonus: '$50.00', requirement: 'Spend at least $500 across ten or more campaigns.' },
  { tier: 'A4_TRUSTED', title: 'Trusted Advertiser', icon: Crown, bonus: '$150.00', requirement: 'Spend at least $2,500 and reach 12 months as an advertiser.' },
];

export function AdvertiserMilestonesCard() {
  const [rewards, setRewards] = useState<Rewards>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadRewards() {
      try {
        const response = await sessionFetch('/api/v1/advertiser/milestones');
        if (!response.ok) throw new Error('Rewards request failed');
        const result = await response.json();
        if (result.status !== 'success') throw new Error('Rewards unavailable');
        if (active) setRewards(result.data);
      } catch {
        if (active) setFailed(true);
      }
    }

    void loadRewards();
    return () => { active = false; };
  }, []);

  const earnedTiers = new Set(rewards?.achievements.map((achievement) => achievement.tier));
  const highestTier = milestones.filter((milestone) => earnedTiers.has(milestone.tier)).pop();

  return (
    <section className={styles.rewards} aria-labelledby="advertiser-rewards-heading">
      <header className={styles.header}>
        <div>
          <h1 id="advertiser-rewards-heading">Advertiser Rewards</h1>
          <p>Earn trophies and bonus ad credit as you reach advertiser milestones.</p>
        </div>
        {rewards && (
          <div className={styles.summary}>
            <div>
              <span>Advertiser status</span>
              <strong>{highestTier?.title ?? 'Joined'}</strong>
            </div>
            <div>
              <span>Bonus ad credit</span>
              <strong>${rewards.totalBonusCreditRemainingUsd} USD</strong>
            </div>
          </div>
        )}
      </header>

      <Card>
        <CardContent className={styles.content}>
          <h2>Trophies</h2>
          {!rewards && <p role="status">{failed ? 'Rewards status is temporarily unavailable.' : 'Loading rewards status…'}</p>}
          <ul className={styles.list} role="list">
            {milestones.map(({ tier, title, icon: Icon, bonus, requirement }) => {
              const earned = earnedTiers.has(tier);
              return (
                <li key={tier} className={styles.trophy} data-earned={earned}>
                  <span className={styles.emblem}><Icon size={24} aria-hidden="true" /></span>
                  <div className={styles.details}>
                    <h3>{title}</h3>
                    <p>{requirement}</p>
                  </div>
                  <div className={styles.reward}>
                    {rewards && <Badge variant={earned ? 'secondary' : 'outline'}>{earned ? 'Unlocked' : 'Locked'}</Badge>}
                    <span>+{bonus} USD bonus credit</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
