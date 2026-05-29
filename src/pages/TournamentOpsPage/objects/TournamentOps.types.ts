import type { ListEnvelope, TableStatus } from '@/objects';
import type { AppealSummary } from '@/pages/objects/TournamentViews';

export type DataSource = 'api' | 'mock';

export interface LoadState<T> {
  envelope: ListEnvelope<T>;
  source: DataSource;
  warning?: string;
}

export interface StageContext {
  id: string;
  name: string;
}

export interface TournamentContext {
  id: string;
  name: string;
  stages: StageContext[];
}

export interface TournamentDirectoryState {
  items: TournamentContext[];
  source: DataSource;
  warning?: string;
}

export interface TournamentOpsState {
  tournamentId: string;
  stageId: string;
  tableStatus: TableStatus | '';
  playerId: string;
  appealStatus: AppealSummary['status'] | '';
}

export const DEFAULT_TOURNAMENT_OPS_STATE: TournamentOpsState = {
  tournamentId: '',
  stageId: '',
  tableStatus: '',
  playerId: '',
  appealStatus: '',
};
