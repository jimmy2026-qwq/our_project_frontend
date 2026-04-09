import type {
  PlayerLeaderboardEntry,
  TournamentPublicProfile,
} from '@/domain/public';
import type {
  PublicHallLeaderboardStatus,
  PublicHallRankSnapshot,
  PublicHallState,
  PublicHallTournamentAdminDetail,
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

export function formatRankLabel(rank?: PublicHallRankSnapshot | null) {
  if (!rank) {
    return null;
  }

  return rank.stars ? `${rank.platform} ${rank.tier} ${rank.stars}` : `${rank.platform} ${rank.tier}`;
}

export function mapAdminStageStatus(status?: string): TournamentPublicProfile['nextStageStatus'] {
  if (status === 'Active') {
    return 'Active';
  }

  if (status === 'Completed') {
    return 'Completed';
  }

  return 'Pending';
}

export function mapTournamentDetailFromAdminView(item: PublicHallTournamentAdminDetail): TournamentPublicProfile {
  const stages = item.stages ?? [];
  const nextStage = stages[0];

  return {
    id: item.id,
    name: item.name,
    status: (item.status as TournamentPublicProfile['status']) ?? 'Draft',
    tagline: `Organizer: ${item.organizer}`,
    description: `Draft tournament detail loaded from the admin endpoint with ${stages.length} stage(s).`,
    venue: item.organizer,
    stageCount: stages.length,
    whitelistType:
      item.participatingClubs?.length && item.participatingPlayers?.length
        ? 'Mixed'
        : item.participatingClubs?.length
          ? 'Club'
          : 'Player',
    clubIds: item.participatingClubs ?? [],
    clubCount: item.participatingClubs?.length ?? 0,
    playerCount: item.participatingPlayers?.length ?? 0,
    whitelistCount: item.whitelist?.length ?? 0,
    nextStageId: nextStage?.id ?? '',
    nextStageName: nextStage?.name ?? 'No stages available',
    nextStageStatus: mapAdminStageStatus(nextStage?.status),
    nextScheduledAt: item.startsAt,
    stages: stages.map((stage) => ({
      stageId: stage.id,
      name: stage.name,
      status: mapAdminStageStatus(stage.status),
      roundCount: stage.roundCount ?? 0,
      tableCount: 0,
      pendingTablePlanCount: stage.pendingTablePlans?.length ?? 0,
    })),
  };
}
