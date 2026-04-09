# Backend Interfaces

This document records the backend changes that are still recommended after the current frontend structure cleanup.

It replaces the older single-topic note about club tournament participation with a broader review of the active frontend/backend integration.

## Current Summary

The frontend is now in a much better state structurally:

- feature code no longer depends directly on most backend contract files
- domain types, API contracts, and feature-local types are more clearly separated
- several oversized feature files have been split

However, the backend interfaces are not yet uniformly aligned in the same way as the template project.

The current situation is mixed:

- `public/*` is mostly view-driven already
- `clubs/*` is partly view-driven, but the frontend still keeps historical compatibility handling
- `auth/*` is stable enough to use, but still exposes two related response shapes that the frontend currently normalizes together
- `tournaments/*` and several tournament write endpoints still expose raw domain aggregates rather than dedicated frontend-facing views

## Priority 1: Tournament Operations Needs Backend Changes

### Why

This is the largest remaining contract mismatch.

The frontend currently consumes a narrowed contract for tournament detail and lineup flows, but the backend routes still return the raw `Tournament` aggregate for several key endpoints.

Current backend examples:

- `GET /tournaments/:tournamentId`
- `POST /tournaments/:tournamentId/publish`
- `POST /tournaments/:tournamentId/stages/:stageId/lineups`
- `POST /tournaments/:tournamentId/stages/:stageId/schedule`
- `POST /tournaments/:tournamentId/clubs/:clubId`

These routes currently return the domain aggregate instead of a dedicated frontend-facing detail view.

That means the frontend is effectively depending on only a subset of a much larger backend model, which is workable but fragile.

### Recommended backend change

Introduce a dedicated tournament-facing response model for the operations workbench.

Suggested direction:

- add `TournamentDetailView`
- optionally add `TournamentMutationView` if mutation responses should be slimmer than read responses
- return those views consistently from the routes above instead of the raw `Tournament`

### Minimum stable fields

The frontend workbench currently needs these categories to stay explicit and stable:

- tournament identity and lifecycle status
- organizer, startsAt, endsAt
- participating clubs and players
- whitelist summary
- stages with:
  - `id`
  - `name`
  - `format`
  - `order`
  - `status`
  - `currentRound`
  - `roundCount`
  - `schedulingPoolSize`
  - `pendingTablePlanCount`
  - `scheduledTableCount`
  - `lineupSubmissions`

### Why frontend-only cleanup is not enough

The frontend can keep trimming and renaming its local types, but as long as these routes return raw aggregates, it still has to guess which subset is safe to rely on.

This is the main place where backend participation is required.

## Priority 2: Club Application Contracts Should Be Tightened

### Why

The backend already builds a dedicated `ClubMembershipApplicationView`, which is good.

But the frontend still keeps compatibility logic for fields that may arrive as:

- `string`
- `string[]`
- `number`
- `number[]`

That compatibility layer suggests the frontend still does not fully trust the live response shape.

### Recommended backend change

Confirm and preserve the current `ClubMembershipApplicationView` serialization as the single supported response shape for:

- `GET /clubs/:clubId/applications`
- `GET /clubs/:clubId/applications/:applicationId`
- `POST /clubs/:clubId/applications/:applicationId/review`

If the current backend output is already stable and scalar-valued, the frontend can remove its historical fallback unwrapping afterward.

### Optional follow-up backend improvements

- expose an explicit response schema in OpenAPI for the application list and detail routes
- keep guest-origin application approval semantics explicit in the review contract
- document whether `message`, `reviewNote`, `reviewedBy`, and similar fields are always scalar-or-null

### What the frontend can do before backend work lands

- continue using the existing compatibility mapper
- progressively isolate the compatibility code to one mapper boundary

## Priority 3: Club Tournament Participation Needs A Dedicated Contract

### Why

This is the older gap already identified before the larger review, and it is still valid.

The frontend currently infers a club's tournament participation by combining:

- public club detail
- recent matches
- tournament lists
- tournament detail checks against `participatingClubs`

That is still only a temporary bridge.

### Recommended endpoint

`GET /clubs/:clubId/tournaments`

Suggested query params:

- `scope`
  - `recent`
  - `active`
  - `all`
- `viewer`
  - optional operator id for role-sensitive fields
- `limit`
- `offset`

Suggested response shape:

```json
{
  "items": [
    {
      "tournamentId": "tournament-7ade2f22",
      "name": "Spring Open",
      "status": "RegistrationOpen",
      "clubParticipationStatus": "Participating",
      "stageName": "Swiss Stage 1",
      "startsAt": "2026-04-07T07:44:11.557Z",
      "endsAt": "2026-04-07T15:44:11.557Z",
      "canViewDetail": true,
      "canSubmitLineup": true,
      "canDecline": false
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0,
  "hasMore": false
}
```

### Related write endpoints that still do not clearly exist

The current backend clearly supports registering a club into a tournament:

- `POST /tournaments/:tournamentId/clubs/:clubId`

But a full club-facing lifecycle still appears incomplete:

- club declines invitation
- club withdraws from participation
- tournament admin removes a club from participation

Suggested endpoints:

- `POST /clubs/:clubId/tournaments/:tournamentId/decline`
- `POST /clubs/:clubId/tournaments/:tournamentId/accept`
- `POST /tournaments/:tournamentId/clubs/:clubId/remove`

## Priority 4: Auth Contracts Can Be Clarified, But This Is Not A Blocker

### Current situation

The backend already distinguishes:

- login/register success response
- auth session lookup response

These are close enough for the frontend to normalize safely.

### Recommended backend change

This is optional, not urgent:

- keep `AuthSuccessView` and `AuthSessionView` explicit in OpenAPI and docs
- avoid widening them into a looser shared shape at the backend layer

### Frontend-only cleanup is acceptable here

The frontend can independently keep these two response shapes separate in its contract layer without requiring backend work.

## Frontend-Only Work Still Worth Doing

The frontend can continue improving these areas without waiting for backend changes:

- keep `auth` login/session contracts separate instead of treating them as one wide payload
- consume more optional stable fields from public list/detail responses where useful
- keep reducing feature-local compatibility logic so mismatches stay isolated to API mappers

## Recommended Order

1. Backend: introduce tournament operations detail/mutation views
2. Backend + frontend: tighten club application response guarantees and remove legacy array/scalar compatibility handling
3. Backend: add dedicated club tournament participation endpoints
4. Frontend: continue contract cleanup for auth and public summary/detail consumption

## Working Rule

If an endpoint already returns a dedicated frontend-facing view, frontend-only cleanup is usually enough.

If an endpoint still returns a raw aggregate directly from the domain model, treat it as a backend interface problem and prefer fixing the contract at the source.
