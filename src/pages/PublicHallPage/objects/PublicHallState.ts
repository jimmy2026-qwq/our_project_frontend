import type { PublicHallState } from './PublicHallPage.types';

export const DEFAULT_PUBLIC_HALL_STATE: PublicHallState = {
  activeView: 'schedules',
  scheduleTournamentStatus: 'InProgress',
  scheduleStageStatus: 'Active',
  leaderboardClubId: '',
  leaderboardStatus: 'Active',
  clubActiveOnly: true,
};

export const PUBLIC_HALL_CACHE_TTL_MS = 15_000;
