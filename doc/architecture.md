# Frontend Architecture

This document describes the frontend as it exists today under `front/src`.

## Current Architecture

The frontend is now running in a routed React application shell.

Current foundation:

- app entry is `front/src/main.tsx`
- navigation is handled by `react-router-dom`
- route pages now exist for blueprint home, public hall, member hub, and tournament operations
- the app still preserves the original API-first plus mock-fallback strategy
- `front/src/api/*` now provides the shared typed request and normalization layer
- feature code is now mostly split by `pages -> features -> shared/domain/ui`

This means the codebase is no longer primarily a manual DOM prototype shell, and the blueprint homepage is now also rendered through native React components.

## Current Route Map

Top-level routes:

- `/` -> project blueprint home
- `/public` -> public hall
- `/member-hub` -> member hub
- `/tournament-ops` -> tournament operations

Public detail routes:

- `/public/tournaments/:tournamentId`
- `/public/clubs/:clubId`

There is still no guest-facing player detail route.

## Current Feature Structure

Main React-oriented structure under `front/src`:

- `app/`
  - app shell and routed layout
- `pages/`
  - route-level page components
- `features/blueprint`
  - blueprint home composition and home club-application workbench
- `features/public-hall`
  - public hall home, filters, and public detail views
- `features/member-hub`
  - player dashboard, club dashboard, and application inbox workbench
- `features/tournament-ops`
  - tables, records, and appeals workbench
- `api/`
  - typed backend API modules and normalization layer
- `domain/`
  - shared domain models
- `mocks/`
  - mock/default data for fallback mode

## Current UI Layering

The frontend now has a clearer internal layering than the earlier prototype phase.

Current UI split:

- `components/ui/`
  - low-level reusable primitives such as button, card, input, dialog, table, badge, tabs, and structured display elements
- `components/shared/layout`
  - section intro, panel head, action/filter toolbar, and similar layout-oriented wrappers
- `components/shared/feedback`
  - loading, empty, source, and warning presentation
- `components/shared/data-display`
  - data panels, detail shells, summary cards, metadata cards, list/metric/detail display helpers
- `components/shared/domain`
  - business-aware reusable shells such as dashboard panels, workbench guide/result/backlog panels, and club application list presentation
- `components/shared/forms`
  - labeled field wrappers and shared input/select/textarea/checkbox shells

Practical reading:

- the codebase no longer jumps directly from feature-local markup to raw primitives
- repeated presentation patterns have started moving into stable shared APIs
- feature files are increasingly composition-oriented rather than markup-heavy
- the most-used shared families now also own more of their own layout and separator semantics instead of depending mainly on `app.css`

## Current Interaction Infrastructure

The app now has a small root-level interaction layer mounted from `front/src/main.tsx`.

Current pieces:

- `providers/AppFeedbackProvider.tsx`
  - root notice stack
- `providers/DialogProvider.tsx`
  - root confirm dialog orchestration
- `hooks/useNotice.ts`
  - basic success/warning/info notice helper
- `hooks/useRefreshNotice.ts`
  - shared refresh success/fallback/failure notice helper
- `hooks/useMutationNotice.ts`
  - shared mutation success/fallback notice helper
- `hooks/useDialog.ts`
  - confirm dialog helper, including destructive confirm convenience

Current rule of thumb:

- one-off operation feedback should prefer root notices
- confirm-style destructive actions should prefer the shared dialog hook
- feature-local state should stay in feature hooks unless it truly becomes cross-page state

Current rendering status:

- the root notice stack now renders through the shared `Alert + Button` primitive path
- the root confirm dialog now renders through `DialogSurface`, `DialogBody`, `DialogFooter`, and shared button variants
- app-level interaction logic stays provider/hook-based, but the view layer is now much closer to the same primitive path feature code uses

## Legacy Pieces Still Present

The old DOM-oriented route/runtime layer has now been removed from the main codebase.

What still remains is mostly structural cleanup work, not old runtime ownership.

Examples of remaining follow-up areas:

- repeated visual patterns that are still being consolidated into `src/components/shared`
- large shared stylesheet coverage in `front/src/styles/app.css`
- pruning superseded CSS and class names now that newer shared shells are in active use

## Template-Mode Direction

The target direction remains aligned with `template/frontend/`:

- keep React app mounting and declarative routing
- continue splitting route pages into reusable feature components and hooks
- preserve API normalization in `front/src/api/*`
- preserve API-first plus mock-fallback behavior behind clearer abstractions
- continue reducing reliance on oversized shared styling and move more of the app toward reusable shared UI patterns
- keep the app-level interaction layer narrow and reusable instead of growing a broad modal or store layer too early
- keep pushing reusable structure into template-compatible component implementations instead of leaving it in large global style blocks

## What Should Be Preserved

The following parts remain migration-critical:

- domain models in `front/src/domain`
- shared API-module and normalization logic in `front/src/api/*`
- backend contract knowledge in `front/doc/DEMO_FRONTEND_API.md`
- backend contract knowledge in `front/doc/FRONTEND_INTERFACE_CONTRACTS.md`
- API-first plus mock-fallback behavior across public hall, member hub, and tournament operations
- the current information architecture: blueprint home, public hall, member hub, and tournament operations
- the newer shared UI boundaries under `front/src/components/shared`
- the current notice and confirm provider layer with hook-based usage
