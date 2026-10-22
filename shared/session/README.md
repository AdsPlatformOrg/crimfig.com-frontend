# Shared first-party dashboard session client

PLAN-0009 foundation, consumed by future PLAN-0010 and PLAN-0008 dashboard integrations.
The package is framework-independent. It is **not yet wired into Ads/Billing views** and
does not fix backend authorization by itself. Never use it in public publisher ad snippets.

The current Auth controller returns `{ accessToken, refreshToken, expiresIn }` directly;
this client ignores the JSON refresh token and uses the HttpOnly `crimfig_rt` cookie
through credentialed `/api/v1/auth/refresh` and `/api/v1/auth/logout` requests. Access
tokens remain in memory. Snapshots/subscriptions expose only status and expiry.

Configure exact HTTPS auth/API origins (including port). Protected requests reject
other origins, remove spoofable identity headers, omit cookies, set the bearer token
and reject redirects. Only GET/HEAD may be retried once after a 401; mutations are never
replayed. API 403 is an authorization result, not a reason to rotate the session.

Bootstrap distinguishes anonymous (refresh 401) from temporary server/network/contract
errors and performs no automatic navigation. Callers must provide accessible states
and a validated login-return flow. `safeReturnUrl` allows exact configured origins only.
Do not yet rely on the auth login page to consume an arbitrary return query: its current
flow primarily handles OAuth `client_id` / `redirect_uri` and needs coordinated wiring.

## Coordination and remaining integration gates

- One client instance shares one refresh flight and guards late results after local
  sign-out. Constructing a client per component defeats this protection.
- An optional `coordinateRefresh` adapter can serialize work. Browser Web Locks are
  same-origin; they do **not** solve simultaneous refreshes across Ads and Billing
  subdomains. Cross-tab/cross-subdomain rotation and server atomicity/family behavior
  must be resolved before production integration. No cross-origin token broadcast or
  localStorage fallback is implemented.
- No provider/components have been introduced. Reuse the current layouts when wiring
  subscriptions, session bootstrap and API helpers; no UI redesign is needed.
- Cookie scope, HTTPS, exact CORS origins, staging/local hostnames and backend token
  validation/ownership checks need end-to-end verification before enabling consumers.
- Backend refresh still returns refreshToken in JSON (ignored here). PLAN-0009 now
  preserves family IDs and serializes rotation/logout server-side. A recent collision
  returns 409 REFRESH_CONFLICT without new tokens/cookie; this client exposes a temporary
  error and requires explicit retry rather than automatically reusing the old cookie.
  Real cross-subdomain cookie/CORS behavior remains a staging gate.
- Logout clears local state even when server logout fails. The error explicitly warns
  that the cookie may remain; callers must not claim all sessions were revoked.
- A timeout on a rotated cookie remains an uncertain server outcome. Do not add blind
  automatic refresh retries; the refresh endpoint needs its own reviewed recovery policy.

## Local verification

From the frontend workspace:

```powershell
pnpm --filter @crimfig/session typecheck
pnpm --filter @crimfig/session test
```

Tests use injected fetch and the real request/response primitives to cover lifecycle,
single-flight refresh, origin/identity restrictions, retry limits, sign-out races,
expiry and error states. Browser cookie/CORS and visual verification remain future
integration gates; unit tests do not establish those capabilities.

## Application integration follow-up (2026-10-21)

Ads/Billing now consume this package through one browser-local singleton and session gate.
Auth login/MFA preserves exact allowlisted dashboard return URLs. Application integration and
its remaining gates are documented in docs/architecture/PLAN-0009-dashboard-session-integration.md.
The six additional integration tests transpile the actual app adapters/return/wallet helpers and
exercise their behavior; they do not replace real authenticated browser/cookie staging tests.


## Dashboard sign-out (ACT-20261021-021)

Ads/Billing console headers use the existing session singleton to sign out. `logout()` immediately
clears memory, invalidates pending results and publishes signOut=pending. Duplicate calls, including
synchronous subscriber reentry, share one server request. It sends the existing bearer and Auth cookie
only to the configured Auth origin with a timeout and redirect rejection; it does not refresh during
logout. Missing/expired bearer or server/network failure may prevent revocation and is shown as an
unconfirmed server sign-out. No automatic retry is made. The current client remains locked after
complete/failed/remote sign-out: bootstrap and API calls cannot silently restore authentication.
A normal explicit sign-in navigation creates a fresh page/client. Clearing memory cannot undo a
mutation already accepted by the server, and does not erase the server cookie on failure. A full page
reload can bootstrap that remaining cookie; never describe failed logout as global revocation.

`crossTabSignOut: true` enables an optional BroadcastChannel in browsers. The only outgoing message
is `{type:'signed-out',version:1,authOrigin}`. Receivers with matching Auth origin clear locally, cancel
stale results and lock without echo, network logout or refresh. No tokens, email, user IDs, payment
references or login messages are exchanged or persisted. The channel is SAME-ORIGIN only: Ads tabs
coordinate with Ads tabs; Billing tabs with Billing tabs. Different subdomains/ports, storage partitions,
unsupported/blocked APIs, closed tabs and new/reloaded documents are outside this notification guarantee.
It is a UI coordination hint, not a revocation authority. Other-origin bearer validity and refresh-family
behavior remain governed by the backend, expiry and subsequent verification. Real cookie/family staging
and cross-subdomain revocation coordination remain open. No localStorage/token relay fallback is added.

Snapshot `signOut` is null/pending/complete/failed/remote and contains no credentials. `dispose()`
removes the channel listener, closes the channel and locks the client. Dashboard singletons normally
live for the document lifetime. SessionGate displays outcome and safe sign-in links, unmounts Billing
account content and suppresses canceled bootstrap rejections. Ads suppresses protected rendering on
session change; explicit sign-in returns via navigation. Existing console header groups wrap without
adding sidebar/navigation/support features from PLAN-0011.
