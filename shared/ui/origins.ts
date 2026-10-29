/** Keep ecosystem navigation on the same environment, including stale production defaults. */
export function ecosystemOrigin(app: 'auth' | 'ads' | 'billing', configured?: string, authHint?: string) {
  const current = typeof window === 'undefined' ? '' : window.location.hostname;
  const staging = current.startsWith('staging-') || /\/\/staging-/.test(configured ?? '') || /\/\/staging-/.test(authHint ?? '');
  if (staging) return `https://staging-${app}.crimfig.com`;
  if (configured) return configured.replace(/\/+$/, '');
  if (current === 'localhost' || current === '127.0.0.1' || (!current && process.env.NODE_ENV !== 'production')) {
    return `http://localhost:${app === 'auth' ? 3000 : app === 'ads' ? 3005 : 3006}`;
  }
  return `https://${app}.crimfig.com`;
}
