export function campaignsReturnHref(returnTo: string | null | undefined) {
  if (!returnTo?.startsWith('/campaigns?')) return '/campaigns';

  const parsed = new URL(returnTo, 'https://ads.crimfig.com');
  return parsed.origin === 'https://ads.crimfig.com' && parsed.pathname === '/campaigns'
    ? `${parsed.pathname}${parsed.search}`
    : '/campaigns';
}

export function withCampaignReturnTo(href: string, returnTo: string | null | undefined) {
  const returnHref = campaignsReturnHref(returnTo);
  return returnHref === '/campaigns'
    ? href
    : `${href}${href.includes('?') ? '&' : '?'}returnTo=${encodeURIComponent(returnHref)}`;
}
