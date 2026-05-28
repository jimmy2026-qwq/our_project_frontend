import type { TournamentDetailWorkbenchState } from '../../../objects/TournamentDetail.types';

import { useTournamentAppealRuntime } from '../components/TournamentDetailAppealsTab/hooks/useTournamentAppealRuntime';
import { useTournamentRuntimeTabs } from './useTournamentRuntimeTabs';
import { useTournamentTableRuntime } from '../components/TournamentDetailTableTabs/hooks/useTournamentTableRuntime';

export function useTournamentDetailContent({
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
