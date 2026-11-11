# Frontend Repository Guidance

Follow the existing [central operational guide](../.agents/AGENTS.md), including authorization, security, test isolation and release boundaries. This file supplements that guide for frontend work. No feature implementation is approved by adding these instructions.

## Mandatory frontend UI and typography rules

Before designing, generating, editing or reviewing **any frontend UI**, the agent MUST:

1. Read [`TYPOGRAPHY.md`](./TYPOGRAPHY.md) in full. Follow existing approved brand/accessibility requirements and its applicable guardrails; respect the document's approved PLAN-0078 scope and proposed wider adoption and record unresolved policy conflicts.
2. Read the existing CrimFig design tokens, applicable UI/UX and accessibility guidance, and the active plan (especially PLAN-0078 for Admin Console work).
3. Inspect the existing Shadcn-compatible component library before making new primitives or importing additional packages. Prefer reuse of accessible `Table`, `Dialog`/`Sheet`, `Button`, `Badge`, `Input`, `Select`, `Textarea`, `Label`, `Skeleton` and related components.
4. Preserve **Poppins** as the primary font, the established CSS variables, semantic design tokens, and existing light/dark theme behavior.
5. Avoid tiny metadata (below 12px), oversized Admin Console titles, raw JSON for ordinary users, clipping, hover-only actions, inconsistent dialogs or page-wide reflows during data refresh.
6. Use a relevant approved UI/UX design skill if actually installed and available. Do not claim to have used a skill without executing it.
7. Keep changes scoped and preserve authorization, data privacy, immutable submission/revision identity, idempotency, monetary side-effect restrictions and audit trails.
8. Validate changes using the central workflow: code, focused units, applicable non-visual integration/API/contract tests, failure-driven fixes and affected reruns. Clearly distinguish tests actually executed from deferred browser/visual or manual inspection; never claim a visual pass from code-only tests.

**Typography authority:** When UI typography is ambiguous, consult `TYPOGRAPHY.md` first, respecting its adoption status; where it conflicts with a higher-priority existing product policy or component contract, document the conflict and seek a policy decision rather than silently overriding security or application behavior.

## Hybrid styling architecture — JED, 2026-11-02

Read [STYLING.md](./STYLING.md) alongside TYPOGRAPHY.md before UI styling work. Use shared semantic `cf-` CSS for repeated patterns, Tailwind for local responsive/layout adjustments and existing Shadcn-compatible variants for accessible components. Check existing classes/variants first. Keep globals.css to framework imports/tokens/foundations and page-specific rules scoped; shared entry is shared/ui/styles/general.css. Preserve Poppins, brand/theme tokens and interaction states. No broad component overrides, duplicate resets/rules, unnecessary !important or hardcoded pattern colors. Audit actual Tailwind compiler/version/imports/layers: initial audit found no compiler; approved PLAN-0078 now supplies Ads-only Tailwind4.1.18/PostCSS with tw: prefix and no Preflight. Do not assume utility CSS is generated. Runtime extraction/package setup remains within approved plan scope; use the canonical unit→non-visual integration workflow and report browser/deployment limits honestly.

## Public marketing pages

CrimFig marketing pages use plain headlines, concise copy, and imagery for hierarchy. Do not use decorative badges, pills, sparkle labels, or uppercase eyebrow text above headings. Reserve badges for factual status that helps users make a decision. See [project design memory](../.agents/MEMORY.md).

Use subtle animate-on-scroll (AOS) entrances on CrimFig public marketing pages. Keep content readable before JavaScript runs, reveal each section once, and skip entrance motion when prefers-reduced-motion is enabled.

## Mobile-first frontend design — JED, 2026-11-11

Start all new or updated frontend interfaces at the narrow mobile layout. Prioritize key content and actions in a single column, use touch-friendly controls and let content wrap. Add wider layouts progressively with min-width breakpoints where useful. Check affected screens at 320 and 375 CSS pixels for page-wide horizontal overflow, clipping and unreachable controls, then check desktop and keyboard use. Record browser checks actually performed.
