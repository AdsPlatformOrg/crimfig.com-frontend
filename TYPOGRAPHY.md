# CrimFig Typography System

> **Status:** Approved for PLAN-0078 Admin Console implementation by JED on 2026-11-02; wider frontend adoption remains proposed/scoped separately.
> **Scope:** CrimFig web applications, especially `crimfig-frontend/web/ads` Admin Console, moderation and House Ads. Apply to additional frontend surfaces only after checking their existing design systems.
> **Primary typeface:** Poppins. Preserve the existing font loading strategy and local `--font-primary` mapping. Do not add a second font package or remote font download without explicit approval.
> **Companion documents:** [Frontend AGENTS.md](./AGENTS.md), [central AGENTS.md](../.agents/AGENTS.md), existing brand/design tokens, accessibility rules, and [PLAN-0078](../.agents/plans/PLAN-0078-admin-console-humanized-modals-and-review-dialog-polish.md).
> **Import note (2026-11-02):** Added at JED's request as a proposed reference. Existing approved brand/accessibility rules remain mandatory; proposed numerical targets and exceptions are reconciled during plan approval. The import itself did not approve implementation; JED subsequently approved PLAN-0078 execution. Deployment remains separate.

## 1. Design intent

CrimFig should feel like a modern, precise, quiet, professional advertising platform: **clear, compact, confident, and premium—not cramped, childish, oversized or visually noisy**. Typography must make complex financial, advertising and moderation information easy to scan and verify.

A beautiful interface is not one with the smallest text or most decorative elements. Use information hierarchy, consistent proportions, restrained emphasis and generous readability where it matters.

**Non-negotiables**

1. Use **Poppins** as the primary UI font; do not switch to Inter/Roboto/Arial just to imitate Shadcn examples. System fallbacks are allowed while the font loads.
2. Use the **existing semantic font/color/spacing tokens** where available. Extend tokens minimally and semantically; never create a disconnected local typography system.
3. Default body/table/form text to **14px or larger** in information-dense desktop administrative views; use **16px** for extended reading and mobile form inputs where appropriate.
4. Keep ordinary metadata, secondary labels, badges and table headers at **12px minimum** (not 10–11px). Prefer 13px where room allows.
5. Use color, position, weight and whitespace to establish hierarchy. Do not depend exclusively on size or color.
6. Never truncate or hide decision-critical status, permissions, approval stage, money amounts or review actions to achieve visual density.
7. Text must reflow at **375px viewport width** and **200% zoom**, with no clipped controls, overlap, or forced page-wide horizontal scrolling.
8. Respect the user's font scaling and reduced-motion settings. Do not globally reduce zoom, override browser defaults recklessly, or use fixed-height text containers that cut off content.
9. Use `tabular-nums` for columns of amounts, counts, dates or numeric metrics where supported; use normal Poppins numbers for ordinary prose.
10. No UI redesign is complete on screenshots alone: run authorized tests and distinguish code-only checks from real visual verification.

## 2. Typography primitives

### 2.1 Font family

- **Primary:** Poppins (`var(--font-primary)` or the repo's canonical equivalent).
- **Fallback:** existing system sans stack; preserve font-display behavior and current font infrastructure.
- **Code / technical IDs:** existing mono stack only for copyable IDs, code snippets, request references and raw JSON in a deliberately disclosed technical area—not for whole cards or headings.
- **Do not synthesize extra font families** for numbers, status badges or heading decoration.

### 2.2 Suggested type scale

The values below are proposed UI-level targets. Map them into existing tokens and Shadcn styles; use `rem` values derived from a normal 16px root and preserve zoom support.

| Semantic style | Desktop font size | Weight | Line height | Usage |
| --- | --- | --- | --- | --- |
| Page title | 24px / 1.5rem | 600 | 1.30 | `Moderation`, `House Ads` page heading |
| Page title, narrow viewport | 20px / 1.25rem | 600 | 1.35 | Smaller screen heading |
| Section title | 18px / 1.125rem | 600 | 1.35 | Dialog major sections |
| Subsection / card title | 16px / 1rem | 600 | 1.4 | Detail groups, summary cards |
| Standard UI body | 14px / .875rem | 400 | 1.5 | Table cells, forms, buttons, detail values |
| Emphasized UI body | 14px / .875rem | 500–600 | 1.5 | Important names, row primary identity |
| Reading text / long description | 16px / 1rem | 400 | 1.55–1.65 | Creative body, explanations, long notes |
| Secondary metadata | 12–13px / .75–.8125rem | 400–500 | 1.4–1.5 | Submission age, supportive hints, captions |
| Table headings | 12–13px / .75–.8125rem | 600 | 1.4 | Column headings; avoid all-caps except short labels |
| Form field label | 13–14px / .8125–.875rem | 500–600 | 1.4 | Descriptive labels |
| Validation/error/help | 12–14px / .75–.875rem | 400–500 | 1.5 | Errors and instructions, never tiny |
| Badge / status pill | 12–13px / .75–.8125rem | 500–600 | 1.3–1.4 | `Review 1 pending`, `Rejected` |
| Metric / headline number | 20–28px / 1.25–1.75rem | 600 | 1.25–1.35 | Summary KPIs, not every table value |
| Technical ID (disclosed) | 12–13px / .75–.8125rem | 400–500 | 1.4 | UUIDs, submission refs in technical section |

**Important:** Avoid 30–48px hero headings inside utility admin pages. Do not compensate for bad spacing by shrinking labels to 10px. Do not use `font-extrabold` indiscriminately: Poppins at 600 already provides strong emphasis.

### 2.3 Weight hierarchy

- `400`: ordinary prose and values.
- `500`: controls, subtle emphasized labels, entity names where appropriate.
- `600`: titles, column headings, critical values and active state labels.
- `700`: exceptional highlights only, e.g. a large success metric—not every badge or heading.

Never use weight **alone** to convey a required approval/status difference. Provide text and appropriate semantic decoration.

### 2.4 Line length, whitespace and truncation

- Keep long prose panels around **55–80 characters** per line on large screens, when practical.
- Page descriptions: one or two short lines where possible; avoid repeating page titles in elaborate intro text.
- Table cells: allow a primary name to wrap up to **two lines**; provide the full value in the accessible details view.
- UUIDs and technical identifiers can be visually abbreviated but must be **copyable in full**, with an accessible full label.
- Currency and critical values must not silently ellipsize. Prefer wrapping secondary fields or responsive layouts.
- Heading-to-body spacing should make grouped content clearly related. Avoid both wall-to-wall dense text and excessive empty space.
- Avoid all-uppercase paragraphs, excessive letter spacing, superfluous decorative italics and low-contrast placeholder text.

## 3. Spacing and density rules

Use the existing spacing scale. The following are suggested layout targets, not new competing constants:

| Element | Suggested treatment |
| --- | --- |
| Page content | 20–24px desktop; 16px narrow layouts |
| Page title to supporting subtitle | 4–8px |
| Main section separation | 20–28px |
| Card padding | 16–20px; compact summary cards may use 12–16px |
| Table row | ~12px vertical and 12–16px horizontal padding; allow content to expand |
| Table header | 12–13px text; sufficient visual separation without heavy borders |
| Detail field rows | 6–10px between label/value groups; 16–24px between sections |
| Input group spacing | 12–16px between label/control/help blocks |
| Control height | Typically 36–40px desktop; preserve **44px effective target** for touch/critical interactions where feasible |
| Dialog padding | 20–24px desktop; 16px mobile; internal scroll area only when necessary |
| Badge padding | Compact but not cramped; label must remain legible |

Use a consistent layout rhythm. Do not use hardcoded fixed row heights that cut off wrapped labels or state reasons. Dense is not the same as tiny.

## 4. Shadcn typography and component conventions

**Shadcn UI is a set of accessible, composable component patterns, not permission to paste a different theme into CrimFig.** Inspect the installed components first and reuse their existing variants. Do not overwrite shared component internals to solve one page's styling issue.

### 4.1 Standard use

- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`: use semantic column headings, aligned numeric cells, and deliberate row density.
- `Button`: clear text labels for primary review and inspection actions. Secondary overflow dropdowns are supplementary, never the only entry points.
- `Badge`: semantic status labels; colors are supportive, not the only signal.
- `Dialog`, `Sheet`, `ScrollArea`, `Separator`, `Accordion`/`Collapsible`: use for accessible details, sections and technical audit fields; choose a side sheet or dialog depending on actual content complexity and navigation.
- `Input`, `Textarea`, `Select`, `Switch`, `Label`, `Form` and validation messages: consistent typography, inline errors, clear required/optional status.
- `Skeleton`: reserve the approximate geometry of the content without flashing the entire page or presenting stale rows as fresh.
- `Tooltip`: supplemental explanation only; never the only home for a required action or disabled reason.

### 4.2 Component-specific guidance

**Moderation queue tables**

- Primary entity identity: 14px, 500–600 weight; metadata 12–13px.
- Column headings 12–13px, 600 weight, adequate contrast.
- Separate *View details* and stage-specific *Review 1/Review 2* actions, visible without hover.
- Budget/amounts align consistently and use locale-aware formatting and tabular numerals.
- Status shows stage and meaning; do not abbreviate into unexplained color dots.
- On small screens, use accessible summary cards or a responsive detail-first pattern rather than forcing the whole page to scroll horizontally.

**Moderation detail dialog/sheet**

- Title: 18–20px, weight 600; status is separate from the title.
- Section headings: 16–18px; descriptive values 14–16px.
- Present *Ad content*, *Targeting*, *Review history*, *Related items* and *Technical & audit details* as clear groups.
- Use natural-language formatting for schedules, devices and eligibility; show raw structured data only in an explicitly labeled technical disclosure if actually needed.
- Keep the selected immutable submission/revision clearly identifiable and accessible without drowning the reviewer in UUIDs.
- Use a stable review action area that does not jump when content loads.

**House Ads create/edit**

- Short title and explanation, then grouped form sections (identity; asset/destination; specifications/delivery; preview).
- Every input has a visible label. Show units like `px` via input adornments or label; do not rely on placeholders.
- Use good textarea line height; preview copy at a readable size, not as tiny mock ad text.
- Error text remains visible near the control and is announced accessibly.
- Use a responsive two-column form only where space permits; stack fields vertically on narrow screens.

## 5. Visual hierarchy and restrained brand usage

- Light mode should feel crisp, warm-neutral and high-contrast; do not equate premium design with pure black text, huge shadows or excessive cards.
- Preserve dark mode compatibility and all established semantic tokens even if the initial requirement prioritizes light mode.
- CrimFig crimson is for high-value actions, selected states and restrained brand accents, **not** every heading, border, icon and badge.
- Use neutral surfaces, subtle borders and thoughtful whitespace to communicate grouping.
- Avoid heavy gradients, saturated multi-color status badges, arbitrary glows, multiple competing shadows and dense icon decoration.
- Money and status values must have excellent legibility; preserve precision and currency units.

## 6. Accessibility and internationalization

1. Aim for **WCAG 2.2 AA**: 4.5:1 contrast for normal text, 3:1 for large text and applicable meaningful graphics/UI boundaries. Confirm contrast against actual existing tokens in both themes.
2. Text must remain usable at 200% zoom. Avoid CSS that disables text resizing.
3. Visible keyboard focus, native button/link semantics, correct form associations and dialogs with logical focus management are required.
4. Keep visible labels, descriptive errors and plain-language empty/denied states. Do not rely on icons alone.
5. Respect `prefers-reduced-motion` for animated loading and transitions.
6. Format currencies with currency code/symbol and locale-aware grouping; do not infer `USD` when unavailable. Preserve zero vs unknown.
7. Format timestamps with clear relative/absolute context and timezone. Do not silently mislabel server timestamps as browser-local time.
8. Long words, URLs, translated labels and long advertiser names must wrap or truncate safely with full accessible information.
9. Do not render raw JSON to ordinary users; expose it only in a deliberate technical/audit context and escape content safely.

## 7. Implementation contract for coding agents

Before altering frontend design:

1. Read repository `AGENTS.md`, this `TYPOGRAPHY.md`, any approved design system/brand rules, and the active plan requirements.
2. Inspect the **actual installed Shadcn-compatible component inventory** and current design tokens; determine whether Shadcn is already configured. Do not install a second Shadcn set or override shared styles without need.
3. Check whether an approved UI/UX design skill (for example `ui-ux-pro-max`) is installed and applicable. Use it if available; otherwise follow this document without falsely claiming skill execution.
4. Map typography classes to the existing Tailwind/theme token system. Scope modernization to affected pages first; avoid `html { font-size: ... }` or blanket `p`, `h1` overrides.
5. Design one representative desktop table, mobile card, detailed review sheet and House Ads form, then apply consistent patterns across the corresponding states.
6. Preserve functional invariants: stage permissions, snapshot/revision identity, idempotency, copyable IDs, audit trails, authorized media and nonbillable previews.
7. Validate code-level a11y and UI behavior with existing tests; after focused units, run applicable non-visual integration/API/contract checks under the central AGENTS.md workflow and improve the code from failures. Run full typechecks/builds and browser checks only under their authorized scope. Document deferred visual checks accurately.
8. In changes and reviews, report which components were reused, which tokens were changed, and any exceptions to this typography system.

### Anti-patterns (reject in review)

- Default Shadcn demo styles pasted without adapting to CrimFig.
- `text-[10px]` / `text-[11px]` on real metadata, badges, tables or form guidance.
- Page headings that dwarf a compact admin table.
- Raw JSON, unformatted arrays, or raw UUID walls as the primary interface.
- Silent clipping of names/amounts/status or review buttons hidden behind overflow menus.
- Many bespoke CSS rules duplicating existing Shadcn component variants.
- Fake disabled states, hover-only actions, placeholder-only form labels.
- Clearing the entire queue on every fetch; stale content presented as current or actionable.
- Native `<dialog>` or inputs styled inconsistently when supported design-system alternatives exist.
- Unreviewed global font/theme changes made solely to improve one Admin Console page.

## 8. Acceptance checklist

- [ ] Poppins remains the primary UI font and is loaded through the established setup.
- [ ] Page titles use the 20–24px scale; sections use 16–18px; ordinary UI copy uses 14px+; metadata 12px+.
- [ ] Typography is consistent across Ad, Ad Stack, Campaign, Review 1, Review 2 and House Ad forms.
- [ ] Shadcn-compatible components and existing variants are reused whenever possible.
- [ ] All amounts, statuses, labels and actions are readable without hover or tooltip.
- [ ] Light mode and existing dark theme tokens remain accessible and coherent.
- [ ] At 375px and 200% zoom, content reflows without clipping decision controls (manual/browser check when authorized).
- [ ] Focus, labels, errors, dialog behavior and readable states pass applicable tests.
- [ ] Human-readable structured data replaces raw machine dumps, with a separate copyable technical section.
- [ ] Skeletons and background updates do not cause misleading flashes or actionable stale data.
- [ ] Any exceptions are documented, limited and approved.

## 9. Hybrid styling architecture

Follow [STYLING.md](./STYLING.md) for the owner-requested hybrid CSS/Tailwind/Shadcn architecture. Reusable typography roles belong in the shared `shared/ui/styles/general.css`, mapped to existing tokens and using `cf-` semantic classes. `globals.css` retains framework imports, theme tokens and foundations; Tailwind handles local responsive/spacing adjustments, and existing Shadcn-compatible components retain accessible behavior and variants.

Check existing shared classes and component variants before adding typography styles. Prefer semantic reuse over repeated identical utility strings, while keeping page exceptions scoped. Do not duplicate font scales, resets, palettes, blanket heading rules or `!important` overrides. Preserve Poppins and both themes.

The initial audit found no compiler; PLAN-0078 now pins the scoped Tailwind4.1.18/PostCSS pipeline with tw: prefix and no Preflight. `tailwind-merge` alone remains insufficient for compilation. Do not copy utility or layer syntax from the pasted examples as evidence that it currently compiles. Apply code-only regression/integration testing after units; distinguish CSS compilation/component evidence from separately authorized browser/visual checks.

## 10. Governance

- **Owner:** JED; adoption requires the same approval process as other CrimFig design standards.
- **Source of truth:** The repository's actual tokens and components remain authoritative until this document is approved and integrated.
- **Change control:** Update this file and its `AGENTS.md` reference together when typography policy changes. Document exceptions in relevant plans rather than creating ad hoc styles.
- **Scope discipline:** This document sets typography and design standards; it does **not** authorize changes to payment, moderation policy, permissions, release controls or production deployment.
