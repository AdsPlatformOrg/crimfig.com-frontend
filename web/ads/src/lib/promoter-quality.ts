export interface QualityData {
  promoterId: string; trustScore: number; isSuspended: boolean; suspensionReason: string | null;
  totalInteractions: number; validInteractions: number; invalidInteractions: number; invalidRatePct: number;
  status: 'good' | 'warning' | 'suspended';
}
export function parsePromoterQuality(value: unknown): QualityData {
  const data = value as QualityData | null;
  if (!data || typeof data.promoterId !== 'string' || !data.promoterId ||
      !Number.isFinite(data.trustScore) || data.trustScore < 0 || data.trustScore > 100 ||
      typeof data.isSuspended !== 'boolean' ||
      !(data.suspensionReason === null || typeof data.suspensionReason === 'string') ||
      !['good', 'warning', 'suspended'].includes(data.status) ||
      ![data.totalInteractions,data.validInteractions,data.invalidInteractions].every(n => Number.isSafeInteger(n) && n >= 0) ||
      data.validInteractions + data.invalidInteractions > data.totalInteractions ||
      !Number.isFinite(data.invalidRatePct) || data.invalidRatePct < 0 || data.invalidRatePct > 100) {
    throw new Error('Quality data is unavailable. Please retry.');
  }
  return data;
}
