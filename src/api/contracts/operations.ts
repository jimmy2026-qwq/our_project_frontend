import type { TableStatus } from '@/domain';

export type SeatWindContract = 'East' | 'South' | 'West' | 'North';

export interface TableSeatContract {
  seat: SeatWindContract;
  playerId: string;
  disconnected?: boolean;
  ready?: boolean;
}

export interface TournamentTableContract {
  id: string;
  tournamentId?: string;
  stageId: string;
  tableNo: number;
  status?: TableStatus;
  seats?: TableSeatContract[];
}

export interface TournamentDirectoryEntryContract {
  id: string;
  name: string;
}

export interface StageLineupSeatContract {
  playerId: string;
  preferredWind?: string | null;
  reserve?: boolean;
}

export interface StageLineupSubmissionContract {
  id: string;
  clubId: string;
  submittedBy: string;
  submittedAt: string;
  seats: StageLineupSeatContract[];
  note?: string | null;
}

export interface TournamentStageDirectoryEntryContract {
  stageId: string;
  name: string;
  format: string;
  order: number;
  status: string;
  currentRound: number;
  roundCount: number;
  schedulingPoolSize: number;
  pendingTablePlanCount: number;
  scheduledTableCount: number;
}

export interface TournamentDetailStageContract {
  id: string;
  name: string;
  status: string;
  roundCount?: number;
  pendingTablePlans?: unknown[];
  lineupSubmissions?: StageLineupSubmissionContract[];
}

export interface TournamentDetailContract {
  id: string;
  name: string;
  organizer: string;
  status: string;
  startsAt: string;
  endsAt: string;
  participatingClubs?: string[];
  participatingPlayers?: string[];
  whitelist?: unknown[];
  stages?: TournamentDetailStageContract[];
}

export interface CreatedTournamentContract {
  id: string;
  name: string;
  organizer: string;
  status?: string;
}
