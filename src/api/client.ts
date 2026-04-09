import { authApi } from './auth';
import { clubsApi } from './clubs';
import { operationsApi } from './operations';
import { publicApi } from './public';

export type {
  ClubApplicationListFilters,
  ClubApplicationPayload,
  ClubFilters,
  ReviewClubApplicationPayload,
  WithdrawClubApplicationPayload,
} from './clubs';
export { ApiError } from './http';
export type { AppealFilters, RecordFilters, TableFilters } from './operations';
export type {
  PlayerLeaderboardFilters,
  ScheduleFilters,
} from './public';
export type {
  CreateGuestSessionPayload,
  CreatePlayerPayload,
  DemoSummaryQuery,
  SessionQuery,
} from './auth';
export type {
  ApiMessagePayloadContract,
  AuthSessionContract,
  AuthSuccessContract,
  CreatedPlayerContract,
} from './contracts/auth';
export type { ClubApplicationMutationResponseContract } from './contracts/clubs';
export type {
  PlayerLeaderboardEntryContract,
  RankSnapshotContract,
} from './contracts/public';
export type { TournamentDetailContract } from './contracts/operations';

export const apiClient = {
  ...authApi,
  ...publicApi,
  ...clubsApi,
  ...operationsApi,
};
