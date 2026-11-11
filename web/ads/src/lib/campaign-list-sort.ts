import type { CampaignListSort } from '@crimfig/api-client/src/ads-operations';

export const campaignSortOptions = [
  ['newest', 'Newest first'], ['oldest', 'Oldest first'],
  ['title', 'Title A–Z'], ['title_desc', 'Title Z–A'],
  ['status', 'Status A–Z'], ['status_desc', 'Status Z–A'],
  ['budget', 'Budget: low to high'], ['budget_desc', 'Budget: high to low'],
  ['spend', 'Spend: low to high'], ['spend_desc', 'Spend: high to low'],
  ['creatives', 'Approved ads: low to high'], ['creatives_desc', 'Approved ads: high to low'],
  ['views', 'Impressions: low to high'], ['views_desc', 'Impressions: high to low'],
  ['clicks', 'Clicks: low to high'], ['clicks_desc', 'Clicks: high to low'],
  ['ctr', 'CTR: low to high'], ['ctr_desc', 'CTR: high to low'],
] as const satisfies ReadonlyArray<readonly [CampaignListSort, string]>;

export function parseCampaignSort(value: string | null): CampaignListSort {
  return campaignSortOptions.find(([key]) => key === value)?.[0] ?? 'newest';
}

export function campaignColumnSort(column: string, current: CampaignListSort) {
  const key = column === 'campaign' ? 'title' : column;
  if (!campaignSortOptions.some(([option]) => option === key) || key === 'newest' || key === 'oldest') return null;
  const descending = `${key}_desc` as CampaignListSort;
  return {
    direction: current === key ? 'ascending' as const : current === descending ? 'descending' as const : undefined,
    next: current === key ? descending : key as CampaignListSort,
    nextDirection: current === key ? 'descending' : 'ascending',
  };
}
