# CrimFig Frontend - Serial Logs

Prior historical entries up to 2026-11-03 are archived in `frontend/SERIAL_LOGS_ARCHIVE_20261103.md`.

## 2026-11-03 - PLAN-0086 / PLAN-0087 Campaign Targeting and Auction Inspector
Added responsive Targeting & Delivery Rules card to `/campaigns/[id]` displaying Geo locations, Target Devices, and Active Hours. Added slot decision diagnostics in `/admin/ad-slots/[id]`. Production build verified across 42 routes. Commit: `32e2748`.

## 2026-11-06 - PLAN-0098 Landing-page visual review and content cleanup

Reviewed Ads, Billing and Auth using full-page browser screenshots at 1440px and 375px, plus dark-mobile views. Removed redundant showcases, hypothetical balances/calculators, bank examples and placeholder footer labels; shortened copy and fixed clipped mobile FAQ labels. All three fit 375px and remaining fragment links resolve. JSON/JPEG evidence: workspace docs/reviews/landing-cleanup-20261106. Syntax: 19 changed TSX files, zero diagnostics (not full typechecking). Existing header regressions: 6 passed, 3 failed in unchanged workspace-navigation/origin harness dependencies. Full build/type/lint, 200% zoom and deployment not run. Dark-theme logo/contrast concerns remain recorded.
