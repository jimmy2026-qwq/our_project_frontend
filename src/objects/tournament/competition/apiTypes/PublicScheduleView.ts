import type { StageStatus, TournamentStatus } from '@/objects/tournament';

export interface PublicScheduleView {
  tournamentId: string;
  tournamentName: string;
  tournamentStatus: TournamentStatus;
  stageId: string;
  stageName: string;
  stageStatus: StageStatus;
  currentRound: number;
  roundCount: number;
  startsAt: string;
  endsAt: string;
  tableCount: number;
  activeTableCount: number;
  pendingTablePlanCount: number;
  participantCount: number;
  whitelistCount: number;
}
