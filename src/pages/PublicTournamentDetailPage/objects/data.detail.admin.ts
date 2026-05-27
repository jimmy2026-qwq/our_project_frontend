import type { StageStatus } from '@/objects';
import type { TournamentDetailView } from '@/objects/tournament';

import type { TournamentPublicProfile } from './types';

function mapAdminStageStatus(status?: string): StageStatus {
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

export function mapTournamentDetailFromAdminView(
  item: TournamentDetailView,
): TournamentPublicProfile {
  const stages = [...(item.stages ?? [])].sort(
    (left, right) => (left.order ?? 0) - (right.order ?? 0),
  );
  const nextStage =
    stages.find(
      (stage) =>
        stage.status !== 'Completed' &&
        stage.status !== 'Archived',
    ) ?? stages[stages.length - 1];
  const participatingClubIds =
    item.participatingClubs?.map((club) => club.clubId) ?? [];
  const participatingPlayerCount = item.participatingPlayers?.length ?? 0;
  const participatingPlayerIds =
    item.participatingPlayers?.map((player) => player.playerId) ?? [];
  const whitelistSummary = item.whitelistSummary;
  const visibleClubIds = Array.from(
    new Set([
      ...participatingClubIds,
      ...(whitelistSummary?.clubIds ?? []),
    ]),
  );

  return {
    id: item.tournamentId,
    name: item.name,
    status: (item.status as TournamentPublicProfile['status']) ?? 'Draft',
    tagline: `Organizer: ${item.organizer}`,
    description: `Draft tournament detail loaded from the admin endpoint with ${stages.length} stage(s).`,
    venue: item.organizer,
    stageCount: stages.length,
    whitelistType:
      visibleClubIds.length && participatingPlayerCount
        ? 'Mixed'
        : visibleClubIds.length
          ? 'Club'
          : 'Player',
    clubIds: visibleClubIds,
    playerIds: participatingPlayerIds,
    clubCount: visibleClubIds.length,
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
      format: stage.format,
      order: stage.order,
      currentRound: stage.currentRound,
      archivedTableCount: 0,
      advancementRule: stage.advancementRule,
      swissRule: stage.swissRule ?? null,
      knockoutRule: stage.knockoutRule ?? null,
      lineupSubmissions: stage.lineupSubmissions?.map((submission) => ({
        submissionId: submission.submissionId,
        clubId: submission.clubId,
        submittedBy: submission.submittedBy,
        submittedAt: submission.submittedAt,
        activePlayerIds: submission.activePlayerIds ?? [],
        reservePlayerIds: submission.reservePlayerIds ?? [],
        note: submission.note ?? null,
      })),
    })),
  };
}
