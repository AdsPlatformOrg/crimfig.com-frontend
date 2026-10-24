'use client';

import React, { useState, useEffect } from 'react';
import { Award, Shield, Sparkles, CheckCircle2, Clock, Gift, ChevronRight, Loader2 } from 'lucide-react';
import { sessionFetch } from '../../lib/session';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface Achievement {
  id: string;
  tier: string;
  badgeTitle: string;
  badgeIcon: string;
  bonusCreditCents: number;
  bonusCreditRemainingCents: number;
  creditExpiresAt: string | null;
  qualifyingSpendCents: number;
  qualifyingCampaignCount: number;
  achievedAt: string;
}

export function AdvertiserMilestonesCard() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalBonusRemainingUsd, setTotalBonusRemainingUsd] = useState('0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setIsLoading(true);
      const res = await sessionFetch('/api/v1/advertiser/milestones');
      const data = await res.json();
      if (data.status === 'success') {
        setAchievements(data.data.achievements || []);
        setTotalBonusRemainingUsd(data.data.totalBonusCreditRemainingUsd || '0.00');
      }
    } catch {
      // Keep UI clean
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluate = async () => {
    try {
      setIsEvaluating(true);
      const res = await sessionFetch('/api/v1/advertiser/milestones/evaluate', { method: 'POST' });
      await res.json();
      loadAchievements();
    } catch {
      // Silent error fallback
    } finally {
      setIsEvaluating(false);
    }
  };

  const earnedTiers = new Set(achievements.map((a) => a.tier));

  const standardTiers = [
    {
      tier: 'A1_FIRST_CAMPAIGN',
      title: 'First Campaign',
      icon: '🛡️',
      bonus: '$5.00',
      req: '1 launched & compliant campaign',
    },
    {
      tier: 'A2_CONSISTENT',
      title: 'Consistent Advertiser',
      icon: '🥈',
      bonus: '$15.00',
      req: '>= 5 compliant campaigns, 0 strikes',
    },
    {
      tier: 'A3_GROWTH',
      title: 'Growth Advertiser',
      icon: '💎',
      bonus: '$50.00',
      req: '>= $500 spend across >= 10 campaigns',
    },
    {
      tier: 'A4_TRUSTED',
      title: 'Trusted Advertiser',
      icon: '👑',
      bonus: '$150.00',
      req: '>= $2,500 spend & 12 months tenure',
    },
  ];

  return (
    <Card style={{ padding: '0' }}>
      <CardHeader style={{ padding: '24px 28px 16px 28px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D97706',
              }}
            >
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CardTitle style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
                  Advertiser Milestones &amp; Prestige Badges
                </CardTitle>
                <Badge variant="outline" style={{ fontSize: '10px', color: '#D97706', borderColor: 'rgba(217, 119, 6, 0.3)' }}>
                  PLAN-0017
                </Badge>
              </div>
              <CardDescription style={{ fontSize: '12px', marginTop: '2px' }}>
                Unlock non-cash bonus ad credits funded strictly from the promotional budget ledger.
              </CardDescription>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: 500 }}>Bonus Ad Credit</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-success)' }}>
                ${totalBonusRemainingUsd} USD
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEvaluate}
              disabled={isEvaluating}
            >
              {isEvaluating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Check Status</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent style={{ padding: '24px 28px' }}>
        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {standardTiers.map((t) => {
            const isEarned = earnedTiers.has(t.tier);
            return (
              <div
                key={t.tier}
                className={`p-4 rounded-xl border transition relative overflow-hidden ${
                  isEarned
                    ? 'border-amber-400 bg-amber-50/20 dark:bg-amber-950/10 dark:border-amber-500/50'
                    : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{t.icon}</span>
                  {isEarned ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Locked</span>
                  )}
                </div>
                <h4 className="font-bold text-xs text-gray-900 dark:text-white">{t.title}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{t.req}</p>
                <div className="mt-3 pt-2 border-t border-gray-200/60 dark:border-gray-800 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">Bonus Credit</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">+{t.bonus} USD</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
