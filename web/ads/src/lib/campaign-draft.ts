export const DRAFT_PREFIX = "crimfig:campaign-draft:v1:";
export function bidEstimate(
  budget: number,
  bidCents: number,
  model: "cpm" | "cpc",
) {
  if (
    !Number.isFinite(budget) ||
    !Number.isFinite(bidCents) ||
    budget <= 0 ||
    bidCents <= 0
  )
    return null;
  return Math.floor(((budget * 100) / bidCents) * (model === "cpm" ? 1000 : 1));
}
export function readDraft(storage: Pick<Storage, "getItem">, userId: string) {
  const raw = storage.getItem(DRAFT_PREFIX + userId);
  if (!raw) return null;
  if (raw.length > 250000) throw Error("Saved draft is too large.");
  const value = JSON.parse(raw);
  if (
    value.version !== 1 ||
    Date.now() - value.savedAt > 7 * 86400000 ||
    !Array.isArray(value.stacks) ||
    value.stacks.length > 20 ||
    value.stacks.some((s: any) => !Array.isArray(s.ads) || s.ads.length > 100)
  )
    return null;
  return value;
}
export function clearCampaignDrafts(storage: Storage) {
  for (let i = storage.length - 1; i >= 0; i--) {
    const key = storage.key(i);
    if (key?.startsWith(DRAFT_PREFIX)) storage.removeItem(key);
  }
}
