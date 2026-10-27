# crimfig-frontend — Serial Activity Log

All significant changes, decisions, and agent actions are recorded here in reverse chronological order.

## 2026-10-21
- Continued PLAN-0009 session verification: added a recoverable refresh-409 case that proves consumed cookies are not automatically retried; all 16 session tests/build pass. Updated session README for backend family/rotation changes; UI wiring remains pending.
- Started approved PLAN-0009, the prerequisite for PLAN-0010 then PLAN-0008.
- Added the framework-independent `@crimfig/session` foundation under `shared/session`,
  with memory-only tokens, refresh single-flight, exact origin checks, bounded safe-read
  retry, mutation replay prevention, sign-out guards and explicit error states.
- Registered the dependency-free package with an offline lockfile-only update; no
  existing dependency versions changed. Ads/Billing UI wiring remains future work.
- Strict TypeScript build and 15 behavioral tests passed. Legacy ESLint invocation
  passed with config/pages-directory warnings. No UI, production services or money flows changed.
- Recorded actual Auth/Billing contracts and remaining rotation/authorization gates
  in `docs/architecture/PLAN-0009-session-contract-inventory.md` in the parent workspace.

## 2026-10-17
- Completed and verified full execution of PLAN-0004 in `frontend/web/ads`:
  - Built `ConversionsTab.tsx` cockpit: conversion metrics cards, conversion ledger with 72h holdback status tags, web pixel copyable snippet, S2S cURL docs, and advertiser API key generator.
  - Built `DisputesTab.tsx`: Self-serve dispute & appeal filing modal, status timeline, 5-day SLA countdown, and transparent credit/debit records.
  - Upgraded Campaign Wizard with pricing model selection (`CPC`, `CPM`, `CPA`, `CPCV`), target CPA input, and 72-hour holdback guidance notices.
  - Sub-navigation routing in Advertiser Studio (`conversions`, `disputes`), Promoter Hub (`disputes`), and Admin Console (`disputes`).
- Brand Identity & Landing Page Hardening (PLAN-0007 & Brand System):
  - Created reusable `CrimFigLogo.tsx` and `AuthBrandHeader.tsx` components.
  - Refactored all 8 auth sub-pages to use standardized brand headers.
  - Distributed official brand assets and generated dynamic 1200x630 `og-card.png` social cards across all 7 web apps.
  - Verified zero TypeScript compilation errors and clean Next.js 15 production builds across all 7 frontend apps.

## 2026-10-12
- Completed and verified full execution of PLAN-0001 and PLAN-0002 in `frontend/web/ads`.
- Implemented guided multi-asset campaign creation wizard with asset moderation lifecycle.
- Implemented 3-tier promoter dashboard with category filtering, marketplace, and embed code generator.
- Implemented financial cockpit in `BillingLedger.tsx` with role switcher, available vs escrowed balance cards, live FX ticker, and ledger table.
- Implemented Paystack deposit modal (`FundWalletModal.tsx`) and NUBAN bank withdrawal modal (`WithdrawFundsModal.tsx`).
- Implemented `EscrowBreakdownDrawer.tsx` for campaign escrow runway monitoring.
- Verified typecheck and Next.js 15 production build across all 7 frontend apps.

## 2026-08-09

- Repo split executed: `crimfig.com/frontend/` promoted to standalone `crimfig/crimfig-frontend` git repository.
- Phase 0 Foundation complete: all web/* and mobile/* app directory scaffolds in place.
- Architecture plan finalized (v5): two-repo split, Next.js 15 for web, React Native + Expo for mobile.
- Cross-repo API types: generated from backend OpenAPI spec via `openapi-typescript` (Phase 1 workflow).

## 2026-10-21 — PLAN-0009 dashboard session integration
- Wired Ads/Billing per-app memory-only session clients, same-origin authenticated API calls and loading/anonymous/temporary-error console gates; landing pages preserved.
- Safe login/MFA dashboard return, credentialed Auth calls and MFA token stripping before OAuth consent.
- Corrected local Ads/Billing proxy ports; added workspace dependencies without changing versions.
- Cleared Billing sample account defaults, validated real zero wallet contract, removed funding-failure synthetic credits and showed errors honestly.
- 22 session/integration tests pass; app typechecks/builds pass. Lint has no errors and two existing hook warnings. Browser gate checks include 375px width and isolated anonymous Auth fixture.
- Remaining demo/mutation/subscription cleanup, private owner/staff preview, logout coordination and real authenticated/staging/theme checks remain open. No deployment or live money/login actions.

## 2026-10-21 — PLAN-0009 Ads helper/media follow-up
- Removed helper demo rows/balances and fabricated dispute/key/settlement success; real empty results preserved, errors/retries explicit and mutation rows change only on confirmed response.
- Added canonical same-origin bearer/blob owner and moderation media previews, abort/revoke cleanup; no bearer or unauthenticated preview fallback to external creative hosts.
- Ads ledger waits for real wallet data; no sample transactions. Funding/withdrawal opens Billing instead of mounting simulated dialogs. API key secret and conversion/rebate micros mapping use server contracts.
- 29 frontend tests and 87 backend tests pass; Ads builds/typechecks and lint pass. Existing PromoterQualityCard hook warning remains; moderation callback dependency warning fixed.
- Browser read-only fixtures verify loaded blob image, light/dark/mobile preview and explicit denied manager queue. Existing mobile header crowding/378px document at 375px viewport remains an open UI gate.
- Root dashboard/quality/campaign/site demos, promoter placement choices, dedicated Billing simulations/subscriptions, logout and real authenticated/Firebase/staging/financial gates remain. No deployment or live money/account mutations.

## 2026-10-21 — PLAN-0009 account workflows and analytics
- Replaced Ads campaign/dashboard/quality demo data with owned/public API reads; missing metrics remain unavailable, raw events and estimated costs are clearly labeled.
- Campaign/creative/review sequence surfaces partial saved IDs and freezes ambiguous attempts; status/replacement/site/verification/consent changes require server confirmation. Unsupported creation/targeting disabled.
- Actual saved placement links and appeal IDs; ownership token no longer offered as publisher key. Existing header wrap/height corrected without draft sidebar work.
- Billing bank resolution/save now API-backed with stale-input protection; real directory/cards/catalog/subscription reads, no local subscription activation/withdrawal/rewards credits; safe provider checkout URL mapping.
- 40 frontend tests and 10 targeted backend security tests pass; Ads/Billing frontend and Billing Nest builds pass; lint clean apart from existing configuration notices.
- Browser fake-account fixtures denied every mutation and confirmed real zero, failed-write state preservation, failed-resolution save blocking and unavailable subscription checkout; mobile Ads no longer overflows the viewport.
- Remaining website-verification transport hardening, financial idempotency/reconciliation/checkout returns, logout and real staging gates remain. PLAN-0009 IN_PROGRESS; no live payment/provider/DNS/migration/deployment actions.


## 2026-10-21 — PLAN-0009 moderation approval wording (ACT-20261021-016)
- Manager button now says Approve Campaign: backend manager approval/override leaves approved campaigns paused until Billing atomically funds activation. Existing styles/layout retained.
- 40 frontend tests, Ads tsc and production build pass; targeted lint has only existing legacy configuration notices. Render-only actual-component fixture verified label in light/dark and narrow disabled layouts; existing narrow toolbar crowding remains a follow-up. Fixture cleanup/viewport reset completed. No real account/API actions or deployment.


## 2026-10-21 — PLAN-0009 funding return and ledger integration (ACT-20261021-019)
- Billing root resolves provider references/console routing before showing the landing page. Reference/trxref must be valid and agree; URL status/paid flags never confirm payment. SessionGate still authenticates before owner-scoped verification.
- New funding-api helper validates pending/completed/already-completed funding responses, exact returned reference/type/provider/status and cents. UI shows checking/pending/confirmed/invalid/unavailable with explicit status checks. Confirmed payment and wallet/ledger refresh outcomes are separate; no optimistic balance credit or automatic checkout replay.
- Checkout acknowledgement must include the saved reference/transaction ID, matching amount and approved HTTPS destination. Ambiguous starts preserve known server reference in the current URL and block another attempt; unknown-reference starts direct users to pending transaction review. Save-card checkbox now starts unchecked. Durable initialization request identity/reload-spanning reconciliation remains a gate.
- Transaction history now consumes the actual items/total API shape, validates cents/dates/null NGN and displays actual pending entries with Check payment recovery. Old transactions-field mismatch no longer silently looks empty. Wallet read failure/loading renders unavailable/dash rather than a zero; confirmed real zero remains zero. FX source displayed without unsupported live-CBN/zero-spread/instant-settlement claims in this console flow.
- Generation/unmount guards suppress stale wallet/verification/checkout navigation; same-component concurrent verification shares its pending promise. Manual recovery retains the selected reference, and confirmation dismissal removes reference/trxref while retaining console navigation.
- Existing Billing header now wraps and reserves its actual height; layout/design tokens preserved. No sidebar/support/status-site scope executed.
- Verification: 49 frontend tests pass (9 new funding-return/helper cases), final Billing production build and separate post-build TypeScript check pass; targeted lint has no code warnings/errors, existing legacy config/workspace notices only. An interim tsc/build overlap caused generated-type file errors; post-build check resolves that test-order issue. Backend unchanged this slice (latest prior suite 178 pass).
- Browser actual-app fixtures: URL status=success remained pending; explicit read confirmation refreshed API balance; mismatched receipt rejected; conflicting references triggered no lookup; one ambiguous checkout POST preserved its reference without replay; actual ledger includes null-NGN receipt and pending check action; confirmed payment plus failed balance refresh displays unavailable balance. Light/dark and narrow layout inspected; document width 370 equals viewport 370 in the 375px override. Initial fixture/build overlap was isolated by restarting fixtures after build; final browser checks ran on development assets.
- Temporary fake-account/provider-free servers and script removed; theme/viewport reset. Local screenshot saved in the session visualization directory for review. No live accounts/provider/payment/FX/database/storage requests, schema changes, migrations or deployment.
- Remaining: real browser cookie/payment callback and PostgreSQL/provider staging; initialization request identity and persistent ambiguous-result recovery, FX policy, legacy financial repairs, withdrawals/subscriptions/funded settlement, logout coordination and remaining UI/copy gates. Existing public landing financial/availability claims and narrow moderation toolbar remain follow-ups. Auth build attachment deferred; PLAN-0009 IN_PROGRESS, 0010/0008 queued, 0011 DRAFT, 0012 PRE-DRAFT.


## 2026-10-21 — PLAN-0009 durable funding initialization/recovery (ACT-20261021-020)
- Funding POST requires UUID v4 requestId; owner-scoped SHA256 reference, locked insert claim and immutable amount/consent/email/callback/mode binding. Only the creator initializes Paystack; repeated/concurrent calls recover without another provider/FX call. Unique existing reference/metadata used; no migration.
- Owner-only GET funding-requests/:requestId performs recovery with no provider mutation. Pending-ready returns validated checkout; ambiguous-started stays blocked; completed never returns checkout. Checkout persistence shares completion lock/re-reads metadata so early callbacks retain receipt/completed state.
- Console persists opaque funding_request before submission, recovers on reload and resumes existing checkout only on explicit action. Explicit owner 404 permits submission under the SAME ID; invalid/conflicting parameters rejected; no credentials stored in URL/localStorage. Missing secure UUID capability fails before POST.
- Final checks: all 184 backend tests/12 suites and 53 frontend tests pass; Billing API Nest/frontend production builds, separate post-build tsc, targeted backend/frontend lint and whitespace checks pass. Existing frontend toolchain notices only. Transaction/provider mocks and loopback fixtures only; no real database/provider/FX accounts or funds.
- Actual-app browser: repeated recovery and reload show original checkout with new funding disabled, real zero balances preserved, mobile width 370 <= viewport 375, light/dark inspected. Fixture counters: five GET recoveries, ZERO checkout POSTs. No provider navigation performed. Screenshot saved; preview servers/script removed, theme/viewport restored.
- Remaining: real PostgreSQL constraints/interleavings/crash/timeout proof, provider/browser staging, richer persistent/operator reconciliation and FX policy, historical financial repair, funded settlement/withdrawal/subscription state machines, logout/cross-tab and remaining UI/copy gates. Crash before dispatch or before ready persistence intentionally does not reinitialize; no automatic expiry/replacement ID. Cross-device request discovery not implemented.
- JED authorized merge to dev, then production, then push origin AFTER PLAN-0009 completion. No merge/push now; plan remains IN_PROGRESS. Approved order 0009 -> 0010 -> 0008; 0011 DRAFT/0012 PRE-DRAFT unchanged. No live operations/migrations/deployments. Auth build attachment deferred.


## 2026-10-21 — PLAN-0009 dashboard sign-out/peer coordination (ACT-20261021-021)
- Both console headers expose Sign out through the existing shared session singleton. Clear memory/generation before bounded Auth logout, share duplicate/reentrant calls, never refresh/replay logout; pending/success/unconfirmed failure feedback in SessionGate. Failure leaves current document locked and explicitly warns cookie may remain; signed-out clients cannot silently bootstrap/API refresh. Normal explicit sign-in navigates anew.
- Same-origin BroadcastChannel sign-out hint contains only type/version/Auth origin. Matching peers clear/lock without echo or network logout; stale refresh/API results rejected. No tokens/user/payment data or login authority transmitted/persisted. Blocked/unsupported transport still allows local sign-out. dispose removes listener/channel. Different origins/subdomains/ports/partitions/new documents are outside notification guarantee; real revocation/cookies/staging remain open. Full reload after failed server logout may reuse remaining cookie; no global sign-out claim.
- Existing header groups wrap in Ads and Billing; existing gate card uses border-box. No sidebar/support/navigation feature execution. Actual console mobile width now 370 <= 375px viewport in both apps; signed-out gate 375=375. Light/dark controls/gate checked.
- Verification: 60 frontend tests pass (7 new peer/logout/reentrant cases); final Ads/Billing production builds and separate post-build types, targeted lint and whitespace checks pass. Existing frontend toolchain notices only. Browser actual-app mock-only checks: Billing logout failure shows unconfirmed; paired Billing tab immediately locks; no peer logout/refresh; Ads and Billing successful logout show confirmation; safe sign-in return query preserved. Before extra reload checks counters were 3 refreshes/2 explicit logout requests; final 5 refreshes/3 explicit logouts after two intentional new document checks. No real credentials/account/provider requests. Ads fixture analytics deliberately unavailable, not financial-data acceptance.
- Temporary fixture servers/script removed, viewport restored, Ads appearance restored to light; mock sign-out screenshot retained. Backend code unchanged; latest prior backend suite 184 pass. Real PostgreSQL not tested: psql/pg_ctl absent from PATH, installed Docker client found but Docker Desktop Linux engine pipe unavailable (not started).
- JED explicitly approved EVERY phase of PLAN-0009 for execution; approval recorded in plan/registry. Existing dev -> production -> push origin authorization remains conditional on completing/validating the plan; no merge/push now. PLAN-0009 IN_PROGRESS; 0010 -> 0008 queued, 0011 DRAFT, 0012 PRE-DRAFT. Auth build attachment deferred. Remaining financial/FX/reconciliation/DTO/copy/moderation and real multi-origin/provider/database staging gates remain open. No live funds, database changes, migrations or deployment.


## 2026-10-21 — PLAN-0009 FX integrity, appearance/honesty and real funding PostgreSQL checks (ACT-20261021-022)
- JED reiterated approval/execution for every PLAN-0009 phase; retained existing approval and conditional dev -> production -> push origin AFTER completion. No phase permission requested; plan remains IN_PROGRESS.
- FX now accepts only successful USD provider data with finite positive NGN, provider update age and persisted retrieval age <24h/nonfuture. Persist actual exchangerate_api identity and canonical six-decimal quote; same snapshot/rate ID used in conversion. No hardcoded/emergency/stale rate substitution or embedded fallback key; optional configured keyed fallback only. Bounded redirect-rejecting requests, shared refresh flight, no key/URL error logs. Historical unproven rows rejected. Provider docs checked; economics/license/custody/expiry still rollout gates.
- FX routes now authenticated; manual refresh 503 until operator/rate-limit controls. History limited 1–100 and excludes raw responses; conversion rejects fractional/truncated/conflicting/unsafe minor units and preserves zero. Withdrawal creation and subscription charging explicitly fail at service entry before side effects. Signed transfer callbacks return retryable unavailable without unsafe legacy balance writes/processed acknowledgement; funding charge path preserved, unknown signed events ignored. Financial state machines are NOT completed by quarantine.
- Actual downloaded Poppins variable wired into both app font tokens; synchronous theme bootstrap validates light/dark before content, defaults light, tolerates blocked storage. Duplicate theme controls and storage events synchronize, listeners cleaned, aria-pressed added. Ads resolves console routing before public landing render. Remaining alert popups replaced with existing accessible feedback; existing moderation toolbar wraps/loading heading honest. Billing landing navbar wraps/reserves actual height.
- Corrected unsupported Billing/Ads landing payout/latency/SLA/certification/current-FX/automatic-verification and rewards claims. Simulations/hypothetical pricing and points explicitly labeled; no example amounts credited as account funds. Unsupported SDK/mobile/settlement availability described honestly; PLAN-0010 installation and PLAN-0008 rewards not implemented here. Broader copy/DTO/a11y inventory remains open.
- Final verification: 204 backend tests/14 suites (including 13 FX cases, 3 FX HTTP cases, 4 unavailable-payment cases); 62 frontend tests (2 new invalid/blocked theme bootstrap cases). Billing Nest build, final Ads/Billing frontend builds and separate post-build types, targeted backend/frontend lint and whitespace pass. Existing frontend toolchain notices only. Early sandbox-only full HTTP suite had EACCES; authorized loopback run passed. No dependencies/version changes.
- Real PostgreSQL: elevated read-only discovery found PostgreSQL 17 service running; existing local server login required unavailable credentials and was not changed. Installed binaries started a separate random-password SCRAM temporary cluster on 127.0.0.1:25432. Dedicated plan0009_test, real pg pools/Drizzle/selected schema constraints, three distinct backend PIDs. Seven funding tests PASS: same-intent one credit, different intents sharing wallet, trigger failure rollback/retry, reference uniqueness, concurrent init one provider call, ambiguous recovery across service instances, real advisory lock timeout ~5s/no money write. Initial fake checkout lacked access_code; fixture corrected and await-all cleanup added, final run passes. No existing/prod schema migration or real provider. Actual Auth/escrow PostgreSQL/process-crash/provider/cookie staging remain open.
- Actual-app mock browser: saved dark survives reload; header/footer controls synchronized; generated Poppins font family applied; Billing landing and Ads moderation in light/dark narrow layouts fit (370px document <=375px viewport). Data/provider fixture only; Ads analytics intentionally unavailable. UI fixtures stopped/removed, appearance/viewport reset. Temporary PG stopped; exact verified temp directory/password/data and workspace pointer removed. Screenshot retained.
- Current acceptance matrix: docs/architecture/PLAN-0009-acceptance-checkpoint.md. Remaining: operator/historical reconciliation, funded attributed settlement, payout/subscription state machines, real Auth/campaign escrow PostgreSQL/crash tests, real multi-origin/cookie/storage/provider staging, complete DTO/OAuth/accessibility/reduced-motion/copy audits. Auth build attachment deferred. Plan order 0009 ->0010 ->0008; 0011 DRAFT/0012 PRE-DRAFT unchanged. No live funds/accounts, existing database writes, merge, push or deployment.


## ACT-20261021-024 — dashboard dialog keyboard/focus and motion

- Shared DOM-only dialog behavior and app hooks added to the existing Ads campaign/website/legacy
  embed panels, creative replacement, and Billing funding/withdrawal/bank panels. Named dialog
  semantics, associated form labels, named close buttons, initial focus, Tab/Shift+Tab wrapping,
  topmost Escape, background inertness, scroll locking and invoking-focus restoration added.
- Counted inert/scroll cleanup preserves nested dialogs and out-of-order underlying unmounts.
  Session/view gates deactivate hidden Ads panels. Normal focus scrolling reveals offscreen controls;
  bounded scrolling panels fit short viewports. Existing overlays clear the sticky error banner.
- Billing withdrawal remains explicitly unavailable with disabled submission; Ads website copy states
  publisher installation is unavailable. Existing design/tokens retained. Both app styles honor
  prefers-reduced-motion without hiding loading/status text.
- Actual-app mock-only browser checks from the preceding implementation pass: Ads campaign and
  website dialogs, Billing funding/withdrawal/bank transition, actual replacement component and a
  nested-dialog harness. Tab/Escape/focus restoration, inert/overflow cleanup and 375x600 short-panel
  scrolling verified. Focused last submit bottom 551px within 600px viewport. Light/dark inspected;
  screenshot retained. Temporary fixture routes/scripts/listeners removed; appearance/viewport reset.
- Validation completed on continuation: 62 frontend tests PASS, Ads/Billing production builds PASS
  (only / and /_not-found; no fixture routes), separate post-build types PASS, targeted lint and git
  diff whitespace PASS. Existing legacy ESLint/pages-directory/workspace-lockfile notices remain.
  Backend unchanged: prior 204 general plus 16 separate PG cases remain earlier evidence.
- Limits: reduced-motion rule parsed by browser but actual OS preference not emulated; no assistive
  technology/cross-browser certification. Full token/contrast/form/DTO/copy review remains open.
  Unused Ads WithdrawFundsModal.tsx still contains simulated account/payout success; repository
  search finds no callers. Remove or replace it before later reuse; it is not a supported workflow.
- No live account/provider/funds/database operations, migrations, merge/push or deployment. Every
  phase remains approved; PLAN-0009 IN_PROGRESS, then 0010 -> 0008. Auth build report still deferred.


## ACT-20261021-025 — remove obsolete simulated payment components

Removed the unused Ads FundWalletModal.tsx and WithdrawFundsModal.tsx (697 lines). They generated
fake payment references, delayed success callbacks, a fabricated verified bank holder and hardcoded
FX. Repository source search found no imports/callers before deletion. Current Ads BillingLedger
funding/withdrawal buttons already open the authenticated Billing console; no rendered layout, styling
or active financial workflow changed. Historical log entries remain historical, not current capability.

Final Ads production build and separate post-build TypeScript check PASS. All 62 frontend tests PASS;
BillingLedger targeted lint and git whitespace check PASS (existing lint/workspace notices only).
Post-deletion source search finds neither component nor their fake reference/name/default rate in Ads.
No new browser fixture was needed for unreachable source deletion; this slice does not claim a new
visual/real-provider test. Earlier dialog/browser evidence remains separate. Billing/backend unchanged.

This closes the unused-component cleanup listed in ACT-024. Financial/operator/historical workflows,
remaining DTO/OAuth/accessibility/copy audits, and real cookie/provider/storage/process-crash/deployed
schema acceptance remain open. Every phase approved; PLAN-0009 IN_PROGRESS; then 0010 -> 0008.
No live payment/account/database operations, migrations, merge/push or deployment.


## ACT-20261022-001 — consent bearer continuation and conversion currency honesty

Auth consent now recovers through the existing shared memory-only session client at the Auth page's
exact origin. Refresh uses its first-party cookie; approval sends bearer to the Auth proxy only, with
cookies omitted by the protected-request contract. Callback never receives the bearer. One explicit
approval attempt per mounted page prevents double click and uncertain write replay. Missing/duplicate
parameters, unsupported response type, unsafe callback scheme/credentials/fragment and mismatched
code/state responses fail closed. Only HTTPS or HTTP loopback callbacks are supported by this UI;
custom native-app schemes require a separate reviewed contract. Backend still validates registered
client/callback before issuing a code. This does not certify the full OAuth scope/PKCE/Redis lifecycle.

Conversion ingest preserves explicit zero and rejects negative/nonfinite/unsafe micro-unit values.
Non-USD amounts no longer receive an invented 1:1 USD normalization. Original currency/value retained;
USD normalization stays null without a validated conversion. Historical non-USD normalization is not
automatically repaired: frontend excludes it from USD display rather than treating it as audited FX.
Frontend validates micro-unit amounts, keeps missing values null and shows unavailable aggregate USD
revenue/CPA when incomplete. A genuine USD zero renders $0.00. Conversion loading has a status instead
of initially flashing zero metrics. Removed unsupported signed-click, guaranteed clearance/dedupe,
automatic wallet clawback and settled/released claims. A hold timestamp is not a settlement receipt.

Verification: 212 general backend tests PASS (16 opt-in PG skipped); 67 frontend tests PASS; final Auth
and Ads production builds PASS; separate post-build types PASS; Ads Nest build, targeted backend/frontend
lint and whitespace PASS. Prior 16 real PostgreSQL cases remain earlier evidence, not rerun here.
Initial Auth sandbox output-directory EPERM resolved by authorized build; inferred optional-field type
corrected before final passing build. Existing toolchain notices remain.
Actual-app loopback fixtures: consent success reaches synthetic callback with exact code/state; failure
shows explicit alert and disabled repeat action. Counts: two refreshes/two approvals, bearer present;
no real registration/permission/provider. Conversion component shows zero as $0.00, non-USD/missing USD
as dash and incomplete totals unavailable; loading status and unconfirmed settlement text inspected.
Screenshots saved; both temporary servers/scripts and Ads fixture route removed; fixture tabs closed.
No new cross-browser/assistive-technology/mobile-theme certification claimed.

JED requires approved plans to run to completion without per-phase approval; policy recorded in plans
README (ACT-20261021-026). Execution continues autonomously. Two material inputs requested, not phase
approval: identify non-production staging configuration/test accounts/payment+storage sandbox for real
acceptance; resolve original dashboard scope (unsupported actions honestly disabled) versus later
checkpoint requirements for a complete financial settlement/payout/subscription engine before merge.
No staging descriptor was found in repository filename discovery; existing Auth/database env values
were not printed and are not assumed to be staging. Do not use production credentials for tests.
Plan remains IN_PROGRESS, all phases approved, conditional dev -> production -> origin not executed.
No live account/provider/funds/database operations, migrations, merge/push or deployment.

## ACT-20261022-010 — Withdrawal confirmation checkpoint (2026-10-22 09:22 UTC)

PLAN-0009 remains IN_PROGRESS. User requested frontend/backend checkpoint commits followed by
continued execution. Includes previously accumulated PLAN-0009 work; these are local checkpoint
commits, not plan completion, release merges, push or deployment.

New frontend: review gross USD debit, FX, gross NGN, transfer fee, stamp duty and net NGN before
confirmation. Quote edits invalidate review. Durable URL request UUID precedes the first payout POST;
unknown outcomes/reloads expose GET recovery without repeating a transfer. Server status drives results;
wallet refresh reads real API data. Immutable quote and recovery helper tests cover expiry, fee totals,
foreign details, malformed statuses and no automatic replay.

Verification: 73 frontend tests PASS; Billing production build and post-build types PASS; targeted lint
PASS (existing config warnings). Browser synthetic-only checks: light/dark quote, 343px container,
pending submission and reload preserving request UUID. Temporary fixture removed before final build.
Backend general suite: 288 PASS, 39 opt-in skipped; separate earlier Docker PostgreSQL run 39 PASS.
Billing backend build and diff whitespace checks PASS. local-docker remains ignored; no real transfer.

Still open: explicit undispatched cancel/dispatch UI, fee-aware failure/reversal reconciliation,
provider acceptance, funded settlement, subscription engine and remaining full-plan acceptance gates.

## ACT-20261022-011 — Continued refund recovery (2026-10-22 09:30 UTC)

Checkpoint commits created on dev: frontend fd99f8f, backend 3313be3. No push/production merge.
Continued immediately: unsent reservation cancellation UI and exact-reference cancellation response
validation; new API test. JED's subsequent decision: deduct confirmed non-refundable charges from
failed/reversed withdrawal refunds. Quote UI discloses this and original-rate nearest-cent rounding.

Backend now supports atomic fee-deducted refunds only when a separately reviewed internal evidence
receipt matches reference, quote, mode, currency, outcome and transfer code. Costs must be nonnegative
integer kobo within the quoted fee/levy limits; two different reviewer identities are required. Missing
proof retains the reserve. Original FX converts retained costs; receipt records refund and retained
amounts. Concurrent failure/reversal completions refund once. This is the ledger consumer, NOT a
completed operator evidence-ingestion/approval workflow; no public endpoint can submit that receipt.

Evidence: 32 fee/refund math tests PASS; 41 separate real Docker PostgreSQL tests PASS using synthetic
reviewed evidence. No actual transfer/refund, production data changes or provider-fee acceptance.
Provider sources: https://paystack.com/docs/api/transfer/ ;
https://paystack.com/docs/api/transfer-control/ ; https://support.paystack.com/en/articles/7573314 .
Provider samples do not establish levy refund semantics: fee_charged alone is not a reconciled net cost.
Remaining: operator evidence workflow, full UI verification for this addition, settlement, subscriptions,
and all remaining acceptance gates. Execution continues; PLAN-0009 remains IN_PROGRESS.


## ACT-20261022-019 — Continuous implementation and verification

Refund review checkpoint: full backend suite 332 PASS, 42 opt-in PG cases skipped (Docker engine unavailable). Frontend 75 PASS from preceding run; final Billing production build and post-build tsc PASS; temporary fixture removed. Actual refund component in synthetic 375px iframe: viewport/document both 375, light/dark and keyboard focus inspected. No provider calls in fixture. Ads attribution prerequisite removes default signing secret, validates versioned token structure/TTL/IP and persisted serve binding, and rejects fabricated mobile attestation/reward success. Initial 20 token tests and Ads build PASS; expanded checks pending. Plan remains IN_PROGRESS; settlement/subscriptions and real provider/environment acceptance remain open.


## ACT-20261022-020 — Subscription engine and approved ad price units

- JED confirmed standard CPM per 1,000 eligible impressions and CPC per eligible click. New campaign/serve pricingVersion=2; historical rows stay version 1. Migration 0015 is registered after journal entry 0013; existing standalone/unregistered 0014 is not silently adopted. Migration has NOT run against existing databases. Auction ranks normalized eCPM but records immutable per-event nano-USD prices; exact carry avoids per-impression cent rounding. Six pricing tests pass.
- Subscription initial checkout: request UUID persisted before one provider initialize; common atomic completion for signed webhook and server Verify callback; exact amount/currency/mode/email/owner/intent binding. Paid entitlement has a bounded UTC calendar period and verified receipt. Callback routing separates subscription payments from wallet funding.
- Recurring engine: explicit authenticated consent, owned saved authorization, fixed USD price and maximum NGN debit; durable generation/reference before one charge call, no resend after uncertainty, period-end cancellation, recovery after cancellation preserves paid access but keeps future renewal disabled. Bounded worker scans use cursors to avoid starvation and require BILLING_SUBSCRIPTION_RENEWALS_ENABLED=true (not enabled locally).
- Dashboard: one-period checkout/recovery integrated; recurring-consent UI still pending. Synthetic actual-component browser proof: one POST total across checkout/status confirmation, 375px viewport/document, light/dark and keyboard focus inspected. Fixture removed.
- Verification: 370 general backend PASS; 48 separate real PostgreSQL cases PASS (new disposable SCRAM PostgreSQL 17 fallback, provider doubles only), all temporary cluster files removed. Frontend 80 PASS. Final Billing frontend production build/post-build tsc PASS. Ads/Billing Nest builds PASS; targeted backend lint PASS. Latest pricing/token focused suites 29 PASS. Full suite predates the six new pricing cases; no inflated combined final-run claim.
- Remaining: funded settlement/clearance and historical reconciliation; renewal settings UI and expanded release/worker/provider acceptance; session/OAuth/a11y/DTO/deployed configuration checks; final merges and push. No actual provider payments/charges/transfers, production migration, merge, push or deployment.

## ACT-20261023-001 — Requested dev / production synchronization

JED explicitly requested committing current work to dev, merging to production and pushing origin after updating RAILWAY_API_TOKEN. This request supersedes the earlier conditional release timing; PLAN-0009 remains IN_PROGRESS. Verified 381 general backend tests PASS, 53 isolated PostgreSQL tests PASS (temporary cluster removed), 80 frontend tests PASS, Ads/Billing backend and frontend production builds PASS, Billing post-build types PASS and changed backend TypeScript lint PASS. Initial sandbox loopback/PostgreSQL failures were resolved by authorized execution outside sandbox; directory-wide lint included generated JS, then changed-source TypeScript lint passed.

Next PLAN-0009: complete funded-claim rejection/rebate workflow; verify the present recurring-preferences UI; historical financial reconciliation and deployed schema/migrations 0015/0016 review; provider/worker/callback, real session/cookie/OAuth and accessibility/DTO acceptance. No production database migration or provider money operation performed. Railway deployment outcome is not established by Git synchronization.

## ACT-20261023-003 — Production deployment repair

Fixes: pnpm workspace frontend build context and dependency-first typecheck; compiled database package exports plus stale generated-source removal and runtime smoke gate; Ads DATABASE_URL support and private-network DB_SSL handling; truthful Ads/Billing readiness; bounded migration diagnostics and Auth read-only preflight separated from startup. Railway configuration staged with secure references to Auth JWT_ACCESS_SECRET and repository-root frontend builds. Verification so far: frontend workspace typecheck, three affected frontend builds and 80 tests PASS; backend 381 tests PASS before final database-module/readiness changes; focused final checks pending. No production migrations or real provider money operations. Detailed diagnosis in workspace docs/architecture/PLAN-0009-production-deployment-diagnosis.md. PLAN-0009 remains IN_PROGRESS.
## ACT-20261023-007 — Deferred campaign creation wizard plan

JED requested a new plan for later redesign of the Create Ad Campaign modal into a dedicated page with a guided wizard. Created workspace plan .agents/plans/PLAN-0013-campaign-creation-page-and-guided-wizard.md and registry entry as DRAFT. Proposed campaign details, creatives, audience/placements, budget/schedule and review steps; save/resume, previews, accessibility, supported-field validation and recoverable submission. Draft saving, moderation submission and paid activation remain distinct. No application implementation, modal change, migration or deployment. Existing approved plan execution order is unchanged.

## ACT-20261027-016 â€” Chibi ninja avatar presets and cross-app identity

Added 12 CC0-1.0 chibi ninja avatar presets from the verified OpenGameArt pack by ashuuya, with source/license/manifest documentation. Implemented Auth profile avatar columns/migration, `/me` avatar resolution, preset catalog and selection/reset API, Auth `/profile` picker with attribution modal, shared session profile caching, and header avatars in Auth, Ads, and Billing. Auth/Ads/Billing typechecks and production builds pass; Auth backend suite 426 passed. Browser verified desktop and 375px profile, selection/save/reset, modal links, and Ads/Billing headers. Custom photo upload, dark-theme browser acceptance, header dropdown, production migration and deployment remain.
