import { DEFAULT_MAHJONG_RULESET } from '@/objects';
import type {
  PublicTournamentDetailView,
  PublicTournamentStageView,
  StageStatus,
  TournamentSummaryView,
} from '@/objects';
import type { TournamentDetailView } from '@/objects/tournament';

import type { TournamentPublicProfile } from './PublicTournamentDetailPage.types';

interface TournamentDirectoryEntryView {
  id: string;
  name: string;
}

function toStageStatus(
  status: PublicTournamentStageView['status'],
): StageStatus {
  return status;
}

function toAdminStageStatus(status?: string): StageStatus {
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

function toTournamentWhitelistType(
  item: PublicTournamentDetailView,
): TournamentPublicProfile['whitelistType'] {
  const hasClubParticipants = item.clubIds.length > 0;
  const hasDirectPlayers = item.playerIds.length > 0;

  if (hasClubParticipants && hasDirectPlayers) {
    return 'Mixed';
  }

  if (hasClubParticipants) {
    return 'Club';
  }

  return 'Player';
}

export function toTournamentDirectoryEntry(
  item: TournamentDirectoryEntryView | TournamentSummaryView,
): TournamentDirectoryEntryView {
  return {
    id: 'id' in item ? item.id : item.tournamentId,
    name: item.name,
  };
}

export function toPublicTournamentDetail(
  item: PublicTournamentDetailView,
): TournamentPublicProfile {
  const stages = [...item.stages].sort(
    (left, right) => (left.order ?? 0) - (right.order ?? 0),
  );
  const nextStage =
    stages.find(
      (stage) => stage.status !== 'Completed' && stage.status !== 'Archived',
    ) ?? stages[stages.length - 1];

  return {
    id: item.tournamentId,
    name: item.name,
    organizer: item.organizer,
    status: item.status,
    tagline: `Organizer: ${item.organizer}`,
    description: `Public tournament detail includes ${stages.length} stage(s), ${item.playerIds.length} player slot(s), and ${item.whitelistCount} whitelist entry/entries.`,
    venue: item.organizer,
    startsAt: item.startsAt,
    endsAt: item.endsAt,
    stageCount: stages.length,
    whitelistType: toTournamentWhitelistType(item),
    clubIds: item.clubIds,
    playerIds: item.playerIds,
    clubCount: item.clubIds.length,
    playerCount: item.playerIds.length,
    whitelistCount: item.whitelistCount,
    nextStageId: nextStage?.stageId ?? '',
    nextStageName: nextStage?.name ?? 'No stages available',
    nextStageStatus: nextStage ? toStageStatus(nextStage.status) : 'Pending',
    nextScheduledAt: item.startsAt,
    stages: stages.map((stage) => ({
      stageId: stage.stageId,
      name: stage.name,
      status: toStageStatus(stage.status),
      roundCount: stage.roundCount,
      schedulingPoolSize: stage.schedulingPoolSize,
      tableCount: stage.tableCount,
      pendingTablePlanCount: stage.pendingTablePlanCount,
      format: stage.format,
      order: stage.order,
      currentRound: stage.currentRound,
      archivedTableCount: stage.archivedTableCount,
      standings: stage.standings ?? null,
      bracket: stage.bracket ?? null,
      advancementRule: stage.advancementRule,
      swissRule: stage.swissRule ?? null,
      knockoutRule: stage.knockoutRule ?? null,
      mahjongRuleset: stage.mahjongRuleset ?? DEFAULT_MAHJONG_RULESET,
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

export function toTournamentDetailFromAdminView(
  item: TournamentDetailView,
): TournamentPublicProfile {
  const stages = [...(item.stages ?? [])].sort(
    (left, right) => (left.order ?? 0) - (right.order ?? 0),
  );
  const nextStage =
    stages.find(
      (stage) => stage.status !== 'Completed' && stage.status !== 'Archived',
    ) ?? stages[stages.length - 1];
  const participatingClubIds =
    item.participatingClubs?.map((club) => club.clubId) ?? [];
  const participatingPlayerCount = item.participatingPlayers?.length ?? 0;
  const participatingPlayerIds =
    item.participatingPlayers?.map((player) => player.playerId) ?? [];
  const whitelistSummary = item.whitelistSummary;
  const visibleClubIds = Array.from(
    new Set([...participatingClubIds, ...(whitelistSummary?.clubIds ?? [])]),
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
    nextStageStatus: toAdminStageStatus(nextStage?.status),
    nextScheduledAt: item.startsAt,
    stages: stages.map((stage) => ({
      stageId: stage.stageId,
      name: stage.name,
      status: toAdminStageStatus(stage.status),
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
      mahjongRuleset: stage.mahjongRuleset ?? DEFAULT_MAHJONG_RULESET,
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
