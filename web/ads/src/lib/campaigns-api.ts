import { apiData, arrayData, jsonBody } from './api-data';

export type AdType = 'text' | 'image' | 'video';

export interface CreativeDraftInput {
  adType: AdType;
  headline: string;
  bodyText?: string;
  ctaText: string;
  destinationUrl: string;
  adFormat: 'banner' | 'card' | 'video' | 'interstitial';
  mediaAssetId?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface StackDraftInput {
  name: string;
  geoMode: 'inherit' | 'global' | 'targeted';
  locations: string[];
  targetDevices: string[];
  targetHours: number[];
  ads: CreativeDraftInput[];
}

export interface CampaignDefaultsInput {
  title: string;
  description?: string;
  category?: string;
  channels?: string[];
  budgetUsd: number;
  dailyBudgetUsd?: number;
  costPerImpressionCents?: number;
  costPerClickCents?: number;
  pricingModel: 'cpm' | 'cpc';
  format: 'banner' | 'card' | 'video' | 'interstitial';
  targetDevices?: string[];
  targetHours?: number[];
  frequencyCapPerDay?: number;
  geoMode: 'global' | 'targeted';
  locations?: string[];
}

export interface CreationCapabilities {
  videoAuthoringEnabled: boolean;
  allowedVideoPlacements: string[];
  supportedAdTypes: AdType[];
}

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

export async function loadCreationCapabilities(): Promise<CreationCapabilities> {
  const data = await apiData<CreationCapabilities>('/api/v1/campaigns/creation-capabilities');
  return {
    videoAuthoringEnabled: Boolean(data?.videoAuthoringEnabled),
    allowedVideoPlacements: Array.isArray(data?.allowedVideoPlacements) ? data.allowedVideoPlacements : [],
    supportedAdTypes: Array.isArray(data?.supportedAdTypes) ? data.supportedAdTypes : ['text', 'image'],
  };
}

export async function loadCampaignDetails(campaignId: string) {
  return apiData<any>(`/api/v1/campaigns/${encodeURIComponent(campaignId)}`);
}

export class CampaignWorkflowError extends Error {
  constructor(public readonly campaignId: string, message: string) { super(message); this.name = 'CampaignWorkflowError'; }
}

function assertDefaults(input: CampaignDefaultsInput) {
  if (!['cpc', 'cpm'].includes(input.pricingModel)) throw new Error('This pricing model is not supported by the campaign API yet.');
  if (!input.title.trim() || !Number.isFinite(input.budgetUsd) || input.budgetUsd < 5) throw new Error('Provide a title and at least $5 budget.');
  if (input.pricingModel === 'cpm' && (!Number.isFinite(input.costPerImpressionCents) || (input.costPerImpressionCents ?? 0) < 50)) throw new Error('Minimum CPM bid is $0.50.');
  if (input.pricingModel === 'cpc' && (!Number.isFinite(input.costPerClickCents) || (input.costPerClickCents ?? 0) < 10)) throw new Error('Minimum CPC bid is $0.10.');
  if (input.geoMode === 'targeted' && (!input.locations || input.locations.length === 0)) throw new Error('Choose at least one campaign location, or select Global.');
}

/** Each write is attempted once. A partial/ambiguous failure must be reconciled, never replayed as a new campaign. */
export async function createCampaignWorkflow(input: CampaignDefaultsInput, stacks: StackDraftInput[]) {
  assertDefaults(input);
  if (!Array.isArray(stacks) || stacks.length === 0) throw new Error('Add at least one ad stack.');
  for (const stack of stacks) {
    if (!stack.name.trim()) throw new Error('Each ad stack needs a name.');
    if (!stack.ads.length) throw new Error(`${stack.name} needs at least one ad.`);
    for (const ad of stack.ads) {
      if (!ad.headline.trim() || !ad.destinationUrl.trim()) throw new Error(`${stack.name} has an incomplete ad.`);
      if (ad.adType === 'image' && !ad.mediaAssetId) throw new Error(`${stack.name} has an image ad without an uploaded image.`);
      if (ad.adType === 'video' && !ad.mediaAssetId) throw new Error(`${stack.name} has a video ad without an uploaded video.`);
    }
  }

  const created = await apiData<any>('/api/v1/campaigns', jsonBody({
    title: input.title,
    description: input.description,
    category: input.category,
    channels: input.channels,
    budgetUsd: input.budgetUsd,
    dailyBudgetUsd: input.dailyBudgetUsd,
    costPerImpressionCents: input.costPerImpressionCents,
    costPerClickCents: input.costPerClickCents,
    pricingModel: input.pricingModel,
    format: input.format,
    targetDevices: input.targetDevices,
    targetHours: input.targetHours,
    frequencyCapPerDay: input.frequencyCapPerDay,
    geoMode: input.geoMode,
    locations: input.locations,
  }));
  if (typeof created?.id !== 'string' || !created.id) throw new Error('Campaign creation could not be confirmed. Refresh your campaign list before trying again.');

  const campaignId = created.id;
  try {
    let firstStackId: string | undefined = created.defaultStackId;
    if (!firstStackId) {
      const details = await loadCampaignDetails(campaignId);
      firstStackId = details?.adStacks?.[0]?.id;
    }
    if (!firstStackId) throw new Error('The campaign default stack could not be confirmed.');

    for (let index = 0; index < stacks.length; index += 1) {
      const stack = stacks[index];
      let stackId = index === 0 ? firstStackId : (await apiData<any>(`/api/v1/campaigns/${encodeURIComponent(campaignId)}/ad-stacks`, jsonBody({ name: stack.name.trim() })))?.id;
      if (!stackId) throw new Error(`${stack.name} could not be confirmed.`);

      await apiData(`/api/v1/campaigns/${encodeURIComponent(campaignId)}/ad-stacks/${encodeURIComponent(stackId)}`, {
        ...jsonBody({
          name: stack.name.trim(),
          geoMode: stack.geoMode,
          ...(stack.geoMode === 'targeted' ? { locations: stack.locations } : {}),
          ...(stack.targetDevices.length > 0 ? { targetDevices: stack.targetDevices } : {}),
          ...(stack.targetHours.length > 0 ? { targetHours: stack.targetHours } : {}),
        }),
        method: 'PATCH',
      });

      for (const ad of stack.ads) {
        const payload: Record<string, unknown> = {
          adStackId: stackId,
          adType: ad.adType,
          headline: ad.headline.trim(),
          bodyText: ad.bodyText?.trim() || undefined,
          ctaText: ad.ctaText.trim() || 'Learn More',
          destinationUrl: ad.destinationUrl.trim(),
          adFormat: ad.adFormat,
        };
        if (ad.mediaAssetId) payload.mediaAssetId = ad.mediaAssetId;
        const saved = await apiData<any>(`/api/v1/campaigns/${encodeURIComponent(campaignId)}/creatives`, jsonBody(payload));
        if (!saved?.id) throw new Error('Creative attachment could not be confirmed.');
      }
    }
    await apiData(`/api/v1/campaigns/${encodeURIComponent(campaignId)}/submit-review`, { method: 'POST' });
    return campaignId;
  } catch {
    throw new CampaignWorkflowError(campaignId, `Campaign ${campaignId} was created, but stack or creative attachment could not be confirmed. Refresh and reconcile this campaign before creating another one.`);
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
