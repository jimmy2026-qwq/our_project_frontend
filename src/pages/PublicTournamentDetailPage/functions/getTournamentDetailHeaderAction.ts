import { TableStatus } from '@/objects';

import type { TournamentPublicProfile } from '@/pages/shared_objects/tournament/TournamentPublicProfile';
import type { TournamentDetailTableItem } from '@/pages/PublicTournamentDetailPage/objects/table/TournamentDetailTableItem';
import type { TournamentDetailWorkbenchState } from '@/pages/PublicTournamentDetailPage/objects/state/workbench/TournamentDetailWorkbenchState';
import { isTournamentStageCompleted } from './getTournamentDetailStageProgress';

type TournamentStageView = NonNullable<
  TournamentPublicProfile['stages']
>[number];

export function getTournamentDetailHeaderAction({
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
      if (isTournamentStageCompleted(stage)) {
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
          ? stageTables.filter((table) => table.status === TableStatus.Archived).length
          : (stage.archivedTableCount ?? 0);

      return (
        scheduledTableCount > 0 &&
        archivedTableCount >= scheduledTableCount &&
        (stage.pendingTablePlanCount ?? 0) === 0
      );
    }) ?? null;
  const finalStage = orderedStages[orderedStages.length - 1] ?? null;
  const allStagesCompleted =
    orderedStages.length > 0 && orderedStages.every(isTournamentStageCompleted);
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
