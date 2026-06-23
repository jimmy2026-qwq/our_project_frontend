import type { TableStatus } from '@/objects';
import type { AppealSummary } from '@/pages/shared_objects/tournament/AppealSummary';

export interface TournamentOpsState {
  tournamentId: string;
  stageId: string;
  tableStatus?: TableStatus;
  playerId: string;
  appealStatus?: AppealSummary['status'];
}

export const DEFAULT_TOURNAMENT_OPS_STATE: TournamentOpsState = {
  tournamentId: '',
  stageId: '',
  playerId: '',
};
