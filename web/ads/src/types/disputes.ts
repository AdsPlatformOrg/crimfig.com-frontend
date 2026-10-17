export interface AdsDisputeItem {
  id: string;
  openedBy: string;
  role: 'advertiser' | 'promoter';
  scope: 'campaign' | 'placement' | 'general';
  campaignId?: string | null;
  campaignTitle?: string | null;
  placementId?: string | null;
  periodFrom: string;
  periodTo: string;
  reason: string;
  details: string;
  status: 'open' | 'under_review' | 'resolved_upheld' | 'resolved_adjusted' | 'rejected';
  outcome?: string | null;
  adjustmentUsd?: number | null;
  resolvedBy?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
}

export interface CreateDisputePayload {
  role: 'advertiser' | 'promoter';
  scope: 'campaign' | 'placement' | 'general';
  campaignId?: string;
  placementId?: string;
  periodFrom: string;
  periodTo: string;
  reason: string;
  details: string;
}
