# CrimFig Hybrid Styling Architecture

Updated 2026-11-02 at JED's request. JED subsequently approved PLAN-0078 implementation on2026-11-02. The current implementation uses the shared entry and scoped Ads pipeline below; wider app rollout remains separately scoped.

Read [TYPOGRAPHY.md](./TYPOGRAPHY.md), [frontend AGENTS.md](./AGENTS.md) and the [central workflow](../.agents/AGENTS.md). Preserve the typography document's adoption status for proposed numerical targets and existing approved product/component contracts.

## Initial source audit (before implementation)

| Area | Observed state | Consequence |
| --- | --- | --- |
| Ads globals.css | Owns brand/theme/font tokens, resets, foundations and many cf- component/page rules; imports admin-report.css and shared/ui/header.css | Separate responsibilities incrementally; do not copy existing rules into a second active file. |
| Auth/Billing globals.css | App-local tokens/foundations/components; each imports shared header.css | Preserve app differences and scoped light auth behavior. No ecosystem-wide extraction in one pass. |
| shared/ui | Existing @crimfig/ui package and reusable header.css | Reuse this cross-app home rather than parallel shared directories. |
| Ads ui components | Alert, Avatar, Badge, Button, Card, Dialog, DropdownMenu, Input, Separator, Skeleton, Table, Tabs, Textarea, Tooltip | Reuse real components and variants; audit missing Sheet/Select/Label/Switch/ScrollArea before promising availability. |
| Component styling | Radix behavior, cva variants with cf-button/cf-input classes, clsx/tailwind-merge; some table utility classes and inline fallback styles | Shadcn-compatible does not mean its default utility theme or CLI pipeline is installed. |
| Tailwind pipeline | No tailwindcss or @tailwindcss/postcss package found in inspected installed paths/manifests/lockfile; no Tailwind/PostCSS config or Tailwind import/directive found | No installed compiler version can be certified. Establish the smallest approved pipeline before depending on utility generation/layers. |
| components.json | Points to tailwind.config.ts and src/app/globals.css, but referenced config file is absent | Reconcile configuration with the actually selected/locked compiler, not a copied setup. |
| general.css | No existing file found | Planned shared entry below; not yet created/imported at runtime. |

Audit scope: frontend root/Ads manifests and lockfile, Auth/Ads/Billing stylesheets, shared UI package, Ads component inventory, components.json, utility helper and installed package presence. Source audit only: no CSS build, rendered cascade or browser verification performed.

## Implemented pipeline — PLAN-0078

- Ads pins tailwindcss/@tailwindcss/postcss4.1.18 and postcss8.5.6. The Node test runner uses jsdom26.1.0 for real component composition. No second test framework was added.
- Ads globals.css declares theme, legacy, patterns, pages, utilities layers. It imports Tailwind theme/utilities with prefix(tw), source(none), explicit console scanning and no Preflight; existing token/foundation definitions and shared header remain in place.
- shared/ui/styles/general.css is the single opt-in semantic pattern entry, imported in patterns. Existing admin-report.css uses legacy; extracted moderation/House-specific presentation is admin-workspace.css in pages. Existing unrelated unlayered styles remain authoritative; the migration does not wrap/reset every application stylesheet.
- Only new tw: utilities opt into compilation. Existing unprefixed utility strings do not suddenly activate across unrelated workspaces. Component inline variant defaults remain authoritative; scoped table style props set the approved typography where the primitive exposes them.
- Ads components.json now records an empty legacy config path and prefix tw for the actual CSS-first pipeline. Other apps have not adopted the shared import or PostCSS pipeline.
- CSS compilation verifies actual imports, prefix/responsive output and no Preflight. Real React/Radix DOM tests verify one-dialog review cleanup and House Ads form state; neither proves browser layout/contrast/zoom.
- Primary setup references: [Tailwind Preflight/import guidance](https://tailwindcss.com/docs/preflight), [Tailwind upgrade/prefix/layer guidance](https://tailwindcss.com/docs/upgrade-guide). Exact implementation/results: [PLAN-0078 report](../docs/reviews/plan-0078/implementation-20261102.md).

## Responsibility boundaries

| Layer | Owns | Does not own |
| --- | --- | --- |
| App globals.css | Framework imports, theme/brand/semantic token definitions and foundational/reset/font setup | Growing catalog of page-specific layouts or duplicated reusable patterns |
| shared/ui/styles/general.css | Shared cf- typography, surfaces, section spacing, table presentation, form layout, modal presentation and empty states | Authentication/moderation logic, Radix behavior, app resets or a second token palette |
| Tailwind | Responsive layout, local spacing and component-specific adjustments once compiled | Repeated independent visual identities or undocumented replacements for component variants |
| Existing Shadcn-compatible primitives | Accessible structure, variants, disabled/loading/focus/open/selected states and composition | Permission/business policy or a wholesale unrelated demo theme |
| Scoped page styles | Moderation/House Ads-specific exceptions with an explicit root or CSS module | Broad button/input/table/dialog/heading selectors affecting unrelated workspaces |

Use semantic classes when the same visual treatment repeats. Keep one-off layout utilities local. Reusable does not mean putting every rule into general.css. Split typography/tables/forms into partials only when size and real reuse justify them; general.css remains their single entry, not a duplicate copy.

## Canonical location and imports

Use frontend/shared/ui/styles/general.css for cross-app reusable patterns, consistent with existing shared/ui/header.css. Ads globals.css imports ../../../../shared/ui/styles/general.css once. Do not create three app copies. If a bundler requires a local styles/general.css wrapper, it imports the shared entry and contains no cloned rules.

Begin runtime adoption only in approved PLAN-0078 surfaces. Initially scope new patterns beneath an explicit Admin Console boundary or use newly opted-in cf- classes. Auth, advertiser and promoter surfaces must not change merely because a shared stylesheet exists. Additional app adoption is a separate bounded migration with regression evidence.

Keep existing header.css and admin-report.css imports until their callers and ownership are understood. Moving a rule means removing the superseded active definition in the same approved slice, not leaving both imports/rules active. No double import of partials through globals and general.css.

## Semantic pattern catalog

Audit existing names/variants before adding any of these candidate classes:

| Candidate | Purpose |
| --- | --- |
| cf-page-title / cf-section-title | Typography roles mapped to actual tokens and TYPOGRAPHY.md |
| cf-surface / cf-section | Token-based surfaces and reusable section rhythm |
| cf-form-group / cf-form-label | Associated form layout and readable labels |
| cf-dialog-section | Visual grouping inside the existing accessible dialog/sheet |
| cf-data-table | Semantic table presentation; preserve headers, row meaning and responsive actions |
| cf-muted | Secondary text with adequate contrast; not a universal tiny-font rule |
| cf-empty-state | Shared empty/unavailable treatment with distinct truthful copy |

All new CrimFig reusable names use cf-. Do not rename Tailwind utilities or third-party classes to force that prefix. Existing Button/Badge/etc variants remain the first choice. General CSS must not silently override a destructive variant, disabled state, focus ring, aria state or data-state behavior. Modal CSS styles presentation only: no pointer-lock, focus-trap, portal, inert or business-state manipulation.

## Tokens and typography

Preserve Poppins and current loading/--font-primary mapping. Reference current semantic color/spacing/radius/shadow tokens, including --bg-elevated, --border-subtle, --text-primary, --text-secondary and --color-crimson where actually defined. Do not scatter raw hex/RGB values or duplicate palettes in pattern/page CSS. Literal token definitions remain at their existing authoritative location; extend missing semantic tokens minimally and document why.

Follow TYPOGRAPHY.md for hierarchy, line height, tabular numbers, metadata readability and responsive scaling. No root font-size/zoom reduction or broad h1/p reset to fix an admin view. Preserve light/dark and reduced-motion behavior. Use named variants/modifiers rather than specificity escalation or unnecessary !important.

## Tailwind and cascade prerequisites

1. Recheck manifests, installed packages, lockfile, source scanning and PostCSS/bundler configuration at implementation time; this audit found no active Tailwind compiler. tailwind-merge alone does not compile CSS.
2. Select/pin a compatible compiler/integration only within approved implementation scope. Verify the selected version's official setup, import/directive and layer conventions; do not mix recipes from different major versions or add a second reset/compiler.
3. Inventory existing unlayered CSS before declaring layer order. Ordinary unlayered author rules can outrank layered rules: simply wrapping new rules in a layer does not ensure utilities can override old declarations.
4. Specify and test the intended ordering of framework/reset foundations, tokens/base, component variants, reusable patterns, scoped page rules and utilities. Use the selected version's actual emitted layer model; document deliberate exceptions. Do not paste an unverified universal @layer recipe.
5. Keep CSS imports valid for the actual processor. Ensure shared imports are resolved once, utilities used by shared/app components are discovered, and existing variant/state rules remain effective. Confirm generated responsive/spacing utilities exist before relying on class names.
6. Extract one representative approved pattern at a time. Remove duplicate definitions, check computed behavior through authorized non-visual infrastructure where feasible, and preserve component semantics. No global reset/theme rewrite or blind class-string conversion.

## Required validation and evidence

After implementation and focused negative-first units, run applicable code-only integration/contract/regression checks under central AGENTS.md. Audit and reuse current Jest/Node, consumer and isolated HTTP/database infrastructure; do not create another test platform.

For styling changes, include actual stylesheet resolution/compiled utility and layer checks, representative component composition/variant-state checks, same-context stale refresh and cross-context privacy checks, and relevant moderation/House Ads consumer contracts. Check duplicate imports/rule ownership and unexpected public-workspace changes with scoped evidence. A string-presence test alone cannot prove cascade/contrast/focus or a compiled Tailwind pipeline. Use real installed DOM support only if present; otherwise report missing infrastructure and the smallest addition.

Record exact commands, real-versus-mocked dependencies, passed/failed/skipped counts, duration and failures/fixes in machine-readable reports plus acceptance map. Full routine application builds/type/lint, browser/visual/375px/zoom, staging/production and actual external-provider operations retain existing authorization restrictions. A scoped CSS compilation check is evidence for that pipeline, not a full app build or visual pass. This documentation-only amendment runs no application tests.
