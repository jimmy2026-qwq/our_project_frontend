# Backend Interfaces

This document describes the frontend/backend contract as it exists after the recent structure cleanup and backend refactor.

It replaces older notes that treated several tournament and club flows as still missing at the backend layer.

## Current Status

The backend contract is in much better shape than the older migration notes suggested.

What is already aligned:

- tournament read and mutation routes now return dedicated frontend-facing views instead of raw aggregates
- club application responses are stable scalar-or-null fields rather than mixed array/scalar payloads
- club tournament participation has a dedicated backend contract, including lifecycle actions
- APIMessage request and response types are the source of truth for backend communication

What is still mainly a frontend cleanup problem:

- `front/src/api/operations.ts` is still too large and groups too many capabilities together
- a few transport compatibility helpers still live too close to business-facing API modules
- `front/src/api/client.ts` still mixes runtime exports and contract exports

So the main remaining work is no longer "make the backend expose the right shape". It is "keep the frontend contract layer narrow and clean".

## Contract Areas

### Session and Auth

These routes are stable enough for the current frontend:

- `GET /session`
- `GET /players/me`
- `POST /auth/login`
- `POST /auth/register`
- `POST /guest-sessions`

The frontend still keeps separate auth/session contracts, which is the right direction.

### Club Applications

These routes are now treated as stable contract surfaces:

- `GET /clubs/:clubId/applications`
- `GET /clubs/:clubId/applications/:applicationId`
- `POST /clubs/:clubId/applications`
- `POST /clubs/:clubId/applications/:applicationId/withdraw`
- `POST /clubs/:clubId/applications/:applicationId/review`

Frontend expectation:

- `message`, `reviewNote`, `reviewedBy`, `reviewedByPlayerId`, and similar fields are scalar-or-null
- list/detail/mutation payloads should stay explicitly view-driven

This part no longer needs a backend redesign. The frontend should just avoid reintroducing fallback unwrapping.

### Tournament Detail and Mutation

This was the biggest older mismatch, and it is now fixed.

These routes are expected to return dedicated detail or mutation views:

- `GET /tournaments/:tournamentId`
- `POST /tournaments/:tournamentId/publish`
- `POST /tournaments/:tournamentId/stages/:stageId/lineups`
- `POST /tournaments/:tournamentId/stages/:stageId/schedule`
- `POST /tournaments/:tournamentId/clubs/:clubId`

Frontend contract note:

- read flows should consume `TournamentDetailContract`
- write flows should consume `TournamentMutationContract`
- feature code should depend on API contracts plus mappers, not feature-local copies of the same shape

### Club Tournament Participation

This area is no longer "missing backend work". It already has its own contract surface.

Current routes:

- `GET /clubs/:clubId/tournaments`
- `POST /clubs/:clubId/tournaments/:tournamentId/accept`
- `POST /clubs/:clubId/tournaments/:tournamentId/decline`
- `POST /tournaments/:tournamentId/clubs/:clubId`

This should be treated as the single source for club-facing tournament participation state instead of reconstructing it from unrelated public views.

### Public Hall

Public hall routes are already mostly view-driven:

- `GET /public/schedules`
- `GET /public/clubs`
- `GET /public/clubs/:clubId`
- `GET /public/leaderboards/players`
- `GET /public/tournaments/:id`

The remaining cleanup here is mostly frontend composition and route coverage, not backend contract redesign.

## What Changed From The Older Notes

The following older conclusions are now outdated:

- tournament write routes no longer need a new `TournamentDetailView` proposal
- `TournamentMutationView` is no longer a future suggestion; mutation responses already use a dedicated shape
- club application array/scalar compatibility is no longer a required frontend bridge
- club tournament participation routes are no longer hypothetical

If you encounter a document or comment that still describes those items as missing backend work, treat that text as historical.

## Remaining Structural Gaps

These are still worth cleaning up, but they are mostly frontend-side concerns:

1. Split `front/src/api/operations.ts` by capability
2. Move remaining transport compatibility helpers behind a narrower boundary
3. Separate runtime API exports from contract declaration exports
4. Keep feature code consuming contracts through mappers instead of creating new near-duplicate types

## Working Rule

Use this rule going forward:

- if a route already returns a dedicated frontend-facing view, prefer frontend cleanup
- if a route returns a domain aggregate directly, treat it as a backend interface problem

Right now, most high-value frontend-facing routes are already in the first category.
