import { createAdsClient } from '../src/index';
import { createAdsOperations } from '../src/ads-operations';
const client = createAdsClient({ origin: 'https://ads.example', sessionFetch: async () => new Response() });
const api = createAdsOperations(client);
void client.POST('/api/v1/campaigns', { body: { title: 'Draft', budgetUsd: 5, pricingModel: 'cpm' } });
void client.GET('/api/v1/campaigns/{id}', { params: { path: { id: 'id' } } });
// @ts-expect-error endpoint typo must fail
void client.GET('/api/v1/campaings');
// @ts-expect-error campaign collection PATCH is not implemented
void client.PATCH('/api/v1/campaigns');
// @ts-expect-error campaign save PATCH requires expectedRevision and requestId
void api.save('id', { title: 'Missing revision control' });
// @ts-expect-error required title and budget missing
void client.POST('/api/v1/campaigns', { body: {} });
// @ts-expect-error path ID required
void client.GET('/api/v1/campaigns/{id}');
// @ts-expect-error number required
void api.create({ title: 'Draft', budgetUsd: '5' });
// @ts-expect-error unknown pricing enum
void api.create({ title: 'Draft', budgetUsd: 5, pricingModel: 'free' });
// @ts-expect-error undeclared query argument
void client.GET('/api/v1/campaigns', { params: { query: { wrong: true } } });
async function fieldProof() {
  const campaign = await api.details('id');
  const title: string = campaign.title;
  // @ts-expect-error typed DTO field is not a number
  const wrong: number = campaign.title;
  return { title, wrong };
}
void fieldProof;
