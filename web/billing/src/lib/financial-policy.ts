export interface PolicyView {
  version: string; mode: 'not_activated'; withdrawalUsdCents: number; ownerDayUsdCents: number;
  destinationDayUsdCents: number; platformHourUsdCents: number; platformDayUsdCents: number;
  outstandingUsdCents: number; hotFloatUsdCents: number; secondReviewerAboveUsdCents: number;
  alertSubmissionTargetMs: number; acknowledgementTargetMs: number; recipients: string[];
}
export const financialPolicyFigures = [
  ['withdrawalUsdCents', 'Per withdrawal'], ['ownerDayUsdCents', 'Per person in 24 hours'],
  ['destinationDayUsdCents', 'Per destination in 24 hours'], ['platformHourUsdCents', 'Platform in 1 hour'],
  ['platformDayUsdCents', 'Platform in 24 hours'], ['outstandingUsdCents', 'Outstanding transfers, including unknown outcomes'],
  ['hotFloatUsdCents', 'Provider hot-wallet balance ceiling'], ['secondReviewerAboveUsdCents', 'Two reviewers required above'],
] as const;

export function validateFinancialPolicy(data: PolicyView): PolicyView {
  if (!data || data.mode !== 'not_activated' || typeof data.version !== 'string' || !data.version.trim()
    || financialPolicyFigures.some(([key]) => !Number.isSafeInteger(data[key]) || data[key] < 0)
    || !Array.isArray(data.recipients) || data.recipients.length < 2 || data.recipients.some(r => typeof r !== 'string' || !r.includes('@'))
    || !Number.isSafeInteger(data.alertSubmissionTargetMs) || data.alertSubmissionTargetMs <= 0
    || !Number.isSafeInteger(data.acknowledgementTargetMs) || data.acknowledgementTargetMs <= 0) throw new Error('Invalid policy');
  return data;
}
