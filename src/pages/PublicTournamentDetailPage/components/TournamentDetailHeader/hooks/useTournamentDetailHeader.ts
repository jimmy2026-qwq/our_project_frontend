import type { TournamentDetailWorkbenchState } from '../../../objects/TournamentDetail.types';

export function useTournamentDetailHeader({
  workbench,
  onCompleteStage,
  onScheduleStage,
  onSettleTournament,
}: {
  workbench: TournamentDetailWorkbenchState | null;
  onCompleteStage: () => Promise<void> | void;
  onScheduleStage: () => Promise<void> | void;
  onSettleTournament: () => Promise<void> | void;
}) {
  const handleRunHeaderStageAction = () => {
    if (!workbench?.headerStageAction) {
      return;
    }

    if (workbench.headerStageAction.kind === 'completeStage') {
      void onCompleteStage();
      return;
    }

    if (workbench.headerStageAction.kind === 'settleTournament') {
      void onSettleTournament();
      return;
    }

    void onScheduleStage();
  };

  return {
    handleRunHeaderStageAction,
  };
}
