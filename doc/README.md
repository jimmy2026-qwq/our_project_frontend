# RiichiNexus Frontend

If build or migration work shows that a new tool from `template/frontend` is needed, the current work may be interrupted so the code can be refactored with your confirmation.

This document describes the frontend as it exists today under `front/src`.

## Current Architecture

The frontend is now running in a routed React application shell.

Current foundation:

- app entry is `front/src/main.tsx`
- navigation is handled by `react-router-dom`
- route pages now exist for blueprint home, public hall, member hub, and tournament operations
- the app still preserves the original API-first plus mock-fallback strategy
- `front/src/api/client.ts` remains the shared typed request and normalization layer
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
- `api/client.ts`
  - typed backend client and normalization layer
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
- backend-driven scope gaps such as managed club scope and dynamic tournament/stage directory loading
- pruning superseded CSS/class names now that newer shared shells are in active use

## Template-Mode Direction

The target direction remains aligned with `template/frontend/`:

- keep React app mounting and declarative routing
- continue splitting route pages into reusable feature components and hooks
- preserve API normalization in `front/src/api/client.ts`
- preserve API-first plus mock-fallback behavior behind clearer abstractions
- continue reducing reliance on oversized shared styling and move more of the app toward reusable shared UI patterns
- keep the app-level interaction layer narrow and reusable instead of growing a broad modal/store layer too early
- keep pushing reusable structure into template-compatible component implementations instead of leaving it in large global style blocks

## What Should Be Preserved

The following parts remain migration-critical:

- domain models in `front/src/domain`
- shared client and normalization logic in `front/src/api/client.ts`
- backend contract knowledge in `front/doc/DEMO_FRONTEND_API.md`
- backend contract knowledge in `front/doc/FRONTEND_INTERFACE_CONTRACTS.md`
- API-first plus mock-fallback behavior across public hall, member hub, and tournament operations
- the current information architecture: blueprint home, public hall, member hub, and tournament operations
- the newer shared UI boundaries under `front/src/components/shared`
- the current notice/confirm provider layer and hook-based usage pattern

## Data Loading Strategy

The frontend is still `API first` with mock fallback.

General rule:

- try the backend first
- if the request fails or the data is unavailable, fall back to local mock/default data
- keep the page usable instead of blocking the screen

The difference now is that this behavior is expressed through feature-level hooks and data helpers rather than direct DOM modules.

The same pattern now also shows up in interaction feedback:

- refresh flows surface success/fallback/failure through shared notice helpers
- mutation flows surface success/fallback through shared notice helpers
- feature pages stay thinner because the feedback rules are no longer rewritten inline each time

## Public Hall

Current public hall capabilities:

- `GET /public/schedules`
- `GET /public/clubs`
- `GET /public/leaderboards/players`
- `GET /public/tournaments/:id`
- `GET /public/clubs/:id`

Current implementation notes:

- public hall is now routed through React pages under `features/public-hall`
- home, tournament detail, and club detail are separated at the route/page layer
- normalization still lives in `front/src/api/client.ts`

Current limitations:

- no public player detail page
- no true public tournaments index page yet
- no richer club search/sort page beyond the current hall filters

## Home Club Application Workbench

The blueprint homepage still provides the registered-player style club application flow.

Backend calls used there:

- `GET /clubs?activeOnly=true&joinableOnly=true`
- `GET /players/me`
- `POST /clubs/:clubId/applications`
- `POST /clubs/:clubId/applications/:membershipId/withdraw`

Implementation note:

- the homepage workbench has now been migrated into `features/blueprint`
- the local inbox bridge is still used as the fallback path when backend requests fail

## Member Hub

Current member hub capabilities:

- `GET /dashboards/players/:playerId?operatorId=...`
- `GET /dashboards/clubs/:clubId?operatorId=...`
- `GET /clubs/:clubId/applications?operatorId=...`
- `POST /clubs/:clubId/applications/:membershipId/review`

Implementation note:

- member hub is now routed through React pages under `features/member-hub`
- inbox loading is backend-first, with fallback to `front/src/lib/club-applications.ts`

Current gap:

- managed club scope is still frontend-assumed rather than loaded from a stable backend operator scope endpoint

## Tournament Operations

Current tournament operations capabilities:

- `GET /tournaments/:id/stages/:stageId/tables`
- `GET /records`
- `GET /appeals`

Implementation note:

- tournament operations is now routed through React pages under `features/tournament-ops`
- the selector is still based on hard-coded tournament/stage context

Current limitation:

- no dynamic tournament/stage directory from the backend yet

## API Client

`front/src/api/client.ts` remains the shared typed client.

It still does three important jobs:

- builds request URLs from typed filters
- performs fetch/json request handling
- adapts backend payloads into frontend domain models used by the routed features

If a public page starts loading forever or drops into a misleading fallback state, check this file first. Most recent integration risk still comes from backend payload drift rather than route logic.

## Mock Data

Mock/default data still lives mainly in:

- `front/src/mocks/overview.ts`

Use mocks for:

- local development when the backend is down
- detail-page fallback when a public detail endpoint is missing or unstable
- keeping layout and navigation testable while contracts are still moving

## Backend Interfaces Needed Next

These are still the most useful backend contracts to tighten next:

1. Stable create club application response
2. Stable withdraw club application response
3. Managed club scope for the current operator
4. Dynamic tournament and stage directory endpoints for tournament operations

## Recommended Next Work

High-value near-term improvements:

- continue pruning superseded helpers, exports, and style blocks now that shared shells are stable
- continue tightening naming and ownership boundaries across `components/ui`, `components/shared`, and `components/shared/domain`
- keep reusing the root notice/dialog layer instead of introducing local one-off feedback or confirm implementations
- add a real public tournaments index page
- add a richer public clubs search/sort page
- load tournament/stage selector data dynamically instead of using hard-coded contexts

Longer-term improvements:

- continue reducing reliance on `front/src/styles/app.css`
- move gradually toward the template-oriented frontend stack as the system grows
- introduce a stronger shared UI/state layer aligned with `template/frontend`
- adopt Tailwind/shadcn-style patterns in staged migration work where they clearly reduce duplication

## Recent Migration Summary

Recent migration work has mostly focused on consolidation rather than new features.

What changed in the latest rounds:

- `blueprint` was mined for stable workbench explanation, result, summary, and metadata patterns
- `public-hall` summary/highlight/stat cards were moved toward shared summary-card APIs
- `member-hub` and `tournament-ops` kept adopting shared domain/data-display shells
- refresh and mutation feedback flows started converging on shared hook helpers in `front/src/hooks`
- destructive confirm flows now share a thinner helper surface through `useDialog`
- Tailwind/PostCSS and template-stack helper utilities are now installed and wired into the app entry
- shared feedback/forms/data-display families now own more of their spacing, label, separator, and summary-card structure
- root notice and confirm rendering now reuse the shared primitive layer instead of maintaining a separate bespoke presentation shell

Current practical status:

- Phase B style shared-UI consolidation is no longer the main bottleneck
- Phase D style template-stack alignment is now actively underway
- shared family cleanup and app-level interaction rendering are both moving along the same primitive path

## Connection Setup

- API base env var: `VITE_API_BASE_URL`
- default API prefix in frontend: `/api`
- Vite dev proxy file: `front/vite.config.ts`
- current proxy target: `http://127.0.0.1:8080`
