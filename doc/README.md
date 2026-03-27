# RiichiNexus Frontend

## Backend Interfaces Needed Next

These are the interfaces the frontend most wants next, in priority order.

Must-have to replace current frontend placeholders:

- `GET /clubs/:clubId/applications?operatorId=:clubAdminId&status=Pending&limit=20`
  - Needed to replace the current local inbox bridge in Member Hub with a real club-application queue.
- `POST /clubs/:clubId/applications/:membershipId/review`
  - Suggested body: `{ operatorId, decision, note }`
  - Needed so Club Admin can approve or reject applications instead of only seeing a passive inbox.
- `GET /players/me` or `GET /session`
  - Needed to replace the current preconfigured Registered Player identity in the home-page application workbench.

Very valuable next:

- `GET /clubs?activeOnly=true&joinableOnly=true`
  - Needed to give the application workbench a backend-defined set of clubs that are currently accepting applications.
- `GET /clubs/:clubId/applications/:membershipId`
  - Helpful for showing a player-facing application status view after submission.
- `GET /tournaments/:id/stages`
  - Needed to remove hard-coded stage context from Tournament Operations.

Experience and completeness upgrades:

- `GET /public/tournaments`
  - Needed to build a real public tournaments index page instead of relying only on schedules plus detail pages.
- A stable documented response shape for `GET /public/tournaments/:id`
- A stable documented response shape for `GET /public/clubs/:id`
- Public club detail related lists, if not embedded:
  - recent matches
  - current lineup
  - honors
- Public club application policy / recruitment metadata:
  - whether applications are open
  - any requirements text
  - expected review SLA
- Public tournament detail related lists, if not embedded:
  - stage list
  - standings snapshot
  - bracket snapshot for knockout stages

Still highly useful from the existing backend capabilities:

- Stage standings
- Finals bracket
- Seat readiness / disconnect state updates
- Appeal triage filters
- Advanced stats boards

## Current State

This frontend now has a broader delivery shell:

- Project blueprint home
- Public hall
- Home-page club application workbench
- Member hub
- Tournament operations

Implemented pages:

- Public home
- Tournament detail page
- Club detail page
- Project blueprint home
- Home-page club application workbench
- Member hub
- Tournament operations

Current behavior:

- Public list pages are `API first`
- If the backend is unavailable, the UI falls back to local mock/default data
- Tournament detail and club detail pages also use `API first / mock fallback`
- Routing is currently implemented with hash routes
- Frontend now calls backend through `VITE_API_BASE_URL`, defaulting to `/api`
- Vite dev proxy rewrites `/api/*` to the backend service

## Important Functions Already Implemented

Public browsing:

- Public schedules with filters
- Public player leaderboard with club / status filters
- Public club directory
- Tournament detail page
- Club detail page
- Graceful fallback when backend is offline

Workbench flows:

- Registered-player club application workbench on the home blueprint page
- Local application inbox bridge so Club Admin can preview incoming applications in Member Hub
- Club dashboard / player dashboard read views
- Tournament tables / records / appeals read views

Frontend infrastructure:

- Shared list envelope support
- Typed API client
- Guest-facing read-only UI shell
- Mock data layer for local development and backend downtime

## Backend Endpoints Currently Used

Already wired in the frontend:

- `GET /public/schedules`
- `GET /public/leaderboards/players`
- `GET /clubs`
- `GET /public/tournaments/:id` if available
- `GET /public/clubs/:id` if available
- `POST /clubs/:clubId/applications`
- `POST /clubs/:clubId/applications/:membershipId/withdraw`
- `GET /dashboards/players/:playerId?operatorId=...`
- `GET /dashboards/clubs/:clubId?operatorId=...`
- `GET /tournaments/:id/stages/:stageId/tables`
- `GET /records`
- `GET /appeals`

Notes:

- The public leaderboard model now supports `currentRank` and `normalizedRankScore`
- If `GET /public/tournaments/:id` or `GET /public/clubs/:id` is not implemented yet, the corresponding detail page will render default mock data

## Recommended Next Steps

Short term:

- Replace detail-page mock fields with real backend fields once the detail endpoints are finalized
- Add a true public tournaments list page
- Add a true public clubs list page with richer search / sorting
- Replace the local club-application inbox bridge with backend query data
- Add Club Admin approve / reject actions once review endpoints exist

Mid term:

- Replace preconfigured Registered Player application identities with real registration / session data
- Add tournament standings page
- Add finals bracket page
- Add advanced stats read pages for players and clubs

Later:

- Move from hash routing to a proper router
- Split current modules into reusable page / section components
- Add request-state abstractions for loading / empty / error handling

## Current Development Rule

When backend data is unavailable:

- do not block the page
- render default mock data
- keep the page structure usable
- make it easy to switch to real API data later

## Current Connection Setup

- Frontend API base URL: `VITE_API_BASE_URL`
- Default frontend API prefix: `/api`
- Dev proxy file: `vite.config.ts`
- Proxy target currently points to `http://127.0.0.1:8080`
