import type { StageStatus } from './lifecycle/StageStatus';
import type { TournamentFormat } from '../competition/TournamentFormat';

export interface TournamentStageDirectoryEntry {
  stageId: string;
  name: string;
  format: TournamentFormat;
  order: number;
  status: StageStatus;
  currentRound: number;
  roundCount: number;
  schedulingPoolSize: number;
  pendingTablePlanCount: number;
  scheduledTableCount: number;
}
