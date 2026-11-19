import { fundingRequest, fundingReturn, validFundingReference, validFundingRequestId } from './funding-api';

const key = 'crimfig.ads-wallet-funding';

type AdsFundingContext = { requestId: string | null; reference: string | null };

export function isAdsFundingEntry(search: string) {
  const query = new URLSearchParams(search);
  const sources = query.getAll('funding_source');
  return sources.length === 1 && sources[0] === 'ads' &&
    fundingRequest(search).kind === 'none' && fundingReturn(search).kind === 'none';
}

export function readAdsFunding(storage: Storage): AdsFundingContext | null {
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.requestId !== null && !validFundingRequestId(data?.requestId)) return null;
    if (data.reference !== null && (!data.requestId || !validFundingReference(data.reference))) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveAdsFunding(storage: Storage, context: AdsFundingContext) {
  try {
    storage.setItem(key, JSON.stringify(context));
  } catch {
    // Funding can continue if storage is unavailable.
  }
}

export function isAdsFundingContext(search: string, context: AdsFundingContext | null) {
  const returned = fundingReturn(search);
  if (returned.kind !== 'none') return returned.kind === 'valid' && returned.reference === context?.reference;
  const request = fundingRequest(search);
  if (request.kind !== 'none') return request.kind === 'valid' && request.requestId === context?.requestId;
  return isAdsFundingEntry(search);
}

export function shouldReturnToAds(status: string, reference: string, context: AdsFundingContext | null) {
  return status === 'confirmed' && validFundingReference(reference) && reference === context?.reference;
}
