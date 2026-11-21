# CrimFig Frontend - Serial Logs

Prior historical entries up to 2026-11-03 are archived in `frontend/SERIAL_LOGS_ARCHIVE_20261103.md`.

## 2026-11-21 - PLAN-0128 Promoter Hub Navigation Nomenclature & Registered Websites Table View with Drill-Down
- **Objective:** Fix Promoter Hub navigation nomenclature to eliminate duplicate "Dashboard" labels and transform the registered websites grid into a responsive, filterable Table view with dedicated drill-down inspection.
- **Affected Repos / Files:**
  - `web/ads/src/lib/workspace-navigation.ts`
  - `web/ads/test/plan0115-navigation-dashboard.test.cjs`
  - `web/ads/src/components/console/promoter/PromoterWebsitesView.tsx`
  - `web/ads/src/app/(workspace)/promoter/websites/[websiteId]/page.tsx`
- **Changes Implemented:**
  - Renamed Promoter Hub navigation items: `promoter_dashboard` (`/promoter`) changed to "Overview", CrimFig Ad Network kept as "Dashboard" (`/promoter/ad-network`), and AdStation (`/promoter/adstation`) renamed to "Control Center".
  - Transformed `/promoter/websites` from card/grid layout into a responsive Shadcn-compatible `Table` view with domain search and status filters (`All`, `Verified`, `Unverified`, `Policy Approved`, `Policy Pending`).
  - Added dedicated drill-down detail route at `/promoter/websites/[websiteId]` featuring property overview cards, copyable DNS TXT and HTML Meta Tag proof snippets, live re-verification trigger with confirmation dialog, policy review status, and configured ad slots table.
- **Verification & Tests:**
  - `.\frontend\node_modules\.bin\tsc -p frontend/web/ads/tsconfig.json --noEmit` -> 0 errors.
  - `node frontend/web/ads/test/plan0115-navigation-dashboard.test.cjs` -> 9/9 passed.
  - `pnpm --filter @crimfig/web-ads build` -> Next.js production build succeeded with new dynamic route `ƒ /promoter/websites/[websiteId]`.
- **Status:** COMPLETED

## 2026-11-15 - PLAN-0115 Workspace Navigation Alignment, Compact Sidebar & Dashboards

Updated `workspace-navigation.ts`, `DashboardSidebar.tsx`, and `ProtectedWorkspace.tsx` to align **Advertiser Studio** (`Ads Console` -> `Dashboard`, `My Ad Campaigns`; removed `Create Campaign` from sidebar) and **Promoter Hub** (`Dashboard`, `CrimFig Ad Network` -> `Dashboard`, `Get Started` [`Setup Guide`, `On Website`, `On Mobile App`, `Affiliate Link`], `Reports`; `AdStation` -> `Dashboard`, `Setup a Direct Ad Slot`) with compact desktop sizing (`12px` items, `12px`/`2px` gaps, `34px` desktop / `44px` mobile touch targets). Updated `ConsoleDashboard.tsx` to 3 headline KPI cards (`Ad Spend`, valid `Impressions`, finally valid `Clicks`) with supporting metrics under `Additional Details`; replaced `/promoter` landing with 4-card `PromoterDashboard.tsx`; added `/promoter/ad-network`, `/promoter/ad-network/get-started`, and `/promoter/adstation/setup`; updated `AdStationWorkspace.tsx` and `PromoterIndividualsView.tsx` for explicit gating & lifecycle statuses. Verification: `tsc --noEmit` (0 errors), `node --test web/ads/test/*.test.cjs` (41/41 passed).

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

## 2026-11-13 - PLAN-0109 internal UI/UX audit preparation
Created draft plan, route coverage manifest and preliminary source findings for sign-in, Advertiser Studio and Promoter Hub. AdStation navigation exists in source; live discoverability remains unverified. Browser selection/access pending; no screenshots or application edits/tests/builds. UI and skill/rule changes await owner review. Evidence: ../docs/reviews/plan-0109/README.md.

## 2026-11-14 - PLAN-0104 Click Audit visitor continuity sync
Fast-forwarded local `frontend` `dev` (`a3a162b` -> `d14950a`, syncing `origin/dev` commit `"Show CPC visitor continuity in Click Audit (PLAN-0104)"` for `web/ads/src/app/(workspace)/admin/click-audit/page.tsx`) alongside backend PLAN-0104 `d5ff0a4`. Visual review remains skipped at owner request; live deployment remains separate.

## 2026-11-15 - PLAN-0113 adaptive hourly pacing breakdown and dev release cleanup
Updated `web/ads/src/app/(workspace)/admin/auction-logs/[requestId]/page.tsx` to display `pacingMode`, `baseHourlyAllowanceNanos`, `watHour`, and `remainingWatHours` in Capacity Rejection Breakdown for adaptive WAT pacing exclusions and removed hardcoded UTC wording in `HOURLY_PACING_EXHAUSTED`. Fixed `shared/api-client/test/consumers.test.cjs` CSS module resolution with `shared/api-client/test/css-module-stub.d.ts`, and added `web/ads/test/plan0113-auction-trace.test.cjs`. Verified `pnpm --filter @crimfig/api-client test` (44/44 passed), `node --test web/ads/test/*.test.cjs` (34/34 passed), `pnpm --filter @crimfig/web-ads typecheck` (0 errors), and `pnpm --filter @crimfig/web-ads build` (49/49 routes built cleanly). Cleaned orphaned unused marketing `.webp` assets and committed pending `docs/reviews/plan-0099/` evidence prior to `dev -> production` release.


## 2026-11-19 - PLAN-0115 dashboard follow-up and Advertiser Rewards
Restyled the Clicks count, simplified the dashboard details, and moved trophies to /advertiser/rewards. Rewards reads recorded achievements and balance on page load, defaults to Joined on a successful empty response, and surfaces loading and request failures. Code-only Ads suite: 41 passed, 0 failed or skipped (7.26s). Browser and staging verification remain deferred.

## 2026-11-19 - PLAN-0117 advertiser sidebar and Ads wallet return
Rebuilt Ads navigation with a shadcn Dialog drawer and desktop icon rail. Fund Wallet starts Billing in a separate tab. The Ads return is bound to the current funding reference and runs after Billing confirms it. Local Ads and Billing checks passed 72/72. See ../docs/reviews/plan-0117/local-verification.json for the simulated DOM and provider boundaries.
2026-11-19 | PLAN-0118 | IN_PROGRESS | Implemented Ads wallet labels, owner-scoped campaign titles, authenticated recent history preview, and full-history navigation. Three focused frontend checks passed.
2026-11-19 | Direct task | Removed two empty Advertiser sidebar group boundaries so adjacent links use regular spacing. Navigation and simulated mobile drawer checks passed 10/10. Browser and deployment not checked.
2026-11-19 | PLAN-0118 follow-up | Ads staging build now skips the recent Billing preview rewrite when the Billing upstream is absent. Explicit invalid or production upstreams still fail validation. Billing web retains strict staging configuration. Seven local routing and preview tests passed.
2026-11-19 | PLAN-0118 follow-up | Renamed the Ads billing page heading to Wallet and kept transaction table headers visible for loading, empty and unavailable states. Preview and routing checks passed 2/2.
2026-11-20 | PLAN-0121 | IN_PROGRESS | Admin ownership retests, suitability form and existing suspension mapping implemented locally. 60 unit, 23 fixture HTTP and 3 readiness checks passed. Live and browser checks pending.
2026-11-20 | PLAN-0121 | Generated Ads API contract verified (82 operations); 44/44 client and contract tests passed. Exporter stubs the verifier dependency to prevent database module loads. The regenerated contract also includes the two pre-existing direct slot review routes.
2026-11-20 | PLAN-0123 | IN_PROGRESS | Escrow burnPercent ceiling rounding, All hours of the day / custom window schedule labels, no-store readiness refresh + expanded panel state, and live-safe Campaign/Stack/Creative status & asset addition/replacement UI/client operations verified via `tsc -p frontend/web/ads/tsconfig.json --noEmit` (0 errors) and scoped `node --test` (102/102 across `web/ads`, `api-client`, and `session/plan0110-locale`). Browser/375px and staging checks pending.
2026-11-20 | PLAN-0110 | IN_PROGRESS | Phase 1 localization foundation (`locale.ts`, `catalog.ts`, `LanguagePicker.tsx`, `LocalizationProvider.tsx`, `server-locale.ts`, `money.ts`, `export-review.cjs`), session preference persistence hooks, and `docs/reviews/plan-0110/` catalog export (`21` locales, `14` commonKeys, `91` routes, `66` in-scope routes, `952` candidates) verified within `tsc` (`web/ads`) and scoped `node --test` (102/102). Note: an unscoped legacy run of `frontend/shared/session/test/*.test.cjs` had 10 failures across 6 unrelated legacy suites (`admin-repair`, `header-navigation`, `plan0078-integration`, `plan0080-review-integration`, `promoter-slot-readiness`, `staff-ui`). Phases 2-5 route translation review, app layout mounting, Ads->Auth->Billing consumer checks, and browser/RTL checks pending.
2026-11-20 | PLAN-0110 | IN_PROGRESS | Wave 1 (`en`, `fr`, `es`) scope & gap fixes: synced `catalog.ts` with `docs/translation` Batch 1 revisions (preserving `Promoter Hub`), and updated `export-review.cjs` to stop skipping user-facing `components/console/` files (`+45` files / `1,236` strings) while excluding staff/admin/diagnostic files upfront. Regenerated `docs/reviews/plan-0110/` review artifacts (`2,044` extracted occurrences; `1,998` in-scope across `1,950` unique keys / `3,900` `fr`+`es` target strings; `6` held claims; `24` fragments; `16` currency tokens). `tsc -p frontend/web/ads/tsconfig.json --noEmit` (0 errors) and PLAN-0110 `node --test` (`9/9`) passed.

---
### [ACT-20261121-002] 2026-11-21 08:15 UTC — PLAN-0126 Ownership Check Confirmation Dialog & No-Reload Fix
- **Plan Reference:** PLAN-0126
- **Files Modified:**
  - `web/ads/src/app/(workspace)/admin/websites/review/[websiteId]/page.tsx`
- **Summary:** Prevented full-page loading replacement on background refreshes (`if (!current) setLoading(true)`) and added an accessible `@radix-ui/react-dialog` confirmation modal on **Check TXT** / **Check HTML meta** that displays the verification status, response message, domain, method checked, expected token, and timestamp before refreshing background inspection data on confirmation.
- **Verification:** `tsc -p frontend/web/ads/tsconfig.json --noEmit` (0 errors) and `pnpm --filter ./web/ads... build` (exit code 0).

---
### [ACT-20261121-003] 2026-11-21 10:12 UTC — PLAN-0127 Fix Staging Ads API Origin and Lazy Embed Generation
- **Plan Reference:** PLAN-0127
- **Files Modified:**
  - `web/ads/src/components/CrimFigAdSlot.tsx`
  - `web/ads/src/components/console/promoter/PromoterWebsitesView.tsx`
- **Summary:** Fixed client-side crash on `/promoter/websites` by correcting `defaultAdsApiUrl` in `CrimFigAdSlot.tsx` to allow legitimate staging API hostnames (`ads.staging.crimfig.com`) while blocking production origins on staging, and made `generateCrimFigEmbedCode` lazy in `PromoterWebsitesView.tsx` when the modal is open.
- **Verification:** `tsc -p frontend/web/ads/tsconfig.json --noEmit` (0 errors) and `pnpm --filter @crimfig/web-ads build` (exit code 0).
