import type { TournamentDetailWorkbenchState } from '../../../objects/tournament-detail.types';

import { useTournamentAppealRuntime } from './TournamentAppealRuntime.hooks';
import { useTournamentRuntimeTabs } from './TournamentRuntimeTabs.hooks';
import { useTournamentTableRuntime } from './TournamentTableRuntime.hooks';

export function useTournamentDetailRuntime({
  operatorId,
  workbench,
  onScheduleSuccess,
}: {
  operatorId: string;
  workbench: TournamentDetailWorkbenchState | null;
  onScheduleSuccess?: () => void;
}) {
  const tabs = useTournamentRuntimeTabs({ operatorId, workbench });
  const tables = useTournamentTableRuntime({
    operatorId,
    workbench,
    onScheduleSuccess,
  });
  const appeals = useTournamentAppealRuntime({ operatorId, workbench });

  return {
    ...tabs,
    ...tables,
    ...appeals,
  };
}
