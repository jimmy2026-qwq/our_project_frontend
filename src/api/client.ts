import { authApi } from './auth';
import { clubsApi } from './clubs';
import { operationsApi } from './operations';
import { publicApi } from './public';

export type { ApiMessagePayload, BackendAuthPayload } from './auth';
export type {
  ClubApplicationListFilters,
  ClubApplicationPayload,
  ClubFilters,
  RawClubApplicationMutationResponse,
  ReviewClubApplicationPayload,
  WithdrawClubApplicationPayload,
} from './clubs';
export { ApiError } from './http';
export type { AppealFilters, RecordFilters, TableFilters } from './operations';
export type {
  RawPlayerLeaderboardEntry,
  RawRankSnapshot,
  PlayerLeaderboardFilters,
  ScheduleFilters,
} from './public';
export type {
  CreateGuestSessionPayload,
  CreatePlayerPayload,
  CreatedPlayer,
  DemoSummaryQuery,
  SessionQuery,
} from './auth';

export const apiClient = {
  ...authApi,
  ...publicApi,
  ...clubsApi,
  ...operationsApi,
};
