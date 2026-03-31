# RiichiNexus Frontend

This document describes the frontend as it exists today under `front/src`.

## Current Architecture

The frontend is now running in a routed React application shell.

Current foundation:

- app entry is `front/src/main.tsx`
- navigation is handled by `react-router-dom`
- route pages now exist for blueprint home, public hall, member hub, and tournament operations
- the app still preserves the original API-first plus mock-fallback strategy
- `front/src/api/client.ts` remains the shared typed request and normalization layer

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

## Legacy Pieces Still Present

The old DOM-oriented route/runtime layer has now been removed from the main codebase.

What still remains is mostly structural cleanup work, not old runtime ownership.

Examples of remaining follow-up areas:

- repeated visual patterns that are still being consolidated into `src/components/shared`
- large shared stylesheet coverage in `front/src/styles/app.css`
- backend-driven scope gaps such as managed club scope and dynamic tournament/stage directory loading

## Template-Mode Direction

The target direction remains aligned with `template/frontend/`:

- keep React app mounting and declarative routing
- continue splitting route pages into reusable feature components and hooks
- preserve API normalization in `front/src/api/client.ts`
- preserve API-first plus mock-fallback behavior behind clearer abstractions
- continue reducing reliance on oversized shared styling and move more of the app toward reusable shared UI patterns

## What Should Be Preserved

The following parts remain migration-critical:

- domain models in `front/src/domain`
- shared client and normalization logic in `front/src/api/client.ts`
- backend contract knowledge in `front/doc/DEMO_FRONTEND_API.md`
- backend contract knowledge in `front/doc/FRONTEND_INTERFACE_CONTRACTS.md`
- API-first plus mock-fallback behavior across public hall, member hub, and tournament operations
- the current information architecture: blueprint home, public hall, member hub, and tournament operations

## Data Loading Strategy

The frontend is still `API first` with mock fallback.

General rule:

- try the backend first
- if the request fails or the data is unavailable, fall back to local mock/default data
- keep the page usable instead of blocking the screen

The difference now is that this behavior is expressed through feature-level hooks and data helpers rather than direct DOM modules.

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

- continue extracting shared UI patterns such as source badge, loading shells, panel/layout building blocks, and repeated filter controls
- add a real public tournaments index page
- add a richer public clubs search/sort page
- load tournament/stage selector data dynamically instead of using hard-coded contexts

Longer-term improvements:

- continue reducing reliance on `front/src/styles/app.css`
- introduce a stronger shared UI/state layer aligned with `template/frontend`
- optionally adopt Zustand/Tailwind/shadcn patterns where they clearly reduce duplication

## Connection Setup

- API base env var: `VITE_API_BASE_URL`
- default API prefix in frontend: `/api`
- Vite dev proxy file: `front/vite.config.ts`
- current proxy target: `http://127.0.0.1:8080`
