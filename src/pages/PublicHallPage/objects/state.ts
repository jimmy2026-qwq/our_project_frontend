import type { StageStatus } from '@/objects';
import type { PlayerStatus } from '@/objects/player';

import type {
  PlayerLeaderboardEntry,
  PublicHallLeaderboardStatus,
  PublicHallRankSnapshot,
  PublicHallState,
} from './types';

export const DEFAULT_PUBLIC_HALL_STATE: PublicHallState = {
  activeView: 'schedules',
  scheduleTournamentStatus: 'InProgress',
  scheduleStageStatus: 'Active',
  leaderboardClubId: '',
  leaderboardStatus: 'Active',
  clubActiveOnly: true,
};

export const PUBLIC_HALL_CACHE_TTL_MS = 15_000;

export function mapLeaderboardStatus(
  status: PublicHallLeaderboardStatus,
): PlayerLeaderboardEntry['status'] {
  return status === 'Suspended' ? 'Inactive' : status;
}

export function mapLeaderboardStatusFilter(
  status: PublicHallState['leaderboardStatus'],
): PlayerStatus | undefined {
  if (!status) {
    return undefined;
  }

  return status === 'Inactive' ? 'Suspended' : status;
}

export function formatRankLabel(rank?: PublicHallRankSnapshot | null) {
  if (!rank) {
    return null;
  }

  return rank.stars
    ? `${rank.platform} ${rank.tier} ${rank.stars}`
    : `${rank.platform} ${rank.tier}`;
}

export function mapAdminStageStatus(status?: string): StageStatus {
  if (status === 'Ready') {
    return 'Ready';
  }

  if (status === 'Active') {
    return 'Active';
  }

  if (status === 'Completed') {
    return 'Completed';
  }

  if (status === 'Archived') {
    return 'Archived';
  }

  return 'Pending';
}
