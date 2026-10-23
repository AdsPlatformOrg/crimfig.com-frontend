/** Map canonical local media only; never send a dashboard bearer token to a creative-supplied host. */
export function previewPath(value: string, origin: string, mode: 'owner' | 'review'): string {
  const url = new URL(value, origin);
  if (url.origin !== origin || url.username || url.password || url.search || url.hash ||
      !/^\/api\/v1\/uploads\/media\/[^/]+$/.test(url.pathname)) throw new Error('Only media uploaded to this Ads service can be previewed here.');
  const key = decodeURIComponent(url.pathname.split('/').pop()!);
  if (!key || /[\\/]/.test(key) || key.includes('..')) throw new Error('Invalid media key.');
  return `/api/v1/uploads/${mode === 'review' ? 'review-media' : 'private-media'}/${encodeURIComponent(key)}`;
}
