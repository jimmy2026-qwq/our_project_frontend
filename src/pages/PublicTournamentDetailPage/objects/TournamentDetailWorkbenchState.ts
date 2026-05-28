import type { AuthSession } from '@/providers/auth/AuthSession';
import type { ClubSummary } from '@/pages/objects/club';
import type { PlayerProfile } from '@/pages/objects/player';
import type { TournamentPublicProfile } from './PublicTournamentDetailPage.types';

import type {
  TournamentDetailTableItem,
  TournamentDetailWorkbenchState,
} from './TournamentDetail.types';
import type { TournamentStageRuleDraft } from './TournamentDetail.rules';
import {
  getNextStageLineupSubmissionCounts,
  getNextStageMissingLineupClubNames,
  getTableSortWeight,
} from './TournamentDetail.workbench';

type TournamentStageView = NonNullable<TournamentPublicProfile['stages']>[number];

interface BuildTournamentDetailWorkbenchParams {
  availableClubs: ClubSummary[];
  availablePlayers: PlayerProfile[];
  invitedClubs: ClubSummary[];
  isSubmittingTournamentAction: boolean;
  operatorId?: string;
  participantPlayers: PlayerProfile[];
  playerNames: Record<string, string>;
  profile: TournamentPublicProfile | null;
  publishBlockedOpen: boolean;
  ruleDraft: TournamentStageRuleDraft;
  rulesDialogOpen: boolean;
  selectedClubId: string;
  selectedPlayerId: string;
  session: AuthSession | null;
  showMoreInfo: boolean;
  tables: TournamentDetailTableItem[];
  tournamentActionError: string;
}

function isStageCompleted(stage: TournamentStageView) {
  return stage.status === 'Completed' || stage.status === 'Archived';
}

function getHeaderStageAction({
  canManageTournament,
  canScheduleStage,
  isTournamentClosed,
  nextStage,
  orderedStages,
  tables,
}: {
  canManageTournament: boolean;
  canScheduleStage: boolean;
  isTournamentClosed: boolean;
  nextStage: TournamentStageView | null;
  orderedStages: TournamentStageView[];
  tables: TournamentDetailTableItem[];
}): TournamentDetailWorkbenchState['headerStageAction'] {
  const completableStage =
    orderedStages.find((stage) => {
      if (isStageCompleted(stage)) {
        return false;
      }

      const stageTables = tables.filter(
        (table) => table.stageId === stage.stageId,
      );
      const scheduledTableCount = Math.max(
        stage.tableCount ?? 0,
        stageTables.length,
      );
      const archivedTableCount =
        stageTables.length > 0
          ? stageTables.filter((table) => table.status === 'Archived').length
          : stage.archivedTableCount ?? 0;

      return (
        scheduledTableCount > 0 &&
        archivedTableCount >= scheduledTableCount &&
        (stage.pendingTablePlanCount ?? 0) === 0
      );
    }) ?? null;
  const finalStage = orderedStages[orderedStages.length - 1] ?? null;
  const allStagesCompleted =
    orderedStages.length > 0 && orderedStages.every(isStageCompleted);
  const canSettleTournament =
    canManageTournament &&
    !!finalStage &&
    allStagesCompleted &&
    !isTournamentClosed;

  if (canScheduleStage && nextStage) {
    return {
      kind: 'scheduleStage',
      label: '赛段排桌',
      stageId: nextStage.stageId,
    };
  }

  if (completableStage && canManageTournament && !isTournamentClosed) {
    return {
      kind: 'completeStage',
      label: '结束赛段',
      stageId: completableStage.stageId,
    };
  }

  if (canSettleTournament && finalStage) {
    return {
      kind: 'settleTournament',
      label: '赛事结算',
      stageId: finalStage.stageId,
    };
  }

  return null;
}

function getVisibleTables({
  canManageTournament,
  operatorId,
  tables,
}: {
  canManageTournament: boolean;
  operatorId?: string;
  tables: TournamentDetailTableItem[];
}) {
  return [
    ...(canManageTournament
      ? tables
      : tables.filter(
          (table) =>
            (table.status === 'WaitingPreparation' &&
              !!operatorId &&
              table.playerIds.includes(operatorId)) ||
            table.status === 'InProgress' ||
            table.status === 'Scoring' ||
            table.status === 'AppealInProgress' ||
            table.status === 'Archived',
        )),
  ].sort((left, right) => {
    const leftIsOwnWaitingTable =
      !canManageTournament &&
      !!operatorId &&
      left.status === 'WaitingPreparation' &&
      left.playerIds.includes(operatorId);
    const rightIsOwnWaitingTable =
      !canManageTournament &&
      !!operatorId &&
      right.status === 'WaitingPreparation' &&
      right.playerIds.includes(operatorId);

    if (leftIsOwnWaitingTable !== rightIsOwnWaitingTable) {
      return leftIsOwnWaitingTable ? -1 : 1;
    }

    const weightDelta =
      getTableSortWeight(left.status) - getTableSortWeight(right.status);

    if (weightDelta !== 0) {
      return weightDelta;
    }

    return left.tableCode.localeCompare(right.tableCode, 'zh-CN');
  });
}

export function buildTournamentDetailWorkbench({
  availableClubs,
  availablePlayers,
  invitedClubs,
  isSubmittingTournamentAction,
  operatorId,
  participantPlayers,
  playerNames,
  profile,
  publishBlockedOpen,
  ruleDraft,
  rulesDialogOpen,
  selectedClubId,
  selectedPlayerId,
  session,
  showMoreInfo,
  tables,
  tournamentActionError,
}: BuildTournamentDetailWorkbenchParams): TournamentDetailWorkbenchState | null {
  if (!profile) {
    return null;
  }

  const canManageTournament =
    !!session?.user.roles.isRegisteredPlayer &&
    (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);
  const canPublishTournament = canManageTournament && profile.status === 'Draft';
  const missingLineupClubNames = getNextStageMissingLineupClubNames(
    profile,
    [...invitedClubs, ...availableClubs],
  );
  const lineupSubmissionCounts = getNextStageLineupSubmissionCounts(profile);
  const submittedLineupClubIds = Object.keys(lineupSubmissionCounts);
  const orderedStages = [...(profile.stages ?? [])].sort(
    (left, right) => (left.order ?? 0) - (right.order ?? 0),
  );
  const isTournamentClosed =
    profile.status === 'Completed' || profile.status === 'Archived';
  const declaredNextStage = orderedStages.find(
    (stage) => stage.stageId === profile.nextStageId,
  );
  const nextStage =
    declaredNextStage && !isStageCompleted(declaredNextStage)
      ? declaredNextStage
      : orderedStages.find((stage) => !isStageCompleted(stage)) ?? null;
  const nextStageTables = nextStage
    ? tables.filter((table) => table.stageId === nextStage.stageId)
    : [];
  const isWaitingForLineups =
    canManageTournament &&
    !!profile.nextStageId &&
    (profile.status === 'RegistrationOpen' || profile.status === 'InProgress') &&
    missingLineupClubNames.length > 0;
  const canScheduleStage =
    canManageTournament &&
    !!nextStage &&
    !isTournamentClosed &&
    (profile.status === 'RegistrationOpen' ||
      profile.status === 'Scheduled' ||
      profile.status === 'InProgress') &&
    missingLineupClubNames.length === 0 &&
    !isStageCompleted(nextStage) &&
    nextStageTables.length === 0 &&
    (nextStage.tableCount ?? 0) === 0;
  const headerStageAction = getHeaderStageAction({
    canManageTournament,
    canScheduleStage,
    isTournamentClosed,
    nextStage,
    orderedStages,
    tables,
  });
  const invitedClubIds = profile.clubIds ?? [];
  const selectableClubs = availableClubs.filter(
    (club) => !invitedClubIds.includes(club.id),
  );
  const participantPlayerIds = new Set(
    participantPlayers.map((player) => player.playerId),
  );
  const selectablePlayers = availablePlayers.filter(
    (player) => !participantPlayerIds.has(player.playerId),
  );
  const visibleTables = getVisibleTables({
    canManageTournament,
    operatorId,
    tables,
  });

  return {
    profile,
    selectedClubId,
    isSubmittingTournamentAction,
    tournamentActionError,
    publishBlockedOpen,
    rulesDialogOpen,
    ruleDraft,
    playerNames,
    showMoreInfo,
    canManageTournament,
    canPublishTournament,
    canScheduleStage,
    headerStageAction,
    isWaitingForLineups,
    missingLineupClubNames,
    submittedLineupClubIds,
    lineupSubmissionCounts,
    invitedClubs,
    selectableClubs,
    participantPlayers,
    selectablePlayers,
    selectedPlayerId,
    visibleTables,
  };
}
