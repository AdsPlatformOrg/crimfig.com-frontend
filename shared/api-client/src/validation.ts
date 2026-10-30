import Ajv from 'ajv';
import document from './generated/ads-v1.json';
type Schema = Record<string, unknown>;
/** OpenAPI 3.0 -> JSON Schema: nullable applies to refs/unions/enums too, not just type. */
export function jsonSchema(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(jsonSchema);
  if (!value || typeof value !== 'object') return value;
  const record = value as Schema;
  const converted = Object.fromEntries(Object.entries(record).filter(([key]) => !['nullable', 'example', 'xml', 'discriminator'].includes(key)).map(([key, val]) => [key, jsonSchema(val)]));
  return record.nullable ? { anyOf: [converted, { type: 'null' }] } : converted;
}
const ajv = new Ajv({ strict: false, validateFormats: false, allErrors: false, ownProperties: true });
const cache = new Map<string, ReturnType<Ajv['compile']>>();
export function validateResponse(path: string, method: string, status: number, body: unknown): boolean {
  const doc = document as { paths: Record<string, Record<string, { responses: Record<string, { content?: Record<string, { schema: Schema }> }> }>>; components: unknown };
  const schema = doc.paths[path]?.[method.toLowerCase()]?.responses[String(status)]?.content?.['application/json']?.schema;
  if (!schema) return false;
  const key = `${path}:${method}:${status}`;
  if (!cache.has(key)) cache.set(key, ajv.compile(jsonSchema({ ...schema, components: doc.components }) as Schema));
  return cache.get(key)!(body) === true;
}
