import type {
  PlayerLeaderboardEntry,
  TournamentPublicProfile,
} from '@/objects/publicquery';
import type { TournamentDetailContract } from '@/api/tournament/responses/tournament.responses';
import type {
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

export function mapTournamentDetailFromAdminView(item: TournamentDetailContract): TournamentPublicProfile {
  const stages = item.stages ?? [];
  const nextStage = stages[0];
  const participatingClubIds = item.participatingClubs?.map((club) => club.clubId) ?? [];
  const participatingPlayerCount = item.participatingPlayers?.length ?? 0;
  const whitelistSummary = item.whitelistSummary;

  return {
    id: item.tournamentId,
    name: item.name,
    status: (item.status as TournamentPublicProfile['status']) ?? 'Draft',
    tagline: `Organizer: ${item.organizer}`,
    description: `Draft tournament detail loaded from the admin endpoint with ${stages.length} stage(s).`,
    venue: item.organizer,
    stageCount: stages.length,
    whitelistType:
      participatingClubIds.length && participatingPlayerCount
        ? 'Mixed'
        : participatingClubIds.length
          ? 'Club'
          : 'Player',
    clubIds: participatingClubIds,
    clubCount: participatingClubIds.length,
    playerCount: participatingPlayerCount,
    whitelistCount: whitelistSummary?.totalEntries ?? 0,
    nextStageId: nextStage?.stageId ?? '',
    nextStageName: nextStage?.name ?? 'No stages available',
    nextStageStatus: mapAdminStageStatus(nextStage?.status),
    nextScheduledAt: item.startsAt,
    stages: stages.map((stage) => ({
      stageId: stage.stageId,
      name: stage.name,
      status: mapAdminStageStatus(stage.status),
      roundCount: stage.roundCount ?? 0,
      tableCount: stage.scheduledTableCount ?? 0,
      pendingTablePlanCount: stage.pendingTablePlanCount ?? 0,
      lineupSubmissions: stage.lineupSubmissions?.map((submission) => ({
        submissionId: submission.submissionId,
        clubId: submission.clubId,
        clubName: submission.clubName,
        submittedBy: submission.submittedBy,
        submittedByDisplayName: submission.submittedByDisplayName ?? null,
        submittedAt: submission.submittedAt,
        activePlayerIds: submission.activePlayerIds ?? [],
        reservePlayerIds: submission.reservePlayerIds ?? [],
        note: submission.note ?? null,
      })),
    })),
  };
}
