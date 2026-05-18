import type { TableStatus } from '@/objects';

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
  submissionId: string;
  clubId: string;
  clubName?: string;
  submittedBy: string;
  submittedByDisplayName?: string | null;
  submittedAt: string;
  activePlayerIds: string[];
  reservePlayerIds: string[];
  note?: string | null;
}

export interface TournamentParticipantClubContract {
  clubId: string;
  clubName: string;
  memberCount: number;
  activeMemberCount: number;
}

export interface TournamentWhitelistSummaryContract {
  totalEntries: number;
  clubCount: number;
  playerCount: number;
  clubIds: string[];
  playerIds: string[];
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
  stageId: string;
  name: string;
  status: string;
  format?: string;
  order?: number;
  currentRound?: number;
  roundCount?: number;
  schedulingPoolSize?: number;
  pendingTablePlanCount?: number;
  scheduledTableCount?: number;
  lineupSubmissions?: StageLineupSubmissionContract[];
}

export interface TournamentDetailContract {
  tournamentId: string;
  name: string;
  organizer: string;
  status: string;
  startsAt: string;
  endsAt: string;
  participatingClubs?: TournamentParticipantClubContract[];
  participatingPlayers?: Array<{ playerId: string }>;
  whitelistSummary?: TournamentWhitelistSummaryContract;
  stages?: TournamentDetailStageContract[];
}

export interface TournamentMutationContract {
  tournament: TournamentDetailContract;
  scheduledTables: TournamentTableContract[];
}

export interface CreatedTournamentContract {
  id: string;
  name: string;
  organizer: string;
  status?: string;
}
