import { ApiError } from '@crimfig/api-client';
import { allDay, inherited, type DailySchedule } from "./daily-schedule";
import { apiData, arrayData, jsonBody } from "./api-data";
import { adsApi } from './ads-api-client';
import type { CampaignRecord, AddCreativeInput } from '@crimfig/api-client/src/ads-operations';

export type AdType = "text" | "image" | "video";

export interface CreativeDraftInput {
  id?: string;
  adType: AdType;
  headline?: string;
  bodyText?: string;
  ctaText?: string;
  destinationUrl: string;
  adFormat: "banner" | "card" | "video" | "interstitial";
  mediaAssetId?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface StackDraftInput {
  id?: string;
  name: string;
  geoMode: "inherit" | "global" | "targeted";
  locations: string[];
  targetDevices: string[];
  targetHours: number[];
  schedule?: DailySchedule;
  ads: CreativeDraftInput[];
}

export interface CampaignDefaultsInput {
  title: string;
  description?: string;
  category?: string;
  channels?: ('websites' | 'individuals' | 'mobile_apps')[];
  budgetUsd: number;
  dailyBudgetUsd?: number | null;
  costPerImpressionCents?: number;
  costPerClickCents?: number;
  pricingModel: "cpm" | "cpc";
  format: "banner" | "card" | "video" | "interstitial";
  targetDevices?: string[];
  targetHours?: number[];
  schedule?: DailySchedule;
  requestId?: string;
  frequencyCapPerDay?: number;
  geoMode: "global" | "targeted";
  locations?: string[];
}

export interface CreationCapabilities {
  scheduleVersion?: number;
  imagePreparationEnabled?: boolean;
  geoTargetingEnabled: boolean;
  videoAuthoringEnabled: boolean;
  allowedVideoPlacements: string[];
  supportedAdTypes: AdType[];
}

export function campaignView<T extends Partial<CampaignRecord> & { id: string; title: string }>(c: T) {
  if (typeof c?.id !== "string" || typeof c.title !== "string")
    throw new Error("Invalid campaign response.");
  return {
    ...c,
    category: c.category ?? "General",
    channels: (() => { try { const value: unknown = c.channels ? JSON.parse(c.channels) : []; return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []; } catch { return []; } })(),
    budgetUsd: (c.budgetUsdCents ?? 0) / 100,
    spentUsd:
      ((c.budgetUsdCents ?? 0) -
        (c.remainingBudgetUsdCents ?? c.budgetUsdCents ?? 0)) /
      100,
    cpcUsd: (c.costPerClickUsdCents ?? 0) / 100,
    cpmUsd: (c.costPerImpressionUsdCents ?? 0) / 100,
    metricsLoaded:
      typeof c.impressionsCount === "number" &&
      typeof c.clicksCount === "number",
    impressions: c.impressionsCount ?? 0,
    clicks: c.clicksCount ?? 0,
    hovers: c.hoversCount ?? 0,
    touches: c.touchesCount ?? 0,
    headline: typeof c.headline === 'string' ? c.headline : c.title,
    destinationUrl: typeof c.destinationUrl === 'string' ? c.destinationUrl : '',
    imageUrl: typeof c.imageUrl === 'string' ? c.imageUrl : undefined,
    videoUrl: typeof c.videoUrl === 'string' ? c.videoUrl : undefined,
  };
}
export function websiteView(site: any) {
  if (
    typeof site?.id !== "string" ||
    typeof site.domain !== "string" ||
    typeof site.verificationToken !== "string"
  )
    throw new Error("Invalid website response.");
  return {
    ...site,
    isVerified: site.verificationStatus === "verified",
    verificationStatus: site.verificationStatus ?? (site.isVerified ? "verified" : "pending"),
    verificationErrorMessage: site.verificationErrorMessage ?? null,
    policyStatus: site.policyStatus ?? (site.verificationStatus === "verified" ? "testing" : "unverified"),
    lastPingAt: site.lastPingAt ?? "No delivery evidence loaded",
    activePlacementCount: site.activePlacementCount ?? 0,
  };
}
export type CampaignListItem = ReturnType<typeof campaignView<CampaignRecord>>;
export function loadCampaigns(own: true): Promise<CampaignListItem[]>;
export function loadCampaigns(own: false): Promise<ReturnType<typeof campaignView>[]>;
export async function loadCampaigns(own: boolean) {
  return own ? (await adsApi().listCampaigns()).map(campaign => campaignView(campaign)) :
    (await adsApi().catalog()).map(campaign => campaignView(campaign));
}
export async function loadWebsites() {
  return arrayData(await apiData("/api/v1/promoters/websites")).map(
    websiteView,
  );
}

export async function loadCreationCapabilities(): Promise<CreationCapabilities> {
  const data = await adsApi().capabilities();
  return {
    geoTargetingEnabled: data?.geoTargetingEnabled === true,
    scheduleVersion: data?.scheduleVersion,
    imagePreparationEnabled: data?.imagePreparationEnabled === true,
    videoAuthoringEnabled: Boolean(data?.videoAuthoringEnabled),
    allowedVideoPlacements: Array.isArray(data?.allowedVideoPlacements)
      ? data.allowedVideoPlacements
      : [],
    supportedAdTypes: Array.isArray(data?.supportedAdTypes)
      ? data.supportedAdTypes
      : ["text", "image"],
  };
}

export async function loadCampaignDetails(campaignId: string) {
  return adsApi().details(campaignId);
}

export class CampaignWorkflowError extends Error {
  constructor(
    public readonly campaignId: string,
    message: string,
    cause?:unknown,
  ) {
    super(message,{cause});
    this.name = "CampaignWorkflowError";
  }
}

function assertDefaults(input: CampaignDefaultsInput) {
  if (!["cpc", "cpm"].includes(input.pricingModel))
    throw new Error(
      "This pricing model is not supported by the campaign API yet.",
    );
  if (
    !input.title.trim() ||
    !Number.isFinite(input.budgetUsd) ||
    input.budgetUsd < 5
  )
    throw new Error("Provide a title and at least $5 budget.");
  if (
    input.pricingModel === "cpm" &&
    (!Number.isFinite(input.costPerImpressionCents) ||
      (input.costPerImpressionCents ?? 0) < 50)
  )
    throw new Error("Minimum CPM bid is $0.50.");
  if (
    input.pricingModel === "cpc" &&
    (!Number.isFinite(input.costPerClickCents) ||
      (input.costPerClickCents ?? 0) < 10)
  )
    throw new Error("Minimum CPC bid is $0.10.");
  if (
    input.geoMode === "targeted" &&
    (!input.locations || input.locations.length === 0)
  )
    throw new Error("Choose at least one campaign location, or select Global.");
}

/** Each write is attempted once. A partial/ambiguous failure must be reconciled, never replayed as a new campaign. */
export async function createCampaignWorkflow(input:CampaignDefaultsInput,stacks:StackDraftInput[]) {
  assertDefaults(input);
  const campaign=await saveCampaignEditor(input,stacks,undefined);
  const submitted=await adsApi().submit(campaign.id,{expectedRevision:campaign.contentRevision!,requestId:crypto.randomUUID()});
  if(submitted.moderationStatus!=='pending_primary_review') throw new CampaignWorkflowError(campaign.id,'Review submission needs reconciliation.');
  return campaign.id;
}

export async function saveCampaignEditor(input:CampaignDefaultsInput, stacks:(StackDraftInput & {id?:string;ads:(CreativeDraftInput & {id?:string})[]})[], existing?:{id:string;contentRevision:number}, onCreated?:(id:string,revision:number,defaultStackId?:string)=>void, onOperation?:(id:string,control:{expectedRevision:number;requestId:string})=>void) {
  let campaign=existing;
  if(!campaign) {
    const found=input.requestId?await adsApi().creation(input.requestId):null;
    if(found) throw new CampaignWorkflowError(found.id,'This draft already has a saved campaign. Open it before saving again.');
    const created=await adsApi().create({...input,dailyBudgetUsd:input.dailyBudgetUsd??undefined,title:input.title.trim()||'Untitled campaign'});
    if(!created.contentRevision || !created.defaultStackId) throw new Error('The saved campaign version could not be confirmed.');
    campaign={id:created.id,contentRevision:created.contentRevision};onCreated?.(campaign.id,campaign.contentRevision,created.defaultStackId);
    // Preserve the server-created default stack identity.
    stacks=stacks.map((stack,i)=>i===0?{...stack,id:created.defaultStackId}:stack);
  }
  try {
    const control={expectedRevision:campaign.contentRevision,requestId:crypto.randomUUID()};
    onOperation?.(campaign.id,control);
    return await adsApi().save(campaign.id,{
      ...control,
      title:input.title.trim()||'Untitled campaign',description:input.description??'',category:input.category??'',channels:input.channels,
      budgetUsd:input.budgetUsd,dailyBudgetUsd:input.dailyBudgetUsd,costPerImpressionCents:input.costPerImpressionCents,costPerClickCents:input.costPerClickCents,
      pricingModel:input.pricingModel,format:input.format,targetDevices:input.targetDevices,schedule:input.schedule,frequencyCapPerDay:input.frequencyCapPerDay,
      geoMode:input.geoMode,locations:input.locations,
      stacks:stacks.map(stack=>({id:stack.id,name:stack.name,geoMode:stack.geoMode,locations:stack.locations,targetDevices:stack.targetDevices,schedule:stack.schedule,
        ads:stack.ads.map(ad=>({id:ad.id,adType:ad.adType,headline:ad.headline??'',bodyText:ad.bodyText??'',ctaText:ad.ctaText??'',destinationUrl:ad.destinationUrl,adFormat:ad.adFormat,mediaAssetId:ad.mediaAssetId}))})),
    });
  } catch(error) { throw new CampaignWorkflowError(campaign.id,error instanceof Error?error.message:'Save outcome is unknown. Check the campaign before trying again.',error); }
}

export async function setCampaignStatus(
  id: string,
  status: "active" | "paused",
) {
  return adsApi().status(id, status);
}
export async function registerWebsite(
  domain: string,
  verificationMethod: string,
) {
  const url = new URL(domain.includes("://") ? domain : `https://${domain}`);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  )
    throw new Error(
      "Enter an HTTPS website domain without a path or credentials.",
    );
  return websiteView(
    await apiData(
      "/api/v1/promoters/websites",
      jsonBody({ domain: url.hostname, url: url.origin, verificationMethod }),
    ),
  );
}
export async function verifyWebsite(id: string) {
  const result = await apiData<any>(
    `/api/v1/verification/website/${encodeURIComponent(id)}`,
    { method: "POST" },
  );
  if (typeof result?.isVerified !== "boolean" || !result.website)
    throw new Error("Verification could not be confirmed.");
  return {
    site: websiteView(result.website),
    isVerified: result.isVerified as boolean,
    error: (result.errorMessage ?? result.website?.verificationErrorMessage ?? null) as string | null,
  };
}
