# CrimFig Frontend - Serial Logs

Prior historical entries up to 2026-11-03 are archived in `frontend/SERIAL_LOGS_ARCHIVE_20261103.md`.

## 2026-11-06 - PLAN-0096 recorded candidate evaluation

Added safe recorded device/provenance, attempted paid policy, stage counts and rejection details to the auction inspector. House fallback policy is separately labeled and legacy missing data stays unknown. Real React server-rendered component/contract tests consume portable snapshots from the actual isolated backend runs. Seven component/contract/pricing checks passed. Visual testing and deployment remain deferred. Evidence is in workspace docs/reviews/plan-0096/frontend-tests.xml.

## 2026-11-03 - PLAN-0086 / PLAN-0087 Campaign Targeting and Auction Inspector
Added responsive Targeting & Delivery Rules card to `/campaigns/[id]` displaying Geo locations, Target Devices, and Active Hours. Added slot decision diagnostics in `/admin/ad-slots/[id]`. Production build verified across 42 routes. Commit: `32e2748`.

## 2026-11-06 - PLAN-0098 Landing-page visual review and content cleanup

Reviewed Ads, Billing and Auth using full-page browser screenshots at 1440px and 375px, plus dark-mobile views. Removed redundant showcases, hypothetical balances/calculators, bank examples and placeholder footer labels; shortened copy and fixed clipped mobile FAQ labels. All three fit 375px and remaining fragment links resolve. JSON/JPEG evidence: workspace docs/reviews/landing-cleanup-20261106. Syntax: 19 changed TSX files, zero diagnostics (not full typechecking). Existing header regressions: 6 passed, 3 failed in unchanged workspace-navigation/origin harness dependencies. Full build/type/lint, 200% zoom and deployment not run. Dark-theme logo/contrast concerns remain recorded.

## 2026-11-08 - PLAN-0100 public landing pages

Implemented image-led Ads and About pages and compact Billing and Auth pages. Added local WebP assets and license records in docs/design/plan-0100.json. Four local routes rendered HTTP 200 and five Auth public-header tests passed. Browser visual review and release pending.

PLAN-0100 browser review completed on 2026-11-08. Sixteen local desktop/mobile and light/dark captures passed layout width, image-load and fragment checks. Evidence and limits are in docs/design/plan-0100.json.

PLAN-0100 Ads follow-up: creator photo hero with no CTA, illustrative advertiser/promoter dashboards, three reduced-motion-aware scroll reveals, and /docs entry page. Four local captures passed; /docs returned HTTP 200.

## 2026-11-11 — PLAN-0099 table and status recheck

Added explicit next-direction accessible names and non-submit behavior to stack/ad sort buttons. Campaign list rows pending primary or manager review now display Under Review, matching the API category; approved delivery status and capability decisions remain unchanged. Added five hook-transition tests (mock React state/element adapter) and three pure status tests. Combined JUnit evidence: docs/reviews/plan-0099/recheck-20261111.xml, 21 passed, zero failures/skips, including six existing navigation/readiness and seven campaign-preparation regressions. No real database/HTTP, browser, staging, or deployment verification is established by these tests. Main campaign-list clickable column sorting and the plan's recorded staging/release gates remain open.

## 2026-11-11 — PLAN-0099 campaign-list column sorting

Added all eight data-column sort controls with accessible direction and page reset, URL restoration, typed client options and regenerated API contract. SQL sorts the full owner/status/search-scoped result before pagination. Metric sorts reuse the current event-attribution policy. Nineteen focused frontend tests, two backend units and two isolated PostgreSQL/real HTTP integrations pass; earlier API contract check passed 42 tests. Evidence and failure/fix history: docs/reviews/plan-0099/sorting-20261111.md. Browser/staging/deployment not run; plan remains IN_PROGRESS. Requires matching backend/frontend release and the concurrent event-attribution dependency.

## 2026-11-11 - PLAN-0102 Ads workspace access

Implemented the Ads session-gate fix. Valid sessions open the workspace. Confirmed session expiry redirects to sign-in with the dashboard return URL. A transient failure gets one automatic retry, followed by a manual retry if verification remains unavailable. Protected content stays locked while verification is unavailable. The 27 focused session and dashboard tests, Ads typecheck, and production build passed. The build emitted existing warnings outside the changed component. Evidence is in docs/reviews/plan-0102/session-access.junit.xml. Staging and browser verification remain pending.

PLAN-0099 staging recheck: Under Review returned one row still labeled Paused, with static table headers on the deployed version. Enter and Escape opened and closed the row menu with focus restored. Local campaign headers now stay mounted while results load. Seventeen focused tests and Ads typecheck passed. Browser verification of the local changes awaits the matching deployment.

## 2026-11-11 - PLAN-0102 daily Ads reports

Added advertiser and promoter report pages in the protected workspace, Lagos date filters, prior-period comparison, and campaign/ad breakdowns. Six reports and session checks, Ads typecheck, and scoped PostCSS parsing passed. Browser and staging acceptance pending.

- PLAN-0104 staging release. Ads frontend 4828c6e deployed and the Click Audit web route returned 200. Authenticated desktop and mobile visual acceptance remains open because browser automation could not initialize. See ../docs/reviews/plan-0104/staging-release.md.
