import createClient from 'openapi-fetch';
import type { paths, operations } from './generated/ads-v1';
import document from './generated/ads-v1.json';
import { ApiError, responseError } from './error';
import { validateResponse } from './validation';
export { ApiError, responseError } from './error';
export { validateResponse, jsonSchema } from './validation';
export type { paths, operations } from './generated/ads-v1';
export type SessionTransport = (url: string | URL, init?: RequestInit) => Promise<Response>;

export function createAdsClient(options: { origin: string; sessionFetch: SessionTransport; publicFetch?: typeof fetch }) {
  const origin = new URL(options.origin).origin;
  const doc = document as { paths: Record<string, Record<string, { operationId: string; security?: unknown[] }>> };
  const contexts = new WeakMap<Request, { path: string; operation: string; private: boolean }>();
  const client = createClient<paths>({ baseUrl: origin, fetch: async request => {
    const context = contexts.get(request);
    if (!context || new URL(request.url).origin !== origin || new URL(request.url).username || new URL(request.url).password) {
      throw new ApiError('unknown', request.method, '/<unresolved>', 'protocol');
    }
    try {
      if (!context.private) {
        const headers = new Headers(request.headers);
        headers.delete('authorization'); headers.delete('cookie');
        return await (options.publicFetch || fetch)(new Request(request, { headers, credentials: 'omit', redirect: 'error' }));
      }
      return await options.sessionFetch(request.url, { method: request.method, headers: request.headers, signal: request.signal,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.blob(),
        cache: request.cache, credentials: 'omit', redirect: 'error' });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      const timedOut = error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name);
      throw new ApiError(context.operation, request.method, context.path, timedOut ? 'timeout' : 'network', undefined, 'TRANSPORT_FAILED', undefined, {},
        ['GET', 'HEAD'].includes(request.method) ? 'rejected' : 'unknown');
    }
  } });
  client.use({
    onRequest({ request, schemaPath }) {
      const operation = doc.paths[schemaPath]?.[request.method.toLowerCase()];
      if (!operation) throw new ApiError('unknown', request.method, schemaPath, 'protocol');
      contexts.set(request, { path: schemaPath, operation: operation.operationId, private: operation.security?.length !== 0 });
    },
    async onResponse({ request, response, schemaPath }) {
      const operation = doc.paths[schemaPath]?.[request.method.toLowerCase()]?.operationId || 'unknown';
      if (!response.ok) {
        const body: unknown = await response.clone().json().catch(() => undefined);
        throw responseError(operation, request.method, schemaPath, response.status, body, response.headers.get('x-request-id'));
      }
      const declared = (document.paths as Record<string, Record<string, { responses: Record<string, unknown> }>>)[schemaPath]?.[request.method.toLowerCase()]?.responses;
      if (!declared?.[String(response.status)]) throw new ApiError(operation, request.method, schemaPath, 'protocol', response.status,
        'RESPONSE_MISMATCH', undefined, {}, ['GET', 'HEAD'].includes(request.method) ? 'rejected' : 'unknown');
      // Non-JSON endpoints are explicitly typed as binary/empty; caller chooses parseAs.
      if (response.status === 204 || ['getMedia', 'previewMedia', 'reviewMedia'].some(name => operation.endsWith(`_${name}`))) return;
      if (!/^application\/(?:[\w.+-]*\+)?json(?:;|$)/i.test(response.headers.get('content-type') || '')) throw new ApiError(operation, request.method, schemaPath, 'protocol', response.status,
        'RESPONSE_MISMATCH', undefined, {}, ['GET', 'HEAD'].includes(request.method) ? 'rejected' : 'unknown');
      const body: unknown = await response.clone().json().catch(() => undefined);
      if (!validateResponse(schemaPath, request.method, response.status, body)) throw new ApiError(operation, request.method, schemaPath, 'protocol', response.status,
        'RESPONSE_MISMATCH', undefined, {}, ['GET', 'HEAD'].includes(request.method) ? 'rejected' : 'unknown');
    },
  });
  return client;
}

export function dataOf<T>(result: { data?: { status: 'success'; data: T } }): T {
  if (!result.data || result.data.status !== 'success') throw new ApiError('unknown', 'GET', '/<unresolved>', 'protocol');
  return result.data.data;
}
