# Frontend Template Migration Plan

This document records the current migration state of `front/` relative to the template-style frontend under `template/frontend/`.

It is intentionally based on the current codebase, not on the older prototype-only version.

## 1. Executive Summary

The frontend has already crossed the largest migration boundary.

`front/` is no longer a manual DOM-driven prototype shell. It is now a React application with:

- `src/main.tsx` app entry
- `react-router-dom` route configuration
- routed page composition
- feature-level folders
- preserved typed API client and normalization logic

Because of that, the gap between `front/` and `template/frontend/` is no longer primarily about app runtime architecture.

The remaining gap is now mostly about:

- app-wide state breadth
- styling system alignment
- toolchain and template ecosystem alignment
- low-level UI primitive coverage

In short:

- the old gap was architectural
- the current gap is mostly about infrastructure maturity and ecosystem breadth

## 2. What Has Already Been Migrated

The following template-style capabilities are already present in `front/`.

### React app shell

Current status: completed

Evidence in current code:

- `src/main.tsx` mounts a React root
- `src/router.tsx` uses `createBrowserRouter`
- `src/app/AppShell.tsx` provides a routed shell with `Outlet`

This means the app is no longer driven by manual mount logic and no longer depends on the old hash-router architecture.

### Route-based page structure

Current status: completed

Current route/page structure includes:

- `pages/BlueprintHomePage.tsx`
- `pages/PublicHallHomePage.tsx`
- `pages/PublicTournamentDetailPage.tsx`
- `pages/PublicClubDetailPage.tsx`
- `pages/MemberHubPage.tsx`
- `pages/TournamentOpsPage.tsx`

This is already much closer to `template/frontend`, where pages are also route-oriented.

### Feature-level organization

Current status: completed

Current feature folders include:

- `features/blueprint/*`
- `features/public-hall/*`
- `features/member-hub/*`
- `features/tournament-ops/*`

This is an important migration milestone because business logic is no longer concentrated in a few giant runtime modules.

### Shared typed business layer

Current status: preserved and still valuable

The following pieces remain important and should continue to be preserved:

- `src/domain/models.ts`
- `src/api/client.ts`
- `src/lib/query.ts`
- `src/lib/club-applications.ts`

This layer is already one of the strongest parts of the frontend and should remain the business foundation during later template-alignment work.

### First shared UI layer

Current status: established

The frontend now has a real first-pass shared presentation layer under:

- `src/components/shared/layout`
- `src/components/shared/feedback`
- `src/components/shared/data-display`
- `src/components/shared/forms`
- `src/components/shared/index.ts`

Examples already extracted:

- section intro/header wrappers
- control and filter toolbars
- panel heads
- source badge and warning presentation
- loading card and empty state blocks
- reusable data panel and detail display shells
- reusable list row and metric shells
- reusable detail list/detail row shells
- reusable labeled field/select/input/textarea/checkbox shells

This is an important change in migration status.

The frontend is no longer only "feature-split React code". It now has the beginning of a reusable UI layer.

### First app-level interaction infrastructure

Current status: established

The frontend now has root-level interaction providers and reusable hooks for both notices and confirm flows:

- `src/providers/AppFeedbackProvider.tsx`
- `src/providers/DialogProvider.tsx`
- `src/hooks/useNotice.ts`
- `src/hooks/useDialog.ts`

These providers are already mounted at the app root in `src/main.tsx`, which means cross-page interaction feedback is no longer purely local to each feature.

Current confirmed usage includes:

- root-level notices for submit/review/refresh outcomes
- confirm dialogs for withdraw, approve, and reject flows

This is the first real app-level interaction layer in `front/` and marks another meaningful step toward the template style.

### Shared export surface

Current status: established

The shared component layer now also has an index export surface:

- `src/components/shared/index.ts`

This matters because the codebase is no longer only extracting shared pieces, it is also starting to present them as a small internal UI surface rather than a set of unrelated utility files.

## 3. What Still Differs From `template/frontend`

Even though the runtime architecture is now much closer, `front/` still differs from `template/frontend` in several important ways.

### UI component system

Difference level: still significant

`template/frontend` has a much richer reusable UI base:

- `components/ui/*`
- Radix-based primitives
- reusable button/card/table/form/dialog primitives
- shadcn/ui-compatible patterns

`front/` now has a first-pass shared layer:

- `components/shared/layout/*`
- `components/shared/feedback/*`
- `components/shared/data-display/*`
- `components/shared/forms/*`
- `components/shared/index.ts`

What this means in practice:

- `front/` already has page and feature decomposition
- it now also has shared view abstractions across features
- it also has shared form wrappers and a barrel export surface
- but it still does not yet have the same breadth or maturity as the template's reusable UI foundation

### Provider and app-level infrastructure

Difference level: moderate to small

`template/frontend` already includes app-wide systems such as:

- `MockSystemProvider`
- feedback bridge integration
- dialog system hooks
- Zustand app store

`front/` now has a usable app-wide interaction layer for notices and confirm flows, but it does not yet have the same breadth of infrastructure as the template.

What this means in practice:

- `front/` is already React-based
- it now has root-level feedback and confirm paths
- but richer overlays, mock tooling, and broader app-state services are still less centralized than in the template

### Styling model

Difference level: significant

`front/` still leans on global CSS:

- `src/styles/app.css`
- `src/styles/template-shell.css`

`template/frontend` uses a more complete design-system path:

- Tailwind CSS v4
- design tokens in `src/index.css`
- shadcn/ui styling conventions

What this means in practice:

- `front/` visually can approximate the template direction
- but the styling architecture is not yet aligned with the template's component-first system

### Dependency and toolchain alignment

Difference level: significant

Current `front/package.json` is still lightweight.

It includes:

- React
- React DOM
- React Router
- Vite
- TypeScript

But it does not yet include the larger template stack such as:

- Zustand
- Tailwind CSS v4
- Radix UI packages
- shadcn/ui support pieces
- react-hook-form
- eslint stack matching the template

This means `front/` has adopted the React shell, but not the full template ecosystem.

## 4. Difference Assessment

If we compare the current codebases by layer, the gap now looks like this.

### App runtime and routing

Gap: small

Both sides now use:

- React root mounting
- React Router
- route/page structure

This used to be the biggest difference. It is no longer the main problem.

### Feature decomposition

Gap: small

Both sides now split business areas into route-facing units.

`front/` is already organized into pages and features, which means the migration path is now evolutionary rather than a full rewrite.

### Shared UI layer

Gap: moderate

This is now one of the clearest remaining differences.

`template/frontend` has a broader reusable design-system layer.

`front/` now has a meaningful first shared layer, but it is still lighter and narrower than the template's `components/ui/*` ecosystem.

The current gap is now mostly about depth:

- the template has many low-level primitives
- `front/` has a smaller set of higher-level shared shells and wrappers

### App-wide state and interaction infrastructure

Gap: moderate to small

`template/frontend` has stronger app-level conventions for:

- dialogs
- feedback
- stores
- reusable interaction scaffolding

`front/` is no longer purely feature-local here, and its current notice/confirm layer is already reusable. The remaining gap is now more about breadth than about basic presence.

### Styling system

Gap: large

`front/` is still primarily global-CSS-driven.

`template/frontend` is much more design-system-driven.

## 5. Practical Conclusion

The answer to "are they still very different?" is now:

- yes at the infrastructure layer
- not nearly as much at the application architecture layer

The current frontend is no longer far away from template mode in structure.

It is already close in:

- React runtime
- router structure
- page layout
- feature organization
- first-pass shared view abstractions
- first-pass app-level interaction infrastructure

It is still far in:

- app-wide state breadth
- styling conventions
- toolchain completeness
- richer low-level UI primitive coverage

That means the migration has moved from "rewrite the app shell" into "complete the template ecosystem around the app shell."

## 6. Recommended Next Steps

Recommended order from here:

1. Consolidate and stabilize the newly introduced `src/components/shared/*` layer.
2. Keep the new notice/confirm provider layer narrow and stable while more features reuse it.
3. Decide whether styling should remain CSS-first or move toward the template's Tailwind/shadcn direction.
4. Only after that, consider deeper dependency alignment with the full template stack.
5. Introduce broader app-state machinery only if a real cross-page state problem appears.

## 7. Practical Work Plan

This section is the actionable version of the migration plan.

The goal is to avoid a large rewrite and instead move `front/` one layer at a time toward the template style.

### Phase A: Stabilize the current React structure

Objective:

- keep the existing route/page/feature structure stable
- avoid reintroducing page-local shortcuts
- make each new change land in the right layer

Rules for new work:

- route entry belongs in `src/pages`
- business-specific UI belongs in `src/features/<feature>/components.tsx`
- business-specific data loading belongs in `src/features/<feature>/data.ts`
- business-specific composition hooks belong in `src/features/<feature>/hooks.ts`
- shared business contracts stay in `src/domain`
- backend request and normalization logic stays in `src/api/client.ts`

Definition of done for Phase A:

- no new feature work goes into page files directly beyond route composition
- no new backend normalization logic is duplicated inside pages or feature components

### Phase B: Expand the shared UI layer

Objective:

- reduce repeated markup and styling patterns across features
- turn `src/components/shared` from a first-pass extraction into a stable reusable UI layer

Recommended target folders:

- `src/components/shared/layout`
- `src/components/shared/feedback`
- `src/components/shared/data-display`
- `src/components/shared/forms`
- `src/components/shared/navigation`

Already extracted:

- filter toolbar shell
- section header shell
- empty state block
- loading panel/card
- source badge and warning block
- data panel shell
- detail hero/detail card shell
- list row shell
- metric grid/card shell
- detail list/detail row shell
- reusable labeled field/select/input shell
- reusable inline action group

Suggested next extractions:

- page action bar
- reusable stats/detail-summary shell
- navigation-specific wrappers if cross-route navigation patterns continue to repeat
- low-level button/input-like primitives only if shared wrappers stop being enough

Likely source files to mine for reusable pieces:

- `src/features/public-hall/components.tsx`
- `src/features/member-hub/components.tsx`
- `src/features/tournament-ops/components.tsx`
- `src/features/blueprint/sections.tsx`

Definition of done for Phase B:

- the current shared components stop churning heavily across features
- repeated feature markup continues to move into `src/components/shared`
- feature component files become more composition-oriented and less repetitive

### Phase C: Introduce app-level interaction infrastructure

Objective:

- keep the new root-level interaction pattern small, stable, and reusable
- selectively borrow the template's provider/system approach where it adds leverage

Recommended candidates:

- notice/toast system
- dialog orchestration
- optional page tool/event launcher
- future lightweight app-state services only when cross-page coordination becomes real

Recommended target folders:

- `src/providers`
- `src/hooks`
- `src/lib`

Suggested file directions:

- `src/providers/DialogProvider.tsx`
- `src/hooks/useNotice.ts`
- `src/hooks/useDialog.ts`

Important rule:

- only introduce providers for cross-page concerns
- do not move feature-specific state into app-wide providers without a real need

Definition of done for Phase C:

- notices remain root-mounted and reusable across features
- confirm dialogs are not reinvented separately inside multiple features
- the dialog layer keeps a stable accessibility and concurrency baseline before broader reuse
- cross-page interaction flows are mounted once near the app root
- provider APIs stay narrow instead of growing into a catch-all modal/store layer too early

### Phase D: Decide the styling direction

Objective:

- choose whether `front/` will remain CSS-first for now or begin moving toward the template's Tailwind/shadcn style

Option 1:

- stay CSS-first in the near term
- continue using `app.css` and `template-shell.css`
- improve naming, layering, and reuse without changing the stack yet

Option 2:

- begin gradual template-stack alignment
- introduce Tailwind
- progressively move new shared UI into template-compatible styling patterns

Recommended decision rule:

- if the next 2-3 sprints are mostly feature delivery, stay CSS-first
- if the next 2-3 sprints are mostly frontend-system building, start template-stack alignment

Definition of done for Phase D:

- the team has one explicit styling direction
- new components stop mixing unrelated styling approaches

### Phase E: Fill template ecosystem gaps

Objective:

- close the remaining gap with `template/frontend` only after the app structure and shared UI are stable

Possible later additions:

- Zustand for true cross-page state
- Tailwind CSS v4
- shadcn/ui-style primitives
- react-hook-form where forms become complex
- stronger linting/tooling alignment with the template

Important rule:

- do not add ecosystem dependencies just to match the template visually
- add them only when the current code has an actual maintenance or reuse problem they solve
- especially avoid adding global state tooling before the app actually has cross-route state pressure

Definition of done for Phase E:

- new dependencies remove duplication or complexity
- the stack change is justified by real code pressure, not only by preference

## 8. Directory Mapping Guide

This is the practical mapping for future changes.

### `src/pages`

Use for:

- route entry points
- route-level composition
- reading route params/search params
- wiring feature modules into the route

Avoid:

- large chunks of repeated view markup
- backend request normalization
- deeply embedded business rules

### `src/features/<feature>/components.tsx`

Use for:

- feature-specific presentational components
- layouts and sections only meaningful inside one business feature

Avoid:

- app-wide primitives
- direct fetch logic

### `src/features/<feature>/data.ts`

Use for:

- feature-local data loading helpers
- API-first plus mock-fallback composition
- data shaping that is local to the feature

Avoid:

- duplicating raw backend normalization already handled by `src/api/client.ts`

### `src/features/<feature>/hooks.ts`

Use for:

- feature composition hooks
- stateful orchestration for filters, selected items, or feature flows

Avoid:

- turning every local state object into a hook without reuse value

### `src/components/shared`

Use for:

- reusable presentational pieces shared by multiple features
- shells, badges, states, panels, toolbars, wrappers

Promote code here when:

- the same visual/interaction pattern appears in 2 or more features
- the pattern has stable semantics beyond one page

### `src/providers`

Use for:

- app-wide interaction or state systems mounted near root

Use only for:

- dialogs
- notices
- global tool overlays
- future global state services

Avoid:

- storing feature-local workflow state that still belongs in feature hooks

### `src/domain`

Use for:

- stable frontend business models
- shared type contracts between features

### `src/api/client.ts`

Use for:

- request construction
- fetch handling
- backend payload normalization
- typed API entry points

This file should remain the single source of truth for backend-to-frontend shape adaptation.

## 9. Immediate Backlog For Starting Work

If work starts now, the recommended first batch is:

1. Audit the new `src/components/shared/*` APIs and normalize naming, props, and responsibilities before adding many more abstractions.
2. Continue extracting the next repeated patterns from `public-hall`, `member-hub`, `tournament-ops`, and `blueprint`.
3. Reuse `useNotice` instead of introducing feature-local success/warning banners.
4. Keep `DialogProvider/useDialog(confirm only)` narrow until a second clear reusable dialog pattern appears.
5. Reassess styling direction before introducing Tailwind or shadcn dependencies.
6. Do not add store-style app state unless a cross-route state problem is concrete.
7. Do not introduce template-style low-level primitives unless the current shared shells become a proven bottleneck.

## 9A. Current Review Findings

The following review items have already been closed in the current code:

- refresh notices now depend on the latest refresh outcome instead of preserved stale payloads
- the confirm dialog now supports escape-to-close, initial focus placement, and focus return

### Dialog provider concurrency baseline

Current issue:

- dialog requests now queue correctly, but the provider should continue to be treated as a single confirm-flow layer rather than a general modal orchestration system

Why it matters:

- the current API is intentionally narrow and stable
- mixing richer modal use cases into this layer too early would reintroduce churn just after the confirm flow became reusable

Recommended follow-up:

- keep `useDialog()` confirm-focused for now
- only broaden the API when a second clear dialog pattern appears in multiple features

## 10. First-Week Success Criteria

The migration is moving in the right direction if, after the next round of work:

- the current shared components are reused by multiple features without prop churn
- at least 2 more repeated UI patterns have been extracted to `src/components/shared`
- app-level notices are reused by more than one feature without feature-specific duplication
- confirm dialogs are reused by more than one feature without local one-off implementations
- no one introduces a broad global state layer without a concrete cross-page need
- no one introduces a broad primitive layer before the current shared shells prove insufficient
- no new feature duplicates backend normalization logic
- no new route page becomes a large view dump
- at least one feature becomes simpler after shared extraction
- future tasks can be described in terms of page, feature, shared component, and API layer

## 11. Migration Rule Of Thumb

When evaluating future frontend work in `front/`, the preferred question should now be:

- "Does this change move `front/` closer to a reusable template-style React application?"

Not:

- "Can this page work if we add one more local implementation shortcut?"

That is the key mindset shift for the next migration phase.
