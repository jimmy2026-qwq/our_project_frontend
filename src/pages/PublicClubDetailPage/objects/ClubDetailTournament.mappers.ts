import type {
  PublicTournamentDetailView,
  PublicTournamentStageView,
  StageStatus,
} from '@/objects';
import { DEFAULT_MAHJONG_RULESET } from '@/objects';

import type { TournamentPublicProfile } from './PublicClubDetailPage.types';

function toStageStatus(
  status: PublicTournamentStageView['status'],
): StageStatus {
  return status;
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
    })),
  };
}
