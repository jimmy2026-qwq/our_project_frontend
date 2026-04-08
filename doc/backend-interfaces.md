# Backend Interfaces

## Club Tournament Participation API

The frontend currently has to infer a club's "invited / participating tournaments" by reading tournament lists and filtering `participatingClubs` on the client.

That works as a temporary bridge, but it is not the right long-term contract.

The backend should provide an explicit club-facing tournament participation API so the frontend does not have to guess semantics from multiple endpoints.

## Why This Should Move To The Backend

- The backend is the source of truth for invitation and participation state.
- The frontend is currently doing an `N+1` read pattern: list tournaments, then fetch details, then filter by `clubId`.
- If statuses expand later, the current client-side inference will become unreliable.
- Permission-sensitive views are easier to control from a dedicated backend contract.

## Recommended Primary Endpoint

### `GET /clubs/:clubId/tournaments`

Purpose:

- return the tournaments that are relevant to one club from the club's point of view
- support both public display and club-admin workflows

Suggested query params:

- `scope`
  - `recent`
  - `active`
  - `all`
- `viewer`
  - optional operator id if the backend wants to tailor admin-only fields
- `limit`
- `offset`

Suggested response:

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

## Recommended Status Field

Use a dedicated club-facing status instead of forcing the frontend to infer meaning from `participatingClubs`.

Suggested enum:

- `Invited`
- `Participating`
- `Declined`
- `Withdrawn`
- `Finished`

Notes:

- If the current backend model has no separate invitation state yet, it is still okay to start with only:
  - `Participating`
  - `Finished`
- But the response field should still exist, so the contract can grow without reshaping the UI again.

## Optional Admin-Oriented Endpoint

### `GET /clubs/:clubId/tournament-invitations`

Purpose:

- only return invitations or actionable participation items for club admins

Suggested response item:

```json
{
  "tournamentId": "tournament-7ade2f22",
  "name": "Spring Open",
  "status": "Invited",
  "invitedAt": "2026-04-07T08:00:00Z",
  "invitedBy": "player-3002d0a9",
  "requiresLineup": true,
  "canAccept": true,
  "canDecline": true
}
```

If the backend prefers one endpoint only, this information can also be folded into `GET /clubs/:clubId/tournaments`.

## Decline / Withdraw Capability

The frontend checked the current backend routes and services and did not find a formal "decline tournament participation" or "remove club from tournament" API.

Current relevant capability that does exist:

- `POST /tournaments/:tournamentId/clubs/:clubId`
  - registers a club into a tournament

Current capability that does not appear to exist yet:

- club declines an invitation
- club withdraws from a tournament
- tournament admin removes a club from participation

## Recommended Write Endpoints

### Club admin declines invitation

`POST /clubs/:clubId/tournaments/:tournamentId/decline`

Suggested request:

```json
{
  "operatorId": "player-db4bb589",
  "note": "Club will not participate this split"
}
```

### Club admin accepts invitation

If the backend later adds a real invitation state:

`POST /clubs/:clubId/tournaments/:tournamentId/accept`

If the backend keeps the current "register directly" model, this endpoint may be unnecessary.

### Tournament admin removes a club

`POST /tournaments/:tournamentId/clubs/:clubId/remove`

Suggested request:

```json
{
  "operatorId": "player-3002d0a9",
  "note": "Removed after club requested withdrawal"
}
```

## Frontend Use After This API Exists

Once the backend provides this contract, the frontend should:

- stop scanning all tournaments to discover club participation
- read club tournament items directly from the club endpoint
- show "查看赛事详情" using the returned `tournamentId`
- show club-admin actions only when `canAccept`, `canDecline`, or `canSubmitLineup` is true

## Current Temporary Frontend Behavior

Right now the frontend:

- reads `GET /public/clubs/:clubId`
- keeps `recentMatches` as the base "Recent tournaments" data
- separately reads tournaments and filters `participatingClubs`
- merges those into the same list

This is only a temporary compatibility layer and should be removed after the backend provides a dedicated contract.
