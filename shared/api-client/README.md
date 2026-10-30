# Ads API contracts

Use `pnpm api:generate` after changing the covered backend DTOs, routes or response metadata. Use `pnpm api:check` after implementing the caller and its unit tests. Both commands work from the workspace root, `frontend`, or `backend`. They require installed dependencies in the sibling `frontend` and `backend` repositories; they do not require a running API, database, credentials or network access.

The canonical exporter reads the real Campaigns, Uploads and Moderation controllers and validation metadata. It substitutes inert business providers, shares the runtime API prefix/version configuration, and exports 30 operations. Response schemas live in `backend/api/ads-api/src/contracts/ads-contract.ts`; a new undocumented handler fails export. Update those schemas when changing response serialization. Never repair a mismatch by editing generated artifacts or suppressing a caller's type error.

`api:generate` synchronizes backend OpenAPI 3.0 JSON and frontend JSON/types/manifests. `api:check` regenerates in memory, compares all five outputs, runs the package's scoped contract compiler and unit cases, and exits nonzero on failure. The manifests record schema/source hashes and generator version; they are provenance/drift indicators, not signatures or deployment attestations.

```ts
import { adsApi } from './ads-api-client';
const campaign = await adsApi().create({ title: 'Draft', budgetUsd: 5 });
// Wrong URLs, methods, required parameters, body types and enums fail compilation.
```

Components use the domain operations in `src/ads-operations.ts`. The client uses the existing session transport for authenticated operations and a separate credential-free transport for public operations. Arbitrary-origin overrides are rejected. Multipart requests retain browser-generated boundaries; binary previews use blobs. JSON successes are decoded against the exported schema before being returned. Additive response properties are allowed; missing required fields and wrong declared types fail safely.

Catch `ApiError` for safe status, code, category, operation, normalized path, request ID, field errors and outcome. Raw provider/error text is never user-facing. A mutation with an unknown outcome must be reconciled through existing identity/readback workflows before retrying. The client adds no mutation retries. A 409 budget rejection is distinct from an uncertain 503.

For regressions involving existing helpers and staff controls, also run:

```powershell
node --test shared/session/test/ads-api-integration.test.cjs shared/session/test/staff-ui.test.cjs
```

Run this command from `frontend`; despite its historical filename, this suite uses injected transports and no live HTTP server.

Coverage and limits: campaign list/catalog/capabilities/create/details/reconciliation, stacks, creatives/submission/status, prepared/direct uploads/readback/private previews and moderation controls use typed operations. Presign/complete/delete, public media, legacy review and promoter suspension are exported but have no migrated domain helper. Promoter onboarding, Auth, Billing, staff-status and other Ads domains remain legacy callers. This is an incremental foundation, not a whole-platform API-health check.

Request schema inference supports the class-validator rules used by this slice; custom validators and semantic cross-field rules still need explicit schemas and units. AJV format checks are disabled: URL/UUID/business validation remains the server's responsibility. Responses are explicitly modeled, not inferred from service return types. Controller units do not prove guards, middleware, proxies or deployed services. Component compiler tests inspect changed roots; their dependency closure is resolved, but unrelated component diagnostics are excluded. Broad app checks, real HTTP/Postman integration, staging and visual acceptance are deferred by the owner.
