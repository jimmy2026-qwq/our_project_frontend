# RiichiNexus Frontend Interface Contracts

This document is the current frontend-facing contract summary for the code under `front/src/api/contracts`.

It is not meant to duplicate every backend route definition. Its job is to record:

- which contract files are the current source of truth
- which route families consume which contracts
- which shapes are already stable
- which legacy edges still exist

For generated backend docs, use:

- `GET /openapi.json`
- `GET /swagger`

## Source Of Truth

Current frontend contract files:

- `front/src/api/contracts/auth.ts`
- `front/src/api/contracts/clubs.ts`
- `front/src/api/contracts/operations.ts`
- `front/src/api/contracts/public.ts`

Working rule:

- transport declarations live in `api/contracts/*`
- API modules in `front/src/api/*.ts` consume those declarations
- feature code should prefer API modules and mappers over importing raw contract types everywhere

## 1. Auth And Session Contracts

Defined in `front/src/api/contracts/auth.ts`.

Current exported contracts:

- `AuthSuccessContract`
- `AuthSessionContract`
- `ApiMessagePayloadContract`
- `PlayerProfileContract`
- `CreatedPlayerContract`
- `DemoSummaryContract`

Main route families:

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/session`
- `POST /auth/logout`
- `GET /session`
- `GET /players/me`
- `GET /players/:playerId`
- `POST /guest-sessions`
- `GET /guest-sessions/:guestSessionId`

Important note:

- `GET /session` is consumed as a richer domain-facing session object
- `GET /players/me` and `GET /players/:playerId` still normalize `PlayerProfileContract` into frontend `PlayerProfile`

Current status:

- `PlayerProfileContract` has been tightened to the current backend shape
- frontend normalization still maps it into the richer domain `PlayerProfile`

## 2. Club Contracts

Defined in `front/src/api/contracts/clubs.ts`.

Current exported contracts:

- `ClubApplicationMutationResponseContract`
- `ClubApplicationApplicantContract`
- `ClubApplicationViewContract`
- `PublicClubRelationContract`
- `ClubContract`
- `ClubMemberContract`
- `ClubTournamentParticipationContract`

Main route families:

- `GET /clubs`
- `GET /clubs/:clubId`
- `GET /clubs/:clubId/members`
- `POST /clubs`
- `POST /clubs/:clubId/admins`
- `POST /clubs/:clubId/members/:playerId/remove`
- `POST /clubs/:clubId/applications`
- `POST /clubs/:clubId/applications/:membershipId/withdraw`
- `GET /clubs/:clubId/applications`
- `GET /clubs/:clubId/applications/:membershipId`
- `GET /clubs/:clubId/applications/current`
- `POST /clubs/:clubId/applications/:membershipId/review`
- `GET /clubs/:clubId/tournaments`

What is now stable:

- club application fields are scalar-or-null, not array-or-scalar unions
- club tournament participation has a dedicated contract instead of being reconstructed from unrelated public data

Important contract shapes:

### `ClubApplicationViewContract`

Used for inbox/detail/review flows.

Key fields:

- `applicationId`
- `clubId`
- `clubName`
- `applicant`
- `submittedAt`
- `message`
- `status`
- `reviewedBy`
- `reviewedByDisplayName`
- `reviewedAt`
- `reviewNote`
- `withdrawnByPrincipalId`
- `canReview`
- `canWithdraw`

### `ClubTournamentParticipationContract`

Used for club-facing tournament participation state.

Key fields:

- `clubId`
- `tournamentId`
- `name`
- `status`
- `clubParticipationStatus`
- `stageName`
- `startsAt`
- `endsAt`
- `canViewDetail`
- `canSubmitLineup`
- `canDecline`

Related backend lifecycle routes exist for accept/decline, but the current frontend API layer mainly consumes the participation list contract first and does not yet expose dedicated wrappers for every lifecycle action.

## 3. Tournament And Table Contracts

Defined in `front/src/api/contracts/operations.ts`.

Current exported contracts:

- `SeatWindContract`
- `TableSeatContract`
- `TournamentTableContract`
- `TournamentDirectoryEntryContract`
- `StageLineupSeatContract`
- `StageLineupSubmissionContract`
- `TournamentParticipantClubContract`
- `TournamentWhitelistSummaryContract`
- `TournamentStageDirectoryEntryContract`
- `TournamentDetailStageContract`
- `TournamentDetailContract`
- `TournamentMutationContract`
- `CreatedTournamentContract`

Main route families:

- `GET /tournaments`
- `GET /tournaments/:tournamentId`
- `GET /tournaments/:tournamentId/stages`
- `POST /tournaments/:tournamentId/publish`
- `POST /tournaments/:tournamentId/stages/:stageId/schedule`
- `POST /tournaments/:tournamentId/stages/:stageId/lineups`
- `POST /tournaments/:tournamentId/clubs/:clubId`
- `POST /tournaments`
- `GET /tables`
- `GET /tables/:tableId`
- `POST /tables/:tableId/start`
- `POST /tables/:tableId/reset`
- `POST /tables/:tableId/appeals`
- `POST /tables/:tableId/seats/:seat/state`
- `POST /tables/:tableId/ready`
- `GET /records`
- `GET /appeals`
- `POST /appeals/:appealId/adjudicate`
- `POST /appeals/:appealId/workflow`

### `TournamentDetailContract`

This is the stable read shape for tournament detail flows.

Key fields:

- `tournamentId`
- `name`
- `organizer`
- `status`
- `startsAt`
- `endsAt`
- `participatingClubs`
- `participatingPlayers`
- `whitelistSummary`
- `stages`

### `TournamentMutationContract`

This is the stable write-response shape for tournament mutation flows.

Shape:

```json
{
  "tournament": {},
  "scheduledTables": []
}
```

Use it for:

- publish
- stage scheduling
- club registration into tournament
- stage lineup submission

This is one of the most important corrections from the older docs: mutation routes are no longer documented as returning raw tournament aggregates.

### `TournamentStageDirectoryEntryContract`

Used for stage list and stage-picker style flows.

Key fields:

- `stageId`
- `name`
- `format`
- `order`
- `status`
- `currentRound`
- `roundCount`
- `schedulingPoolSize`
- `pendingTablePlanCount`
- `scheduledTableCount`

Current transport edge:

- `GET /tournaments/:id/stages` is still tolerated as either a raw array or `{ value?: array }`
- tournament mutation POST routes still use a narrow compatibility helper in `front/src/api/tournaments.transport.ts`
- several mutation payloads still use backend-specific option encoding such as `[]`

Those are transport cleanup targets, not reasons to redefine the contracts themselves.

## 4. Public Contracts

Defined in `front/src/api/contracts/public.ts`.

Current exported contracts:

- `PublicScheduleContract`
- `PublicTournamentStageContract`
- `PublicTournamentDetailContract`
- `PublicClubRelationContract`
- `PublicClubDirectoryEntryContract`
- `PublicClubHonorContract`
- `PublicClubLineupMemberContract`
- `PublicClubRecentMatchContract`
- `PublicClubApplicationPolicyContract`
- `PublicClubDetailContract`
- `LegacyDashboardOwnerPlayerContract`
- `LegacyDashboardOwnerClubContract`
- `DashboardOwnerContract`
- `DashboardContract`
- `RankSnapshotContract`
- `PlayerLeaderboardEntryContract`

Main route families:

- `GET /public/schedules`
- `GET /public/clubs`
- `GET /public/clubs/:clubId`
- `GET /public/tournaments/:tournamentId`
- `GET /public/leaderboards/players`
- `GET /dashboards/players/:playerId`
- `GET /dashboards/clubs/:clubId`

### `PublicTournamentDetailContract`

Key fields:

- `tournamentId`
- `name`
- `organizer`
- `status`
- `startsAt`
- `endsAt`
- `clubIds`
- `playerIds`
- `whitelistCount`
- `stages`

### `PublicClubDetailContract`

Key fields:

- `clubId`
- `name`
- `memberCount`
- `activeMemberCount`
- `adminCount`
- `powerRating`
- `totalPoints`
- `treasuryBalance`
- `pointPool`
- `relations`
- `honors`
- `applicationPolicy`
- `currentLineup`
- `recentMatches`

### `DashboardContract`

Current ownership shape is now narrow:

- `owner` is `DashboardOwnerContract`
- `DashboardOwnerContract` is a tagged string contract: ``player:${string}`` or ``club:${string}``

## 5. What Is Already Clean

These areas should now be treated as structurally settled:

- tournament mutation responses use `TournamentMutationContract`
- public hall no longer depends on a duplicate feature-local admin detail contract family
- club/application array-scalar compatibility has been removed from the contract layer
- club tournament participation has a dedicated contract

## 6. Known Legacy Edges Still Present

These are the remaining places where the transport boundary is not perfectly clean yet:

1. `front/src/api/backend-option.transport.ts`
   - still carries backend-specific `Option` array encoding
2. `front/src/api/tournaments.transport.ts`
   - still carries a narrow `operatorId` POST compatibility helper for mutation routes
3. `GET /tournaments/:id/stages`
   - still tolerates both a raw array and `{ value?: array }`
4. several transport builders
   - still intentionally emit `[]` for optional backend fields where the server contract has not been fully simplified

## 7. Usage Rule

When adding or changing frontend/backend integration:

- update `front/src/api/contracts/*` first if the transport shape changes
- keep mapper logic in API modules or dedicated mapper files
- avoid creating a new feature-local type if an existing contract already represents the transport shape
- if a route already returns a frontend-facing view, prefer adapting frontend mappers instead of inventing another intermediate contract
