import { createAdsClient, dataOf } from './index';
import type { operations, components } from './generated/ads-v1';
export type MutationControl = components['schemas']['MutationDto'];
export type SaveCampaignInput = components['schemas']['SaveCampaignDto'];
export type BeginEditInput = components['schemas']['BeginEditDto'];
export type CreateCampaignInput = components['schemas']['CreateCampaignDto'];
export type AddCreativeInput = components['schemas']['AddCreativeDto'];
export type ReplaceCreativeInput = components['schemas']['ReplaceCreativeDto'];
export type UpdateStackInput = components['schemas']['UpdateStackDto'];
export type ClaimInput=components['schemas']['ModerationClaimDto'];
export type ReviewInput = components['schemas']['ReviewDecisionDto'];
export type CampaignRecord = operations['Campaigns_getAdvertiserCampaigns']['responses'][200]['content']['application/json']['data'][number];
export type CreativeRecord = operations['Campaigns_replaceCreative']['responses'][200]['content']['application/json']['data'];

/** The only handwritten endpoint calls in migrated domain flows; every call is schema-typed. */
export function createAdsOperations(client: ReturnType<typeof createAdsClient>) {
  return {
    async listCampaigns(status?: string) { return dataOf(await client.GET('/api/v1/campaigns', { params: { query: { status } } })); },
    async campaignPage(status='all',page=1,pageSize=25,search='',sort: 'newest' | 'oldest' | 'title' = 'newest') { return dataOf(await client.GET('/api/v1/campaigns/page',{params:{query:{status,page,pageSize,search,sort}}})); },
    async catalog(category?: string) { return dataOf(await client.GET('/api/v1/campaigns/catalog', { params: { query: { category } } })); },
    async capabilities() { return dataOf(await client.GET('/api/v1/campaigns/creation-capabilities')); },
    async details(id: string) { return dataOf(await client.GET('/api/v1/campaigns/{id}', { params: { path: { id } } })); },
    async deliveryReadiness(id: string, staff = false) {
      const params = { path: { id } };
      return staff
        ? dataOf(await client.GET('/api/v1/campaigns/admin/{id}/delivery-readiness', { params }))
        : dataOf(await client.GET('/api/v1/campaigns/{id}/delivery-readiness', { params }));
    },
    async creation(requestId: string) { return dataOf(await client.GET('/api/v1/campaigns/creation-request/{requestId}', { params: { path: { requestId } } })); },
    async create(body: CreateCampaignInput) { return dataOf(await client.POST('/api/v1/campaigns', { body })); },
    async createStack(id: string, name: string, control: MutationControl) { return dataOf(await client.POST('/api/v1/campaigns/{id}/ad-stacks', { params: { path: { id } }, body: { name, ...control } })); },
    async updateStack(id: string, stackId: string, body: UpdateStackInput) { return dataOf(await client.PATCH('/api/v1/campaigns/{id}/ad-stacks/{stackId}', { params: { path: { id, stackId } }, body })); },
    async deleteStack(id: string, stackId: string, body: MutationControl) { return dataOf(await client.DELETE('/api/v1/campaigns/{id}/ad-stacks/{stackId}', { body, params: { path: { id, stackId } } })); },
    async addCreative(id: string, body: AddCreativeInput) { return dataOf(await client.POST('/api/v1/campaigns/{id}/creatives', { params: { path: { id } }, body })); },
    async replaceCreative(id: string, body: ReplaceCreativeInput) { return dataOf(await client.PUT('/api/v1/campaigns/creatives/{id}/replace', { params: { path: { id } }, body })); },
    async submit(id: string, body: MutationControl) { return dataOf(await client.POST('/api/v1/campaigns/{id}/submit-review', { body, params: { path: { id } } })); },
    async status(id: string, status: 'active' | 'paused' | 'trash' | 'draft') { return dataOf(await client.PUT('/api/v1/campaigns/{id}/status', { params: { path: { id } }, body: { status } })); },
    async save(id:string,body:SaveCampaignInput) { return dataOf(await client.PATCH('/api/v1/campaigns/{id}',{body,params:{path:{id}}})); },
    async beginEdit(id:string,body:BeginEditInput) { return dataOf(await client.POST('/api/v1/campaigns/{id}/begin-edit',{body,params:{path:{id}}})); },
    async mutation(id:string,requestId:string) { return dataOf(await client.GET('/api/v1/campaigns/{id}/mutations/{requestId}',{params:{path:{id,requestId}}})); },
    async deleteCreative(id:string,creativeId:string,body:MutationControl) { return dataOf(await client.DELETE('/api/v1/campaigns/{id}/creatives/{creativeId}',{body,params:{path:{id,creativeId}}})); },
    async moderationDetail(targetType:'creative'|'stack'|'campaign',id:string,page=1) {return dataOf(await client.GET('/api/v1/admin/ads/moderation/items/{targetType}/{id}',{params:{path:{targetType,id},query:{page}}}));},
    async reviewReceipt(id:string,requestId:string) {return dataOf(await client.GET('/api/v1/admin/ads/moderation/campaigns/{id}/review-requests/{requestId}',{params:{path:{id,requestId}}}));},
    async submission(id:string) { return dataOf(await client.GET('/api/v1/admin/ads/moderation/campaigns/{id}/submission',{params:{path:{id}}})); },
    async audit(id:string,offset=0) { return dataOf(await client.GET('/api/v1/admin/ads/moderation/campaigns/{id}/change-audit',{params:{path:{id},query:{offset}}})); },
    async uploadSettings() { return dataOf(await client.GET('/api/v1/uploads/settings')); },
    async uploadDirect(file: File, signal?: AbortSignal) { return dataOf(await client.POST('/api/v1/uploads/direct', {
      body: { file: '' }, signal, bodySerializer() { const form = new FormData(); form.append('file', file); return form; },
    })); },
    async uploadPrepared(form: FormData, signal?: AbortSignal) { return dataOf(await client.POST('/api/v1/uploads/prepared', {
      body: { files: [], manifest: '' }, signal, bodySerializer: () => form,
    })); },
    async readyAsset(assetId: string) { return dataOf(await client.GET('/api/v1/uploads/assets/{assetId}', { params: { path: { assetId } } })); },
    async media(storageKey: string, mode: 'owner' | 'review', signal?: AbortSignal) {
      const result = mode === 'review' ? await client.GET('/api/v1/uploads/review-media/{storageKey}', { params: { path: { storageKey } }, parseAs: 'blob', signal }) :
        await client.GET('/api/v1/uploads/private-media/{storageKey}', { params: { path: { storageKey } }, parseAs: 'blob', signal });
      if (!result.data) throw new Error('The media preview could not be confirmed.');
      return result.data;
    },
    async moderationClaim(targetType:'creative'|'stack'|'campaign',id:string,stage:'reviewer'|'manager') {return dataOf(await client.GET('/api/v1/admin/ads/moderation/items/{targetType}/{id}/claim',{cache:'no-store',params:{path:{targetType,id},query:{stage}}}));},
    async changeModerationClaim(targetType:'creative'|'stack'|'campaign',id:string,action:'acquire'|'renew'|'release'|'takeover',body:ClaimInput) {
      const params={path:{targetType,id}};
      if(action==='acquire')return dataOf(await client.POST('/api/v1/admin/ads/moderation/items/{targetType}/{id}/claim',{params,body}));
      if(action==='renew')return dataOf(await client.POST('/api/v1/admin/ads/moderation/items/{targetType}/{id}/claim/renew',{params,body}));
      if(action==='release')return dataOf(await client.POST('/api/v1/admin/ads/moderation/items/{targetType}/{id}/claim/release',{params,body}));
      return dataOf(await client.POST('/api/v1/admin/ads/moderation/items/{targetType}/{id}/claim/takeover',{params,body}));
    },
    async moderationSummary(targetType:'all'|'creative'|'stack'|'campaign'='all') {return dataOf(await client.GET('/api/v1/admin/ads/moderation/operations-summary',{params:{query:{targetType}}}));},
    async queue(stage: 'reviewer' | 'manager', page=1) {
      const result=dataOf(await client.GET('/api/v1/admin/ads/moderation/queue', { cache:'no-store', params: { query: { stage, page } } }));
      if(!result || !['creatives','stacks','campaigns'].every(key=>Array.isArray((result as unknown as Record<string,unknown>)[key])))throw new Error('Moderation queue response is unavailable. Refresh to try again.');
      return {...result,creatives:result.creatives!,stacks:result.stacks!,campaigns:result.campaigns!};
    },
    async reviewCreative(id: string, stage: 'reviewer' | 'manager' | 'legacy', body: ReviewInput) {
      if (stage === 'manager') {
        return dataOf(await client.POST('/api/v1/admin/ads/moderation/creatives/{id}/manager-approval', { params: { path: { id } }, body }));
      }
      if (stage === 'reviewer') {
        return dataOf(await client.POST('/api/v1/admin/ads/moderation/creatives/{id}/primary-review', { params: { path: { id } }, body }));
      }
      return dataOf(await client.POST('/api/v1/admin/ads/moderation/creatives/{id}/decision', { params: { path: { id } }, body }));
    },
    async reviewStack(id: string, stage: 'reviewer' | 'manager', body: ReviewInput) {
      return stage === 'reviewer'
        ? dataOf(await client.POST('/api/v1/admin/ads/moderation/stacks/{id}/primary-review', { params: { path: { id } }, body }))
        : dataOf(await client.POST('/api/v1/admin/ads/moderation/stacks/{id}/manager-approval', { params: { path: { id } }, body }));
    },
    async reviewCampaign(id: string, stage: 'reviewer' | 'manager', body: ReviewInput) {
      return stage === 'reviewer' ? dataOf(await client.POST('/api/v1/admin/ads/moderation/campaigns/{id}/primary-review', { params: { path: { id } }, body })) :
        dataOf(await client.POST('/api/v1/admin/ads/moderation/campaigns/{id}/manager-approval', { params: { path: { id } }, body }));
    },
    async override(id: string, overrideReason: string, decision: 'approved' | 'rejected', control: MutationControl & {submissionId:string}) {
      return dataOf(await client.POST('/api/v1/admin/ads/moderation/campaigns/{id}/emergency-override', { params: { path: { id } }, body: { overrideReason, decision, ...control } }));
    },
  };
}
