# Feature Guide

## Data Loading Strategy

The frontend is still API-first with guarded fallback behavior.

General rule:

- try the backend first
- keep the screen usable if a request cannot be fully confirmed
- surface partial success through shared notice helpers instead of silently hiding it

This means "fallback" now often means a feature-local bridge or a retained local state path, not a single global mocks directory.

## Public Hall

Current mounted routes:

- `/public`
- `/public/tournaments/:tournamentId`
- `/public/clubs/:clubId`

Current backend surfaces used here:

- `GET /public/schedules`
- `GET /public/clubs`
- `GET /public/leaderboards/players`
- `GET /public/tournaments/:id`
- `GET /public/clubs/:id`

Current implementation notes:

- route pages live under `pages/` and compose `features/public-hall`
- public hall now relies on shared API contracts and mappers rather than duplicated feature-local admin detail types
- club application and tournament lineup flows still include guarded fallback handling where the UI needs to stay usable

Current gaps:

- no public player detail route
- no dedicated public tournament index page beyond the current hall/schedule surface
- no richer public club directory route with its own search-first page model

## Blueprint

Current mounted route:

- `/blueprint`

This area still acts as a project-facing workbench and a registered-user integration surface.

Backend calls commonly used here:

- `GET /clubs?activeOnly=true&joinableOnly=true`
- `GET /players/me`
- `POST /clubs/:clubId/applications`
- `POST /clubs/:clubId/applications/:membershipId/withdraw`

Current note:

- blueprint still keeps a local bridge for club application history when live backend confirmation is incomplete

## Player Dashboard And Member Work

Current mounted route:

- `/me`

Related backend surfaces:

- `GET /dashboards/players/:playerId?operatorId=...`
- `GET /dashboards/clubs/:clubId?operatorId=...`
- `GET /clubs/:clubId/applications?operatorId=...`
- `POST /clubs/:clubId/applications/:membershipId/review`

Current mounted route:

- `/member-hub`

So "member hub" is now both a feature family and a literal routed workspace.

## Table And Match Workflow

Current mounted routes:

- `/tables/:tableId`
- `/tables/:tableId/paifu`

Current backend surfaces used here include:

- `GET /tables/:tableId`
- `POST /tables/:tableId/seats/:seat/state`
- `POST /tables/:tableId/start`
- `POST /tables/:tableId/reset`
- `POST /tables/:tableId/appeals`

This is the part of tournament operations that is already clearly surfaced in the routed UI.

## Tournament Operations

Tournament operations code lives under `features/tournament-ops` and is now exposed through a mounted route.

Backend surfaces already modeled in the frontend include:

- `GET /tournaments`
- `GET /tournaments/:id`
- `GET /tournaments/:id/stages`
- `GET /tournaments/:id/stages/:stageId/tables`
- `GET /records`
- `GET /appeals`

Current mounted route:

- `/tournament-ops`

## Feature-Level Structural Notes

The strongest recent cleanup happened in these areas:

- tournament mutation responses now use a dedicated frontend contract
- club/application array-scalar compatibility handling has been removed
- `public-hall` no longer keeps its own duplicate admin detail contract family

The main remaining frontend structural issue is still API-module granularity, especially in `front/src/api/operations.ts`.
