# RiichiNexus Frontend

## Current State

This frontend currently focuses on the public guest-facing area.

Implemented pages:

- Public home
- Tournament detail page
- Club detail page

Current behavior:

- Public list pages are `API first`
- If the backend is unavailable, the UI falls back to local mock/default data
- Tournament detail and club detail pages also use `API first / mock fallback`
- Routing is currently implemented with hash routes

## Important Functions Already Implemented

Public browsing:

- Public schedules with filters
- Public player leaderboard with club / status filters
- Public club directory
- Tournament detail page
- Club detail page
- Graceful fallback when backend is offline

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

Notes:

- The public leaderboard model now supports `currentRank` and `normalizedRankScore`
- If `GET /public/tournaments/:id` or `GET /public/clubs/:id` is not implemented yet, the corresponding detail page will render default mock data

## Important Backend Capabilities Worth Surfacing Next

These are already available on the backend and are good candidates for future frontend work:

- Guest session creation
- Anonymous club application submission
- Club application withdrawal
- Stage standings
- Finals bracket
- Seat readiness / disconnect state updates
- Appeal triage filters
- Advanced stats boards

## Pending Backend Interfaces I Recommend Asking For

These are the most useful missing interfaces for improving the current public frontend:

- A stable documented response shape for `GET /public/tournaments/:id`
- A stable documented response shape for `GET /public/clubs/:id`
- Public tournament index endpoint such as `GET /public/tournaments`
- Public club detail related lists, if not embedded:
  - recent matches
  - current lineup
  - honors
- Public tournament detail related lists, if not embedded:
  - stage list
  - standings snapshot
  - bracket snapshot for knockout stages

## Recommended Next Steps

Short term:

- Replace detail-page mock fields with real backend fields once the detail endpoints are finalized
- Add a true public tournaments list page
- Add a true public clubs list page with richer search / sorting

Mid term:

- Add guest session creation and anonymous club application flow
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
