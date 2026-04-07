# Frontend Template Migration Plan

If build or migration work surfaces real pressure for a missing tool from `template/frontend`, the current implementation can be interrupted so the code can be refactored with that new tool after confirmation.

This document records the current migration state of `front/` relative to the template-style frontend under `template/frontend/`.

It is intentionally based on the current codebase, not on the older prototype-only version.

## 1. Executive Summary

The frontend has already crossed the largest migration boundary.

`front/` is no longer a manual DOM-driven prototype shell. It is now a React application with:

- `src/main.tsx` app entry
- `react-router-dom` route configuration
- routed page composition
- feature-level folders
- preserved typed API modules and normalization logic

Because of that, the gap between `front/` and `template/frontend/` is no longer primarily about app runtime architecture.

The remaining gap is now mostly about:

- app-wide state breadth
- styling system alignment
- toolchain and template ecosystem alignment
- continued template-stack breadth and library backing

In short:

- the old gap was architectural
- the current gap is mostly about infrastructure maturity, ecosystem breadth, and disciplined consolidation
- the current codebase is now in a valid "pause and build features" state; further migration should be pressure-driven

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
- `src/api/auth.ts`
- `src/api/public.ts`
- `src/api/clubs.ts`
- `src/api/operations.ts`
- `src/lib/query.ts`
- `src/lib/club-applications.ts`

This layer is already one of the strongest parts of the frontend and should remain the business foundation during later template-alignment work.

### First shared UI layer

Current status: established and already moving beyond first-pass wrappers

The frontend now has a real first-pass shared presentation layer under:

- `src/components/shared/layout`
- `src/components/shared/feedback`
- `src/components/shared/data-display`
- `src/components/shared/domain`
- `src/components/shared/forms`
- `src/components/shared/index.ts`

Examples already extracted:

- section intro/header wrappers
- control and filter toolbars
- panel heads
- source badge and warning presentation
- loading card and empty state blocks
- section-level loading wrappers
- reusable data panel and detail display shells
- reusable data-table panel shells
- reusable list row and metric shells
- reusable detail list/detail row shells
- reusable labeled field/select/input/textarea/checkbox shells
- reusable domain-aware shared shells such as dashboard fallback panels, ops context panels, workbench context panels, and club application list presentation

This is an important change in migration status.

The frontend is no longer only "feature-split React code". It now has the beginning of a reusable UI layer.

### CSS-first `components/ui` foundation

Current status: established across six migration batches

The frontend now also has a real low-to-mid-level UI layer under:

- `src/components/ui/*`

Current coverage already includes:

- primitives such as button, card, input, textarea, select, badge, dialog
- richer presentation primitives such as alert, table, tabs, skeleton, separator, empty state, stat blocks
- structured display primitives such as fieldset, description list, key-value list, status pill
- middle-layer composition pieces such as info card, section callout, and filter bar

What this changes:

- `front/` no longer depends only on ad hoc feature markup plus high-level shared shells
- the app now has a CSS-first internal primitive surface that can support larger-scale extraction work
- the remaining difference from the template is now less about "missing all primitives" and more about implementation style, breadth, and ecosystem choice

Current observation:

- the primitive layer is no longer theoretical or isolated
- feature code in blueprint, public hall, member hub, and tournament operations is already consuming `components/ui/*`
- this means the primitive layer has crossed from "scaffold" into "active dependency of feature implementation"
- several shared families are now also moving behind template-compatible component structure rather than depending mostly on global CSS, especially in feedback, forms, summaries, metadata cards, and detail display shells

### First app-level interaction infrastructure

Current status: established and stabilized

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

The provider layer is now also cleaner internally:

- notice and dialog contexts are split from provider implementations
- provider and hook barrels are available for stable imports
- notice dismissal now clears pending timers so the root feedback layer does not leak timeout state during reuse
- the root notice stack now renders through the same alert/button primitive path used elsewhere in the app
- the root confirm dialog now leans on `DialogSurface`, `DialogBody`, `DialogFooter`, and shared button variants instead of a separate modal-only presentation shell

### Shared export surface

Current status: established

The shared component layer now also has an index export surface:

- `src/components/shared/index.ts`

This matters because the codebase is no longer only extracting shared pieces, it is also starting to present them as a small internal UI surface rather than a set of unrelated utility files.

### Shared domain layer

Current status: established

The frontend now has a clearer middle layer for business-aware reusable compositions:

- `src/components/shared/domain`

Current examples include:

- dashboard fallback shells
- operations context panels
- workbench context panels with reload affordances
- club application list presentation
- workbench guide and result-summary shells for blueprint-style business blocks
- workbench backlog/note panels for route-level dependency and contract gaps
- dashboard fallback notices for stable "API when available, explanatory placeholder otherwise" panels

What this changes:

- `front/` is no longer forced to choose only between low-level primitives and feature-local markup
- the codebase now has a middle reusable layer that is closer to domain-aware shared composition
- this is an important sign that the internal UI architecture is becoming more layered and intentional

## 3. What Still Differs From `template/frontend`

Even though the runtime architecture is now much closer, `front/` still differs from `template/frontend` in several important ways.

### UI component system

Difference level: moderate

`template/frontend` has a much richer reusable UI base:

- `components/ui/*`
- Radix-based primitives
- reusable button/card/table/form/dialog primitives
- shadcn/ui-compatible patterns

`front/` now has a real internal reusable UI base:

- `components/ui/*`
- `components/shared/layout/*`
- `components/shared/feedback/*`
- `components/shared/data-display/*`
- `components/shared/domain/*`
- `components/shared/forms/*`
- `components/shared/index.ts`

What this means in practice:

- `front/` already has page and feature decomposition
- it now also has shared view abstractions across features
- it also has shared form wrappers and a barrel export surface
- but it still does not yet have the same breadth, Radix integration, or ecosystem maturity as the template's reusable UI foundation

Additional current observation:

- `front/` now has a three-layer UI picture:
  - `components/ui/*` for lower-level primitives
  - `components/shared/*` for cross-feature shared shells
  - `components/shared/domain/*` for business-aware shared compositions
- recent consolidation work has also started clarifying boundaries:
  - lower-level helpers used by `components/ui/*` now live below the shared view layer
  - shared default naming is moving away from feature-specific class names such as `public-hall__*`
  - repeated loading, data-table, and workbench-context shells are becoming explicit shared APIs

This is materially closer to a template-style frontend than the earlier migration stages.

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

Current leverage point already confirmed:

- `@radix-ui/react-dialog` is now in active use as the first intentionally adopted template-style interaction dependency
- this was added because the root confirm flow had a real accessibility and interaction baseline need around portal/focus/overlay behavior
- this does not yet imply that `select`, `tabs`, or broader state libraries should be added immediately; those still need separate pressure-based justification

### Styling model

Difference level: moderate

`front/` is no longer purely global-CSS-driven.

It now has:

- Tailwind CSS v4 wired through `src/index.css`
- shared theme tokens and base styles in `src/index.css`
- `clsx`, `tailwind-merge`, and `class-variance-authority` in the internal UI stack
- a growing set of `components/ui/*` primitives with component-owned styling

It still also carries:

- `src/styles/app.css`
- `src/styles/template-shell.css`

`template/frontend` remains further along in the same direction:

- Tailwind CSS v4 as the default styling path
- shadcn/ui-compatible conventions
- broader library-backed primitive coverage

What this means in practice:

- `front/` has already started the styling-system migration
- the current gap is no longer "Tailwind absent"
- the real remaining difference is that styling ownership is still hybrid, while the template is more consistently component-first and library-backed

### Dependency and toolchain alignment

Difference level: moderate

Current `front/package.json` is no longer only a minimal React shell.

It now includes:

- React
- React DOM
- React Router
- Vite
- TypeScript
- Tailwind CSS v4
- PostCSS
- `class-variance-authority`
- `clsx`
- `tailwind-merge`

The remaining gap with `template/frontend` is now mainly in the broader ecosystem:

- Zustand
- Radix UI packages
- shadcn-oriented support pieces
- react-hook-form
- eslint stack matching the template
- some richer table/form/date/input dependencies used by the sample

This means `front/` has already moved into the template-adjacent tooling path, but it still has a lighter ecosystem surface than the sample template.

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

Gap: moderate to small

This is now one of the clearest remaining differences.

`template/frontend` has a broader reusable design-system layer.

`front/` now has both a meaningful `components/ui/*` layer and a meaningful `components/shared/*` layer, but they are still lighter and narrower than the template ecosystem.

The current gap is now mostly about depth:

- the template has broader primitive coverage plus stronger third-party integration conventions
- `front/` now has a usable primitive and shared-domain stack, but fewer patterns and less ecosystem support

### App-wide state and interaction infrastructure

Gap: moderate to small

`template/frontend` has stronger app-level conventions for:

- dialogs
- feedback
- stores
- reusable interaction scaffolding

`front/` is no longer purely feature-local here, and its current notice/confirm layer is already reusable. The remaining gap is now more about breadth than about basic presence.

### Styling system

Gap: moderate

`front/` is now in a hybrid state:

- base theme, tokens, and Tailwind are present
- reusable structure is increasingly component-owned
- legacy global CSS is still active

`template/frontend` is still more consistently design-system-driven, but the gap is no longer as large as it was before the recent styling/tooling changes.

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
- layered internal UI structure
- first-pass app-level interaction infrastructure

It is still behind in:

- app-wide state breadth
- styling consistency
- toolchain and ecosystem breadth
- richer primitive depth and library-backed coverage

That means the migration has moved from "rewrite the app shell" into "complete and stabilize the template-aligned ecosystem around the app shell."

Practical reading:

- there is no mandatory next migration phase that must start immediately
- the frontend is now in a good enough state to pause migration and return to product work
- future migration should resume only when real code pressure appears

## 6. Recommended Next Steps

Recommended order from here:

1. Pause migration work unless a concrete pressure point appears.
2. Keep using the current `ui -> shared -> feature` layering during normal feature development.
3. Resume migration only when a real maintenance, accessibility, state, or interaction bottleneck becomes obvious.
4. Add ecosystem packages one by one only when they clearly remove that pressure.

Current practical rule:

- do not continue migrating only to stay busy
- do continue migration when a reusable primitive, provider, or workflow is becoming expensive to maintain without template-style tooling

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
- backend request and normalization logic stays in `src/api/*`

Definition of done for Phase A:

- no new feature work goes into page files directly beyond route composition
- no new backend normalization logic is duplicated inside pages or feature components

### Phase B: Expand the shared UI layer

Objective:

- reduce repeated markup and styling patterns across features
- turn `src/components/shared` from a first-pass extraction into a stable reusable UI layer

Recommended target folders:

- `src/components/ui`
- `src/components/shared/layout`
- `src/components/shared/feedback`
- `src/components/shared/data-display`
- `src/components/shared/domain`
- `src/components/shared/forms`
- `src/components/shared/navigation`

Already extracted:

- filter toolbar shell
- section header shell
- empty state block
- loading panel/card
- section-level loading shell
- source badge and warning block
- data panel shell
- data-table panel shell
- detail hero/detail card shell
- list row shell
- metric grid/card shell
- detail list/detail row shell
- reusable labeled field/select/input shell
- reusable inline action group

Already added beyond the original shared shells:

- reusable UI primitives and combo pieces in `src/components/ui/*`
- business-aware shared-domain components for dashboard fallback, ops context, workbench context, and club application list views
- provider and hook barrels for cleaner app-level imports
- naming cleanup work that is moving shared defaults away from feature-specific CSS class names
- lower-level helper cleanup so `components/ui/*` no longer depends upward on `components/shared/*`

Suggested next extractions:

- page action bar
- reusable stats/detail-summary shell
- navigation-specific wrappers if cross-route navigation patterns continue to repeat
- more domain-aware panels such as inbox shells, public profile shells, or operations-specific list shells
- richer data-table or list variants only when a second concrete use case appears

Likely source files to mine for reusable pieces:

- `src/features/public-hall/components.tsx`
- `src/features/member-hub/components.tsx`
- `src/features/tournament-ops/components.tsx`
- `src/features/blueprint/sections.tsx`

Definition of done for Phase B:

- the current shared components stop churning heavily across features
- the current `components/ui/*` primitives stop churning heavily across features
- repeated feature markup continues to move into `src/components/shared`
- business-aware shared patterns land in `shared/domain` instead of bouncing between feature-local code and low-level primitives
- feature component files become more composition-oriented and less repetitive
- shared APIs expose neutral naming instead of inheriting feature-specific defaults
- low-level primitives do not regain reverse dependencies on higher shared layers

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
- root interaction views reuse the shared primitive layer instead of maintaining a parallel bespoke notice/dialog presentation stack

### Phase D: Consolidate the styling direction

Objective:

- continue the ongoing move toward the template-style styling path without forcing a one-shot rewrite

Current status:

- Tailwind CSS v4 is already installed
- `src/index.css` now owns tokens and base theme setup
- `components/ui/*` already carries part of the reusable structure
- `app.css` and `template-shell.css` still own a meaningful amount of layout and legacy structure

Working rule:

- keep new reusable UI on the component-owned path
- only leave code in large global CSS blocks when it is genuinely page-specific or theme-level
- migrate by replacement, not by rewriting every existing selector up front

Definition of done for Phase D:

- new components stop mixing unrelated styling approaches
- the most-used `components/ui/*` and `components/shared/*` families increasingly own their own structure instead of depending on large global style blocks
- global CSS keeps theme and page-specific language while reusable structure progressively moves into component implementations

### Phase E: Fill template ecosystem gaps

Objective:

- close the remaining gap with `template/frontend` only after the app structure and shared UI are stable

Possible later additions:

- Zustand for true cross-page state
- Radix packages where an existing primitive has a real accessibility or interaction baseline gap
- shadcn/ui-style primitives
- react-hook-form where forms become complex
- stronger linting/tooling alignment with the template

Important rule:

- do not add ecosystem dependencies just to match the template visually
- add them only when the current code has an actual maintenance or reuse problem they solve
- especially avoid adding global state tooling before the app actually has cross-route state pressure
- treat `@radix-ui/react-dialog` as the current example of the right threshold: it was added for a live root-dialog baseline need, not for stack symmetry

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

- duplicating raw backend normalization already handled by the `src/api/*` modules

### `src/features/<feature>/hooks.ts`

Use for:

- feature composition hooks
- stateful orchestration for filters, selected items, or feature flows

Avoid:

- turning every local state object into a hook without reuse value

### `src/components/ui`

Use for:

- reusable UI primitives and low-level composition pieces
- generic buttons, cards, inputs, selects, dialogs, alerts, tables, tabs, and similar building blocks
- CSS-first internal UI elements that can support multiple shared and feature layers

Avoid:

- route-specific composition
- business-aware copy or feature assumptions
- data-loading logic

### `src/components/shared`

Use for:

- reusable presentational pieces shared by multiple features
- shells, badges, states, panels, toolbars, wrappers
- business-aware shared compositions that sit above `components/ui`

Current practical layering inside `shared`:

- `shared/feedback` owns reusable source, empty, and loading patterns such as `SourceBadge`, `LoadingCard`, and `LoadingSection`
- `shared/data-display` owns reusable presentation shells such as `DataPanel`, `DataTablePanel`, detail shells, and list/metric display helpers
- `shared/domain` owns business-aware reusable workbench and domain presentation shells such as `DashboardPanelShell`, `OpsContextPanel`, `WorkbenchContextPanel`, and `ClubApplicationList`

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

### `src/api/*`

Use for:

- request construction
- fetch handling
- backend payload normalization
- typed API entry points

This file should remain the single source of truth for backend-to-frontend shape adaptation.

## 9. Pressure-Driven Continuation Points

If migration resumes later, the next additions should come from real code pressure rather than from the plan itself.

Most likely future ecosystem gaps to fill:

1. More Radix packages when an existing primitive shows a real accessibility or interaction baseline gap.
2. `react-hook-form` when forms stop being simple field wrappers and start needing schema-driven validation and richer orchestration.
3. Zustand only when real cross-route state pressure appears.
4. Broader linting/tooling alignment if the current lightweight stack starts slowing collaboration or consistency.

Immediate status update:

- the `ui -> shared` reverse dependency has already been removed
- shared default naming has started moving toward neutral `shared-*` class conventions
- `LoadingSection`, `DataTablePanel`, and `WorkbenchContextPanel` are now real shared APIs in active use
- blueprint summary cards and home-workbench guide/result shells have started moving behind shared APIs as their semantics stabilized
- public-hall hero highlights and tournament-ops dependency notes are also starting to converge on shared summary/domain panels
- public-hall hero-side stat cards now also fit the same summary-card family instead of living as a one-off display pattern
- blueprint module and role cards are starting to converge on a shared metadata-card display pattern
- the styling direction is now a gradual template-stack alignment that has already started, not a future decision point
- the next cleanup gains are likely to come from removing old aliases and simplifying feature files further, not from adding another abstraction tier
- shared feedback/forms/data-display families have continued moving label, spacing, separator, and summary-card semantics into component implementations
- root notice and confirm rendering now reuse the same `ui` primitive layer that feature code uses, which narrows the gap between app-level infrastructure and template-style rendering
- Tailwind, base tokens, and utility-composition helpers are now part of the active stack, so the remaining styling/tooling gap is more about breadth and consistency than initial adoption
- `@radix-ui/react-dialog` has now been adopted as the first package-by-package Radix addition because confirm dialog behavior had real leverage there
- the current assessment is still to pause before adding more Radix packages until another similarly concrete pressure point appears

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
- the current `components/ui/*` primitives are reused by multiple shared and feature layers without semantic churn
- at least 2 more repeated UI patterns have been extracted to `src/components/shared`
- business-aware repeated UI patterns are landing in `shared/domain` instead of being duplicated across features
- app-level notices are reused by more than one feature without feature-specific duplication
- confirm dialogs are reused by more than one feature without local one-off implementations
- no one introduces a broad global state layer without a concrete cross-page need
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
