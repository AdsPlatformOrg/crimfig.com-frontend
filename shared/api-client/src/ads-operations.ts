import { createAdsClient, dataOf } from './index';
import type { operations, components } from './generated/ads-v1';
export type MutationControl = components['schemas']['MutationDto'];
export type SaveCampaignInput = components['schemas']['SaveCampaignDto'];
export type BeginEditInput = components['schemas']['BeginEditDto'];
export type CreateCampaignInput = components['schemas']['CreateCampaignDto'];
export type AddCreativeInput = components['schemas']['AddCreativeDto'];
export type ReplaceCreativeInput = components['schemas']['ReplaceCreativeDto'];
export type UpdateStackInput = components['schemas']['UpdateStackDto'];
export type ReviewInput = components['schemas']['ReviewDecisionDto'];
export type CampaignRecord = operations['Campaigns_getAdvertiserCampaigns']['responses'][200]['content']['application/json']['data'][number];
export type CreativeRecord = operations['Campaigns_replaceCreative']['responses'][200]['content']['application/json']['data'];

/** The only handwritten endpoint calls in migrated domain flows; every call is schema-typed. */
export function createAdsOperations(client: ReturnType<typeof createAdsClient>) {
  return {
    async listCampaigns(status?: string) { return dataOf(await client.GET('/api/v1/campaigns', { params: { query: { status } } })); },
    async catalog(category?: string) { return dataOf(await client.GET('/api/v1/campaigns/catalog', { params: { query: { category } } })); },
    async capabilities() { return dataOf(await client.GET('/api/v1/campaigns/creation-capabilities')); },
    async details(id: string) { return dataOf(await client.GET('/api/v1/campaigns/{id}', { params: { path: { id } } })); },
    async creation(requestId: string) { return dataOf(await client.GET('/api/v1/campaigns/creation-request/{requestId}', { params: { path: { requestId } } })); },
    async create(body: CreateCampaignInput) { return dataOf(await client.POST('/api/v1/campaigns', { body })); },
    async createStack(id: string, name: string, control: MutationControl) { return dataOf(await client.POST('/api/v1/campaigns/{id}/ad-stacks', { params: { path: { id } }, body: { name, ...control } })); },
    async updateStack(id: string, stackId: string, body: UpdateStackInput) { return dataOf(await client.PATCH('/api/v1/campaigns/{id}/ad-stacks/{stackId}', { params: { path: { id, stackId } }, body })); },
    async deleteStack(id: string, stackId: string, body: MutationControl) { return dataOf(await client.DELETE('/api/v1/campaigns/{id}/ad-stacks/{stackId}', { body, params: { path: { id, stackId } } })); },
    async addCreative(id: string, body: AddCreativeInput) { return dataOf(await client.POST('/api/v1/campaigns/{id}/creatives', { params: { path: { id } }, body })); },
    async replaceCreative(id: string, body: ReplaceCreativeInput) { return dataOf(await client.PUT('/api/v1/campaigns/creatives/{id}/replace', { params: { path: { id } }, body })); },
    async submit(id: string, body: MutationControl) { return dataOf(await client.POST('/api/v1/campaigns/{id}/submit-review', { body, params: { path: { id } } })); },
    async status(id: string, status: 'active' | 'paused' | 'trash') { return dataOf(await client.PUT('/api/v1/campaigns/{id}/status', { params: { path: { id } }, body: { status } })); },
    async save(id:string,body:SaveCampaignInput) { return dataOf(await client.PATCH('/api/v1/campaigns/{id}',{body,params:{path:{id}}})); },
    async beginEdit(id:string,body:BeginEditInput) { return dataOf(await client.POST('/api/v1/campaigns/{id}/begin-edit',{body,params:{path:{id}}})); },
    async mutation(id:string,requestId:string) { return dataOf(await client.GET('/api/v1/campaigns/{id}/mutations/{requestId}',{params:{path:{id,requestId}}})); },
    async deleteCreative(id:string,creativeId:string,body:MutationControl) { return dataOf(await client.DELETE('/api/v1/campaigns/{id}/creatives/{creativeId}',{body,params:{path:{id,creativeId}}})); },
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
    async queue(stage: 'reviewer' | 'manager') { return dataOf(await client.GET('/api/v1/admin/ads/moderation/queue', { params: { query: { stage } } })); },
    async reviewCreative(id: string, body: ReviewInput) { return dataOf(await client.POST('/api/v1/admin/ads/moderation/creatives/{id}/decision', { params: { path: { id } }, body })); },
    async reviewCampaign(id: string, stage: 'reviewer' | 'manager', body: ReviewInput) {
      return stage === 'reviewer' ? dataOf(await client.POST('/api/v1/admin/ads/moderation/campaigns/{id}/primary-review', { params: { path: { id } }, body })) :
        dataOf(await client.POST('/api/v1/admin/ads/moderation/campaigns/{id}/manager-approval', { params: { path: { id } }, body }));
    },
    async override(id: string, overrideReason: string, decision: 'approved' | 'rejected', control: MutationControl & {submissionId:string}) {
      return dataOf(await client.POST('/api/v1/admin/ads/moderation/campaigns/{id}/emergency-override', { params: { path: { id } }, body: { overrideReason, decision, ...control } }));
    },
  };
}
