import { AdsDisputeItem, CreateDisputePayload } from '../types/disputes';

const API_BASE = process.env.NEXT_PUBLIC_ADS_API_URL || 'https://ads-api-production-d889.up.railway.app';

export async function fetchDisputes(role: 'advertiser' | 'promoter' = 'advertiser'): Promise<AdsDisputeItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/disputes?role=${role}`, {
      headers: { 'x-user-id': role === 'advertiser' ? 'demo-advertiser' : 'demo-promoter' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (err) {
    console.error('Failed to fetch disputes:', err);
  }

  // Fallback demo disputes
  if (role === 'advertiser') {
    return [
      {
        id: 'disp_001',
        openedBy: 'demo-advertiser',
        role: 'advertiser',
        scope: 'campaign',
        campaignId: 'camp_001',
        campaignTitle: 'CrimFig Cloud Infrastructure Launch',
        periodFrom: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
        periodTo: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
        reason: 'Unusual CTR spike (>25%) from specific publisher site without conversions',
        details: 'Observed 1,200 clicks within a 2-hour window originating from an unverified referral domain with zero session duration.',
        status: 'resolved_adjusted',
        outcome: 'Deep audit confirmed programmatic automated clicking. $42.50 credited back to campaign escrow.',
        adjustmentUsd: 42.5,
        resolvedBy: 'compliance-lead@crimfig.com',
        resolvedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        id: 'disp_002',
        openedBy: 'demo-advertiser',
        role: 'advertiser',
        scope: 'campaign',
        campaignId: 'camp_002',
        campaignTitle: 'Pan-African Tech Summit 2026',
        periodFrom: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        periodTo: new Date().toISOString().split('T')[0],
        reason: 'Duplicate conversion order IDs appearing in third-party analytics',
        details: 'Investigating discrepancy between Google Analytics 4 purchase count and pixel fires.',
        status: 'under_review',
        outcome: null,
        adjustmentUsd: null,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ];
  } else {
    return [
      {
        id: 'disp_003',
        openedBy: 'demo-promoter',
        role: 'promoter',
        scope: 'placement',
        placementId: 'site_techhub_01',
        periodFrom: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
        periodTo: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        reason: 'Appeal: Rapid clicks flagged during viral LinkedIn article traffic burst',
        details: 'Our featured article on Nigerian AI startups went viral on LinkedIn, generating legitimate sudden audience surges. Requesting unflagging of verified visitor interactions.',
        status: 'under_review',
        outcome: null,
        adjustmentUsd: null,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ];
  }
}

export async function createDispute(payload: CreateDisputePayload): Promise<AdsDisputeItem> {
  const res = await fetch(`${API_BASE}/api/v1/disputes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': payload.role === 'advertiser' ? 'demo-advertiser' : 'demo-promoter',
    },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    const json = await res.json();
    return json.data;
  }

  // Demo fallback
  return {
    id: `disp_${Date.now()}`,
    openedBy: payload.role === 'advertiser' ? 'demo-advertiser' : 'demo-promoter',
    ...payload,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
}
