import { sessionFetch } from './session';

/** Transport/session errors remain errors; never replace them with sample or empty data. */
export async function apiData<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await sessionFetch(path, init);
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
