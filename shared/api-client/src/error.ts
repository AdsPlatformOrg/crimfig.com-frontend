export type ApiErrorCategory = 'authentication' | 'permission' | 'validation' | 'conflict' | 'not-found' | 'network' | 'timeout' | 'protocol' | 'service';
const messages: Record<string, string> = {
  AUTHENTICATION_REQUIRED: 'Sign in to continue.', PERMISSION_DENIED: 'You do not have permission for this action.',
  VALIDATION_FAILED: 'Check the highlighted fields.', NOT_FOUND: 'The requested item was not found.',
  CONFLICT: 'This request conflicts with the current state. Refresh its status before trying again.',
  STALE_REVISION: 'This item changed. Reload its current version before saving again.',
  BUDGET_REJECTED: 'Your wallet cannot reserve this campaign budget. Check your balance or choose a smaller budget.',
  RATE_LIMITED: 'Too many requests. Please try again later.', PAYLOAD_TOO_LARGE: 'The upload is too large.',
  SERVICE_UNAVAILABLE: 'The service could not confirm this request. Check its status before retrying.',
  INTERNAL_ERROR: 'The service could not complete this request.',
};
const statusCodes: Record<number, string> = { 400: 'VALIDATION_FAILED', 401: 'AUTHENTICATION_REQUIRED', 403: 'PERMISSION_DENIED', 404: 'NOT_FOUND',
  409: 'CONFLICT', 413: 'PAYLOAD_TOO_LARGE', 422: 'VALIDATION_FAILED', 429: 'RATE_LIMITED', 503: 'SERVICE_UNAVAILABLE' };
export class ApiError extends Error {
  readonly name = 'ApiError';
  readonly service = 'ads';
  constructor(readonly operation: string, readonly method: string, readonly path: string,
    readonly category: ApiErrorCategory, readonly status?: number, readonly code = 'REQUEST_FAILED',
    readonly requestId?: string, readonly fieldErrors: Record<string, string[]> = {},
    readonly outcome: 'rejected' | 'unknown' = 'rejected') {
    super(messages[code] || (category === 'protocol' ? 'The service returned an unexpected response. Check its status before retrying.' :
      outcome === 'unknown' ? 'The request outcome is unknown. Check its status before trying again.' : 'The request could not be completed.'));
  }
}
export function responseError(operation: string, method: string, path: string, status: number, body: unknown, headerId?: string | null) {
  const data = body && typeof body === 'object' ? body as Record<string, unknown> : {};
  const allowed = status === 409 ? ['CONFLICT', 'STALE_REVISION', 'BUDGET_REJECTED'] : [statusCodes[status] || 'INTERNAL_ERROR'];
  const code = typeof data.code === 'string' && allowed.includes(data.code) ? data.code : statusCodes[status] || 'INTERNAL_ERROR';
  const id = data.requestId ?? headerId;
  const requestId = typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) ? id : undefined;
  const fieldErrors: Record<string, string[]> = {};
  if ([400, 422].includes(status) && data.fieldErrors && typeof data.fieldErrors === 'object') {
    for (const field of Object.keys(data.fieldErrors).slice(0, 30)) if (/^[a-z][a-z0-9_.]{0,63}$/i.test(field) && !/password|token|secret|cookie|authorization/i.test(field)) fieldErrors[field] = ['Check this field.'];
  }
  const category: ApiErrorCategory = status === 401 ? 'authentication' : status === 403 ? 'permission' : status === 404 ? 'not-found' :
    status === 409 ? 'conflict' : [400, 413, 422].includes(status) ? 'validation' : 'service';
  return new ApiError(operation, method, path, category, status, code, requestId, fieldErrors,
    !['GET', 'HEAD'].includes(method) && (status >= 500 || status === 408) ? 'unknown' : 'rejected');
}
