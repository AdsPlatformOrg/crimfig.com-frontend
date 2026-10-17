# crimfig-frontend — Serial Activity Log

All significant changes, decisions, and agent actions are recorded here in reverse chronological order.

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
