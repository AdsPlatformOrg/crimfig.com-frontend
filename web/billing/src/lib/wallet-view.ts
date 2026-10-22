export function walletView(data: any) {
  const usd = data?.usd, fx = data?.ngnEquivalent;
  if (![usd?.availableCents, usd?.lockedCents, usd?.totalCents].every(value => Number.isSafeInteger(value) && value >= 0) ||
      usd.totalCents !== usd.availableCents + usd.lockedCents || !Number.isFinite(fx?.exchangeRate) || fx.exchangeRate <= 0 ||
      typeof fx.rateSource !== 'string' || !Number.isFinite(new Date(data?.updatedAt).getTime())) {
    throw new Error('Invalid wallet response');
  }
  return {
    availableUsd: usd.availableCents / 100, lockedUsd: usd.lockedCents / 100, totalUsd: usd.totalCents / 100,
    rate: fx.exchangeRate, rateSource: fx.rateSource, lastUpdated: new Date(data.updatedAt).toLocaleTimeString(),
  };
}
