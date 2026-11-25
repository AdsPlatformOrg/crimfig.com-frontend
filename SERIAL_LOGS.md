# CrimFig Frontend - Serial Logs

Prior historical entries up to 2026-11-03 are archived in `frontend/SERIAL_LOGS_ARCHIVE_20261103.md`.

## 2026-11-25 - PLAN-0155 Daily Reports Bonus/Promo Split & Single Super-Admin Reserve Controls
- Updated `web/ads/src/lib/daily-reports.ts` & `web/ads/src/app/(workspace)/reports/page.tsx` with strict allowlisted `bonusSpend`/`bonusImpressions` (advertiser) and `promoConfirmed`/`promoPending`/`promoImpressions` (promoter) columns separated from cash spend.
- Updated `web/ads/src/components/console/AdminRewardsControlsView.tsx` to include `$cfig Conversion Reserve` (`cfig_conversion_reserve`), single `super_admin` gating on inter-pool reserve transfers and realized proceeds, and settled batch `sourceRef` guidance.
- Verification: `@crimfig/web-ads` `tsc --noEmit` (0 errors) & `next build`, `plan0102-reports` + `plan0154-rewards-controls` (`9/9`), `plan0155-reports-and-controls.test.cjs` (`2/2`). Browser verification remains DEFERRED — OWNER REQUEST.

## 2026-11-21 - PLAN-0133 Responsive Ad Slot Sizing, Shared Sample Explorer & Add an Advert
- Completed `Add an Advert` dedicated route (`web/ads/src/app/(workspace)/campaigns/[id]/stacks/[stackId]/adverts/new/page.tsx`) with `Image Ads — Available`, disabled `Text Ads — Coming Soon` / `Video Ads — Coming Soon` options, ordered upload/size-policy/destination inputs without optional Headline, idempotent `requestId` retries, and `Submit new Advert for review` CTA.
- Updated `HouseSizeSamples.tsx` / `HouseSizeSamples.module.css` (`Sample Ad #1`..`#3`, default-open explorer, `320 px` / `375 px` / `970 px` container frames with visible padding and incompatible-size notice) and `CrimFigAdSlot.tsx` (`responsiveSizing` `data-ad-format="general"` support).
- Verified `tsc -p frontend/web/ads/tsconfig.json --noEmit` (0 errors), `node --test` across `plan0133-advert-and-slots.test.cjs`, `plan0130-samples.test.cjs`, `plan0128-website-detail.test.cjs`, and `plan0129-slots.test.cjs` (`5/5` passed), and `@crimfig/api-client` (`51/51` passed). Browser/staging release pending.

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

## 2026-11-21 - PLAN-0130 / PLAN-0129 local implementation
Prepared 27 pixel-identical House sample outputs: 2,599,289 to 1,753,454 bytes (32.54% reduction). Shared non-tracking samples and inactive import/reconciliation UI; advertiser Dynamic/One Size/Selected Sizes policies; dedicated website slot pages and transactional managed lifecycle endpoints with immutable retry receipts and retirement. Verification: 45 backend units, 8 asset/sample/import frontend tests, 2 slot/website React tests, 51 contract tests (92 operations), 4 isolated PostgreSQL/HTTP cases (94 filtered), and 7 moderation integration regressions passed. Scoped Ads frontend/API TypeScript checks passed. Migration 0048 required before deployment. Actual container-measured matching deferred under the no-SDK-change instruction; saved limits are enforced. Live asset registration/activation, browser review, merge/push and deployment not performed. Evidence: ../docs/reviews/plan-0129/implementation-20261121.md and ../docs/reviews/plan-0130/implementation-20261121.md.

## 2026-11-21 - PLAN-0132 independent ownership indicators
HTML meta and DNS TXT now show independent Verified / Not verified / Expired labels and evidence-based outlines. Method check outcomes persist in existing audit history bound to the current verification-token hash, and owner-scoped website responses expose both statuses. No migration or live recheck. Backend status/proof tests 45/45 and website-detail React regression 1/1 passed; isolated verification integration checks the persisted HTML-verified/DNS-not-verified case. Browser/deployment remain deferred.


## 2026-11-21 - Verification footer cleanup
Removed the redundant delivery-status/verification-token footer from the promoter website proof section. HTML and DNS proof instructions and copy controls remain. Narrow copy-only change; inspected source diff and whitespace, no new tests or behavior changes.
2026-11-21 | PLAN-0133 / PLAN-0136 | Removed separate One Size UI; one checkbox is valid and existing saved single-size policy is retained until edited. Direct setup uses managed creation and canonical slot navigation. Live Direct slots return no fill at the shared endpoint rather than entering the Network auction while assigned-deal serving is unavailable there. Frontend 4/4, backend gating and SDK 26/26, Ads typecheck passed. Browser and deployment not verified.
2026-11-21 | PLAN-0138 | Icon-labeled actions, inline on-demand installation disclosure and slot confirmations implemented. Five focused simulated DOM checks passed, including focus, stale embed isolation, copying and cancellation. Browser and deployment verification pending.
2026-11-21 | PLAN-0131 follow-up | Display the verification cooldown in the existing dialog. Website detail test and three API response checks passed.

## 2026-11-22 — PLAN-0149 and PLAN-0145

Updated Advertiser Rewards to consume server-owned definitions and honest verification/history states. Removed hardcoded promised credits. Rebuilt the AdStation Control Center with property isolation, independent gates, table/tabs, confirmed preference saves and accessible deal dialog. Four AdStation/setup regressions and one rewards regression passed. Twelve combined frontend checks passed across reports, navigation, support, AdStation and advertiser rewards. Ads typecheck and production build passed with existing warnings. Browser fixture checks covered desktop, light/dark mobile, 320/375 widths and Escape focus return. Authenticated staging, 200% zoom, full Poppins rendering and deployment remain open. Corrected invalid UTF-8 source encoding and the support test's DOM initialization. PLAN-0149 verified badge qualification still depends on financial provenance and compliance evidence.

## 2026-11-22 — PLAN-0149 earned recognition

Advertiser Rewards now distinguishes earned badges, verified qualification and pending progress using server evidence; earned history is separate from unavailable monetary claims and legacy grants under review. One focused simulated-DOM regression passed including earned badge and legacy-contract rejection/retry. Ads frontend typecheck and production build passed with existing warnings elsewhere. Backend recognition: 9 units and 11 PostgreSQL/HTTP cases passed. Visual checks are explicitly deferred. See ../docs/reviews/plan-0149/recognition-release.md. No production deployment or monetary activation.

## 2026-11-23 — PLAN-0155 completion report verification

Confirmed Railway production frontend revision 3a7a208. The cited GitHub frontend CI run contains 11 failed results across API contract/schedule dependencies, performance reports, workspace routing, navigation and signup localization fixtures, contradicting the report's single-failure explanation. Failures require individual fixture-versus-product triage. No frontend implementation or visual changes. New DRAFT: ../.agents/plans/PLAN-0155-live-rewards-accounting-and-verification-gaps.md; evidence ../docs/reviews/plan-0155/README.md.

## 2026-11-23 — PLAN-0156 implementation and release preparation
Added Platform Access page and scoped navigation for audited database staff assignments, proposals and independent MFA approval. Preserved immutable request identity on uncertain retries and cleared authenticator inputs. Three new behavior checks passed; 266 shared-session checks passed with one explicitly opt-in loopback test skipped; 51 API-client contract checks passed; Ads production build passed with existing warnings. Repaired stale VM fixtures and migrated removed inline slot-dialog tests to the current website-scoped React/DOM creation and installation tests. Fixed lost creative filter in performance links and legacy slot-detail navigation. CI now checks out the public backend at the verified paired revision for real contract/schedule checks. Visual checks remain deferred by JED. Deployment confirmation pending.
2026-11-23 | PLAN-0156 CI follow-up | Clean-runner contract tests now require the paired backend database package to be built because staff guards import its real authority schema. Added that build before tests. Full shared-session suite passed 266; separately enabled real HTTP loopback suite passed all seven with no skips. No authorization or contract assertions bypassed.
2026-11-23 | PLAN-0158 DRAFT | Planned Users/detail pages, email-based Platform Access directory and personal name fields. Current profile edits avatar; admin grant workflow asks UUIDs. Reuse existing design/components. Business decisions recorded, implementation pending; no code or visual checks performed.
2026-11-23 | PLAN-0142/0143 COMPLETED | Exact report field allowlists and PostgreSQL HTTP reconciliation verified. Five frontend tests, Ads TypeScript, and four integration tests passed. Browser acceptance excluded from this closure.
2026-11-23 | PLAN-0146/0070 | 18 non-visual rewards regression tests passed. Browser assurance not performed in this closure.

2026-11-23 | PLAN-0139/0141/0140 local closeout | Honest loading/copy states, support thread/draft isolation and read-only owner-scoped Quality contract finished. 29 frontend, 5 backend unit and 9 PostgreSQL/HTTP integration tests pass; no skips. See ../docs/reviews/plan-0140/closeout-20261123.md for real/fake boundaries and exact evidence. Browser, full builds, release/live migration and real email remain separate.

2026-11-23 08:49 UTC | Auth email verification | Made the resend and sign-in actions full width with a 12px gap and matching default button sizing. Auth typecheck and 15 session regression tests passed. Browser layout and deployment remain unverified.

2026-11-23 12:02 UTC | Promoter website verification | Replaced the list's direct verification action with a link to the proof instructions. Moved method-specific verification controls and gated embed access below the proof cards. Ads typecheck and website-detail DOM regression passed.

2026-11-23 12:03 UTC | Promoter Ad Spaces & Slots | Disabled setup, empty-state embed snippets, and per-slot embed actions for unverified or expired ownership. Website detail DOM regression and Ads typecheck passed.

2026-11-24 12:24 UTC | PLAN-0165 | Added Ad Feedback in Delivery Performance. Navigation suite passed 9/9 and Ads typecheck passed. Browser and release checks pending.

2026-11-25 04:26 UTC | PLAN-0169, PLAN-0167, PLAN-0166 | Implemented shared legal pages & CRIMFIG footers (`LegalPages.tsx`, 7 routes x 3 portals), `/how-to-use` Advertiser & Promoter visual guide with real PNG/WebP walkthrough captures (`public/guides/{advertiser,promoter}/`), default Auth login redirect to `ads/dashboard`, direct `/login` sign-out redirect across Ads/Auth/Billing `SessionGate`, and topbar/footer FAQ cleanup. Frontend `node --test` suites (51/51; `plan0166` rerun 5/5), `tsc --noEmit` across all 3 portals, and `next build` across `web-ads`, `web-auth`, and `web-billing` passed cleanly.
