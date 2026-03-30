# RiichiNexus Frontend

This document describes the frontend as it exists today under `front/src`.

## Backend Interfaces Needed Next

These are the backend contracts the current frontend still needs in order to fully close the
registered-player -> club-application -> club-admin review loop without relying on local bridge state.

### 1. Create club application

Endpoint:

- `POST /clubs/:clubId/applications`

Why the frontend needs it:

- the blueprint home application flow already submits this request
- after submit, the frontend needs a stable application identifier so it can:
  - render the newly created application status immediately
  - withdraw the same application later
  - let the club-admin inbox resolve the exact same record

Recommended stable request body:

```json
{
  "operatorId": "player-123",
  "message": "I'd like to join."
}
```

Guest-origin submissions may still support:

```json
{
  "guestSessionId": "guest-123",
  "displayName": "Guest Alice",
  "message": "I'd like to join."
}
```

Recommended stable response shape:

```json
{
  "applicationId": "membership-123",
  "clubId": "club-123",
  "clubName": "EastWind Club",
  "applicant": {
    "playerId": "player-123",
    "applicantUserId": "demo-alice",
    "displayName": "Alice",
    "playerStatus": "Active",
    "currentRank": {},
    "elo": 1540,
    "clubIds": []
  },
  "submittedAt": "2026-03-29T10:00:00Z",
  "message": "I'd like to join.",
  "status": "Pending",
  "reviewedBy": null,
  "reviewedByDisplayName": null,
  "reviewedAt": null,
  "reviewNote": null,
  "withdrawnByPrincipalId": null,
  "canReview": false,
  "canWithdraw": true
}
```

Frontend note:

- ideally this should return the same stable shape as `GET /clubs/:clubId/applications/:membershipId`
- that keeps create/list/detail/review/withdraw on one shared frontend model

### 2. Withdraw club application

Endpoint:

- `POST /clubs/:clubId/applications/:membershipId/withdraw`

Why the frontend needs it:

- the blueprint home application flow already exposes withdraw for pending applications
- the frontend needs the backend-confirmed final status after withdraw so the player view and admin
  inbox stay consistent

Recommended stable request body:

```json
{
  "operatorId": "player-123",
  "note": "Schedule changed."
}
```

Guest-origin withdrawals may still support:

```json
{
  "guestSessionId": "guest-123",
  "note": "No longer joining."
}
```

Recommended stable response shape:

```json
{
  "applicationId": "membership-123",
  "clubId": "club-123",
  "clubName": "EastWind Club",
  "applicant": {
    "playerId": "player-123",
    "applicantUserId": "demo-alice",
    "displayName": "Alice",
    "playerStatus": "Active",
    "currentRank": {},
    "elo": 1540,
    "clubIds": []
  },
  "submittedAt": "2026-03-29T10:00:00Z",
  "message": "I'd like to join.",
  "status": "Withdrawn",
  "reviewedBy": null,
  "reviewedByDisplayName": null,
  "reviewedAt": null,
  "reviewNote": null,
  "withdrawnByPrincipalId": "player-123",
  "canReview": false,
  "canWithdraw": false
}
```

### 3. Managed club scope for the current operator

Current gap:

- `#/member-hub` currently uses a hard-coded club-admin operator and managed club list in the frontend
- `GET /session` exposes role flags, but not which clubs a club-admin can actually manage

What the frontend needs:

- either extend `GET /session` with managed club scope
- or add a dedicated endpoint such as `GET /operators/me/clubs?operatorId=...`

Recommended minimal stable shape:

```json
{
  "operatorId": "player-admin",
  "managedClubs": [
    {
      "clubId": "club-123",
      "name": "EastWind Club"
    },
    {
      "clubId": "club-456",
      "name": "SouthGate Club"
    }
  ]
}
```

Why it matters:

- this is the missing piece for turning the current member hub from a demo-style operator picker into
  a real authenticated admin workbench

## Source Of Truth

Use these documents first when validating backend contracts:

- `front/doc/DEMO_FRONTEND_API.md`
- `front/doc/FRONTEND_INTERFACE_CONTRACTS.md`

Do not treat `front/doc/backend_api.md` as the primary contract source. It reflects an older integration pass and is mainly historical reference now.

## Current App Shell

The app is mounted from `front/src/app.ts` and currently exposes four top-level areas through hash routing:

- `#/` -> project blueprint home
- `#/public` -> public hall
- `#/member-hub` -> member hub
- `#/tournament-ops` -> tournament operations

Detail pages currently routed through the public hall:

- `#/public/tournaments/:tournamentId`
- `#/public/clubs/:clubId`

There is no guest-facing player detail route in the current code.

## Module Map

Main modules under `front/src/modules`:

- `public-hall.ts`
  - guest/public entry
  - public schedules
  - public club directory
  - public player leaderboard
  - tournament detail page
  - club detail page
- `guest-application.ts`
  - blueprint-home club application workbench
  - create and withdraw club applications
- `member-hub.ts`
  - member and club-admin read views
  - player dashboard
  - club dashboard
  - club application inbox
- `tournament-ops.ts`
  - tournament tables
  - records
  - appeals
- `hero.ts`, `architecture.ts`, `role-matrix.ts`, `workbench.ts`, `api-reference.ts`
  - static blueprint/home sections

## Data Loading Strategy

The frontend is `API first` with mock fallback.

General rule:

- try the backend first
- if the request fails or the data is unavailable, fall back to local mock/default data
- keep the page usable instead of blocking the screen

This pattern is implemented directly inside page modules today rather than through a shared request-state abstraction.

## Public Hall

`front/src/modules/public-hall.ts` is the main guest-facing surface.

### Home data

The public hall home no longer depends on `GET /demo/summary`.

It now reads lightweight public endpoints directly:

- `GET /public/schedules`
- `GET /public/clubs`
- `GET /public/leaderboards/players`

### Detail data

Public hall detail pages read:

- `GET /public/tournaments/:id`
- `GET /public/clubs/:id`

### Important implementation detail

The backend public payloads do not match the frontend view models one-to-one, so `front/src/api/client.ts` contains a normalization layer that page modules rely on.

Current client-side normalization includes:

- `/public/schedules.startsAt` -> frontend `scheduledAt`
- `/public/clubs.clubId` -> frontend `id`
- `/public/clubs.treasuryBalance` -> frontend `treasury`
- `/public/leaderboards/players.clubIds` -> display `clubName`
- `/public/leaderboards/players.status === Suspended` -> frontend `Inactive`
- `/public/tournaments/:id` -> mapped into the current `TournamentPublicProfile` shape
- `/public/clubs/:id` -> mapped into the current `ClubPublicProfile` shape

The club detail mapping is intentionally defensive because the live backend currently returns some policy fields as arrays instead of scalar values.

### Current public hall limitations

- no public player detail page
- no true public tournament index page yet
- no true public club search/sort page beyond the current hall filters

## Home-Page Club Application Workbench

`front/src/modules/guest-application.ts` currently provides a registered-player style application flow on the blueprint home page.

Backend calls used there:

- `GET /clubs?activeOnly=true&joinableOnly=true`
- `GET /players/me`
- `POST /clubs/:clubId/applications`
- `POST /clubs/:clubId/applications/:membershipId/withdraw`

When the backend is unavailable, the module falls back to local club data plus a local bridge for application state.

## Member Hub

`front/src/modules/member-hub.ts` is a read-oriented workbench for a preconfigured operator context.

Backend calls used there:

- `GET /dashboards/players/:playerId?operatorId=...`
- `GET /dashboards/clubs/:clubId?operatorId=...`
- `GET /clubs/:clubId/applications?operatorId=...`

The inbox is backend-first. The local bridge in `front/src/lib/club-applications.ts` is now only a fallback path when the backend queue is unavailable.

## Tournament Operations

`front/src/modules/tournament-ops.ts` provides read views for tournament operations using a currently hard-coded tournament/stage context list.

Backend calls used there:

- `GET /tournaments/:id/stages/:stageId/tables`
- `GET /records`
- `GET /appeals`

This page is still partially scaffold-like because the tournament/stage selector data is not yet loaded dynamically from the backend.

## API Client

`front/src/api/client.ts` is the shared typed client.

It currently does three kinds of work:

- builds request URLs from typed filters
- performs fetch/json request handling
- adapts several public backend payloads into the frontend domain models used by page modules

The adaptation logic in this file is important and should be preserved when refactoring. Several pages assume the normalized frontend shapes rather than raw backend payloads.

## Mock Data

Mock/default data lives mainly in:

- `front/src/mocks/overview.ts`

Use mocks for:

- local development when the backend is down
- detail-page fallback when a public detail endpoint is missing or unstable
- keeping layout and navigation testable while contracts are still moving

## Current Backend Endpoints In Use

Public hall:

- `GET /public/schedules`
- `GET /public/clubs`
- `GET /public/leaderboards/players`
- `GET /public/tournaments/:id`
- `GET /public/clubs/:id`

Blueprint home application flow:

- `GET /clubs`
- `GET /players/me`
- `POST /clubs/:clubId/applications`
- `POST /clubs/:clubId/applications/:membershipId/withdraw`

Member hub:

- `GET /dashboards/players/:playerId?operatorId=...`
- `GET /dashboards/clubs/:clubId?operatorId=...`
- `GET /clubs/:clubId/applications?operatorId=...`

Tournament operations:

- `GET /tournaments/:id/stages/:stageId/tables`
- `GET /records`
- `GET /appeals`

Demo-oriented endpoint still present in the client:

- `GET /demo/summary`

That endpoint remains in the codebase but is not the driver for the current public hall home flow.

## Known Gaps

- no public player detail route
- no dynamic tournament/stage directory for tournament operations
- no shared request-state abstraction yet
- no proper router yet; the app still uses manual hash routing

## Recommended Next Work

High-value near-term improvements:

- add a real public tournaments index page
- add a richer public clubs list/search page
- load tournament/stage selector data dynamically instead of using hard-coded contexts

Longer-term improvements:

- move from manual hash routing to a proper router
- split the large page modules into reusable view and data-loading layers
- centralize loading, empty, error, and fallback handling

## Connection Setup

- API base env var: `VITE_API_BASE_URL`
- default API prefix in frontend: `/api`
- Vite dev proxy file: `front/vite.config.ts`
- current proxy target: `http://127.0.0.1:8080`

## Maintenance Note

If a public page starts "loading forever" or falls through to a misleading mock/not-found state, check `front/src/api/client.ts` first. The most recent integration issues were caused by backend payload shape drift rather than route logic.
