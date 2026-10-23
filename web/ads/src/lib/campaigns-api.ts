import { apiData, arrayData, jsonBody } from './api-data';

export function campaignView(c: any) {
  if (typeof c?.id !== 'string' || typeof c.title !== 'string') throw new Error('Invalid campaign response.');
  return {
    ...c, category: c.category ?? 'General', channels: c.channels ?? [],
    budgetUsd: (c.budgetUsdCents ?? 0) / 100,
    spentUsd: ((c.budgetUsdCents ?? 0) - (c.remainingBudgetUsdCents ?? c.budgetUsdCents ?? 0)) / 100,
    cpcUsd: (c.costPerClickUsdCents ?? 0) / 100, cpmUsd: (c.costPerImpressionUsdCents ?? 0) / 100,
    metricsLoaded: typeof c.impressionsCount === 'number' && typeof c.clicksCount === 'number',
    impressions: c.impressionsCount ?? 0, clicks: c.clicksCount ?? 0, hovers: c.hoversCount ?? 0, touches: c.touchesCount ?? 0,
    headline: c.headline ?? c.title, destinationUrl: c.destinationUrl ?? '',
  };
}
export function websiteView(site: any) {
  if (typeof site?.id !== 'string' || typeof site.domain !== 'string' || typeof site.verificationToken !== 'string') throw new Error('Invalid website response.');
  return { ...site, isVerified: site.verificationStatus === 'verified', lastPingAt: site.lastPingAt ?? 'No delivery evidence loaded', activePlacementCount: site.activePlacementCount ?? 0 };
}
export async function loadCampaigns(own: boolean) { return arrayData(await apiData(own ? '/api/v1/campaigns' : '/api/v1/campaigns/catalog')).map(campaignView); }
export async function loadWebsites() { return arrayData(await apiData('/api/v1/promoters/websites')).map(websiteView); }

export class CampaignWorkflowError extends Error {
  constructor(public readonly campaignId: string, message: string) { super(message); this.name = 'CampaignWorkflowError'; }
}
/** Each write is attempted once. A partial/ambiguous failure must be reconciled, never replayed as a new campaign. */
export async function createCampaignWorkflow(input: { title: string; budgetUsd: number; format: string; pricingModel: string }, creatives: any[]) {
  if (!['cpc', 'cpm'].includes(input.pricingModel)) throw new Error('This pricing model is not supported by the campaign API yet.');
  if (!input.title.trim() || !Number.isFinite(input.budgetUsd) || input.budgetUsd < 5 || !creatives.length) throw new Error('Provide a title, at least $5 budget and a creative.');
  const created = await apiData<any>('/api/v1/campaigns', jsonBody(input));
  if (typeof created?.id !== 'string' || !created.id) throw new Error('Campaign creation could not be confirmed. Refresh your campaign list before trying again.');
  try {
    for (const creative of creatives) {
      const saved = await apiData<any>(`/api/v1/campaigns/${encodeURIComponent(created.id)}/creatives`, jsonBody(creative));
      if (!saved?.id) throw new Error('Creative attachment could not be confirmed.');
    }
    await apiData(`/api/v1/campaigns/${encodeURIComponent(created.id)}/submit-review`, { method: 'POST' });
    return created.id;
  } catch {
    throw new CampaignWorkflowError(created.id, `Campaign ${created.id} was created, but creative attachment or review submission could not be confirmed. Refresh and reconcile this campaign before creating another one.`);
  }
}
export async function setCampaignStatus(id: string, status: 'active' | 'paused') {
  return apiData<any>(`/api/v1/campaigns/${encodeURIComponent(id)}/status`, { ...jsonBody({ status }), method: 'PUT' });
}
export async function registerWebsite(domain: string, verificationMethod: string) {
  const url = new URL(domain.includes('://') ? domain : `https://${domain}`);
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.search || url.hash || url.pathname !== '/') throw new Error('Enter an HTTPS website domain without a path or credentials.');
  return websiteView(await apiData('/api/v1/promoters/websites', jsonBody({ domain: url.hostname, url: url.origin, verificationMethod })));
}
export async function verifyWebsite(id: string) {
  const result = await apiData<any>(`/api/v1/verification/website/${encodeURIComponent(id)}`, { method: 'POST' });
  if (typeof result?.isVerified !== 'boolean' || !result.website) throw new Error('Verification could not be confirmed.');
  return { site: websiteView(result.website), error: result.errorMessage as string | null };
}
