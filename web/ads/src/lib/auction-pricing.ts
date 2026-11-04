/** Format integer USD units without converting nanos or micros to floating point. */
export function formatAuctionUsd(value: unknown, decimalPlaces: number): string | null {
  const digits = typeof value === 'string' ? value : typeof value === 'number' && Number.isSafeInteger(value) ? String(value) : '';
  if (!/^\d+$/.test(digits)) return null;
  const padded = digits.replace(/^0+(?=\d)/, '').padStart(decimalPlaces + 1, '0');
  const whole = padded.slice(0, -decimalPlaces);
  const fraction = padded.slice(-decimalPlaces).replace(/0+$/, '').padEnd(2, '0');
  return `$${whole}.${fraction}`;
}
