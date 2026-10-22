import { apiData, arrayData, jsonBody } from './api-data';
import type { AdsDisputeItem, CreateDisputePayload } from '../types/disputes';

function disputeView(data: any): AdsDisputeItem {
  if (typeof data?.id !== 'string') throw new Error('Invalid dispute response.');
  return { ...data, adjustmentUsd: data.adjustmentMicros == null ? null : data.adjustmentMicros / 1_000_000 };
}
export async function fetchDisputes(role: 'advertiser' | 'promoter' = 'advertiser'): Promise<AdsDisputeItem[]> {
  return arrayData(await apiData(`/api/v1/disputes?role=${role}`)).map(disputeView);
}
export async function createDispute(payload: CreateDisputePayload): Promise<AdsDisputeItem> {
  return disputeView(await apiData('/api/v1/disputes', jsonBody(payload)));
}
