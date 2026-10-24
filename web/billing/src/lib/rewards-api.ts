import { sessionFetch } from './session';

export interface RewardsMeData {
  availablePoints: number;
  pendingPoints: number;
  reservedPoints: number;
  usdValueEquivalent: string;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  isSuspended: boolean;
  badges: Array<{
    id: string;
    badgeKey: string;
    badgeTitle: string;
    badgeIcon: string;
    tier: number | null;
    achievedAt: string;
  }>;
  deferredEntitlements: Array<{
    id: string;
    rewardKey: string;
    pointsEntitled: number;
    badgeTitle: string;
    badgeIcon: string;
    status: string;
  }>;
  recentLedger: Array<{
    id: string;
    deltaPoints: number;
    state: string;
    activityCode: string;
    sourceRef: string;
    createdAt: string;
  }>;
}

export interface ReferralsMeData {
  code: string;
  clicksCount: number;
  signupsCount: number;
  qualifiedCount: number;
  referralsList: Array<{
    id: string;
    refereeId: string;
    status: string;
    channel: string | null;
    createdAt: string;
    qualifiedAt: string | null;
  }>;
}

export async function fetchRewardsData(): Promise<RewardsMeData> {
  const res = await sessionFetch('/api/v1/rewards/me');
  if (!res.ok) {
    throw new Error('Unable to load rewards data.');
  }
  return await res.json();
}

export async function fetchReferralsData(): Promise<ReferralsMeData> {
  const res = await sessionFetch('/api/v1/rewards/referrals/me');
  if (!res.ok) {
    throw new Error('Unable to load referrals data.');
  }
  return await res.json();
}

export async function redeemRewardsPoints(points: number, idempotencyKey: string) {
  const res = await sessionFetch('/api/v1/rewards/redeem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ points, idempotencyKey }),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Points redemption could not be processed.');
  }
  return await res.json();
}

export async function generateShareLink(channel: string, targetPath = '/') {
  const res = await sessionFetch('/api/v1/rewards/share-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel, targetPath }),
  });
  if (!res.ok) {
    throw new Error('Could not generate share link.');
  }
  return await res.json();
}
