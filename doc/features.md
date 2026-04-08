# Feature Guide

## Data Loading Strategy

The frontend is still API first with mock fallback.

General rule:

- try the backend first
- if the request fails or the data is unavailable, fall back to local mock or default data
- keep the page usable instead of blocking the screen

The same pattern now also shows up in interaction feedback:

- refresh flows surface success, fallback, and failure through shared notice helpers
- mutation flows surface success and fallback through shared notice helpers
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
- home, tournament detail, and club detail are separated at the route and page layer
- normalization still lives in the modular files under `front/src/api/*`

Current limitations:

- no public player detail page
- no true public tournaments index page yet
- no richer club search or sort page beyond the current hall filters

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

- `GET /tournaments`
- `GET /tournaments/:id/stages`
- `GET /tournaments/:id/stages/:stageId/tables`
- `GET /tables/:tableId`
- `GET /records`
- `GET /appeals`
- `POST /tables/:tableId/seats/:seat/state`
- `POST /tables/:tableId/start`
- `POST /tables/:tableId/reset`
- `POST /tables/:tableId/appeals`

Implementation notes:

- tournament operations is routed through React pages under `features/tournament-ops`
- tournament and stage selectors now prefer backend data and can fall back to local defaults
- the current UI supports table selection, seat state updates, table start, reset, and filing an appeal

Current gaps:

- there is still no full appeal management workflow in the frontend
- tournament start and schedule actions are not yet surfaced as a full guided flow in the frontend
- runtime operator identity still needs to stay aligned with a real backend player record

## Mock Data

Mock and default data still lives mainly in:

- `front/src/mocks/overview.ts`

Use mocks for:

- local development when the backend is down
- detail-page fallback when a public detail endpoint is missing or unstable
- keeping layout and navigation testable while contracts are still moving

## Recent Migration Summary

Recent migration work has mostly focused on consolidation rather than new features.

What changed in the latest rounds:

- `blueprint` was mined for stable workbench explanation, result, summary, and metadata patterns
- `public-hall` summary, highlight, and stat cards were moved toward shared summary-card APIs
- `member-hub` and `tournament-ops` kept adopting shared domain and data-display shells
- refresh and mutation feedback flows started converging on shared hook helpers in `front/src/hooks`
- destructive confirm flows now share a thinner helper surface through `useDialog`
- Tailwind, PostCSS, and template-stack helper utilities are now installed and wired into the app entry
- shared feedback, forms, and data-display families now own more of their spacing, label, separator, and summary-card structure
- root notice and confirm rendering now reuse the shared primitive layer instead of maintaining a separate bespoke presentation shell

Current practical status:

- Phase B style shared UI consolidation is no longer the main bottleneck
- Phase D style template-stack alignment is now actively underway
- shared family cleanup and app-level interaction rendering are both moving along the same primitive path
