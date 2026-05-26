import type { StageStatus, TournamentStatus } from '@/objects/tournament';

export interface ScheduleQuery {
  tournamentStatus?: TournamentStatus;
  stageStatus?: StageStatus;
  limit?: number;
  offset?: number;
}
