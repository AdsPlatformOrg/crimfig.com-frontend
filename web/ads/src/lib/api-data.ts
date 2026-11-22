import { sessionFetch } from './session';

/** Transport/session errors remain errors; never replace them with sample or empty data. */
export async function apiData<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await sessionFetch(path, init);
  if (response.status === 429) {
    const body = await response.json().catch(() => null);
    if (body?.code === 'RATE_LIMITED' && typeof body.message === 'string' &&
        /^Verification was attempted recently\. Please wait ([1-9]|10) seconds? before retrying\.$/.test(body.message)) {
      throw new Error(body.message);
    }
    throw new Error('Too many requests. Please try again later.');
  }
  if (!response.ok) throw new Error(response.status === 403 ? 'You do not have permission for this action.' : 'The request could not be confirmed. Please retry after checking the service.');
  const body = await response.json();
  if (body?.status !== 'success' || !Object.prototype.hasOwnProperty.call(body, 'data')) throw new Error('The service returned an invalid response.');
  return body.data as T;
}
export function arrayData<T>(value: unknown): T[] {
  if (!Array.isArray(value)) throw new Error('The service returned an invalid collection.');
  return value as T[];
}
export const jsonBody = (value: unknown): RequestInit => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value) });
