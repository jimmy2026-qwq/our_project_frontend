import type { StageStatus, TournamentStatus } from '@/objects';

export interface PublicSchedule {
  tournamentId: string;
  tournamentName: string;
  tournamentStatus: TournamentStatus;
  stageId: string;
  stageName: string;
  stageStatus: StageStatus;
  scheduledAt: string;
  endsAt?: string;
  currentRound?: number;
  roundCount?: number;
  tableCount?: number;
  activeTableCount?: number;
  pendingTablePlanCount?: number;
  participantCount?: number;
  whitelistCount?: number;
  isUnpublished?: boolean;
}
