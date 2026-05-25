import type {
  TableStatus,
  TournamentParticipantKind,
  TournamentStatus,
} from './TournamentDomainTypes';
import type { TournamentSettlementStatus } from './SettlementResponses';

export interface TournamentListQuery {
  status?: TournamentStatus;
  adminId?: string;
  organizer?: string;
  limit?: number;
  offset?: number;
}

export interface TournamentWhitelistQuery {
  participantKind?: TournamentParticipantKind;
  playerId?: string;
  clubId?: string;
  limit?: number;
  offset?: number;
}

export interface TournamentSettlementQuery {
  stageId?: string;
  status?: TournamentSettlementStatus;
  championId?: string;
  limit?: number;
  offset?: number;
}

export interface StageTableQuery {
  status?: TableStatus;
  roundNumber?: number;
  playerId?: string;
  limit?: number;
  offset?: number;
}

export interface TableListQuery {
  status?: TableStatus;
  tournamentId?: string;
  stageId?: string;
  roundNumber?: number;
  playerId?: string;
  limit?: number;
  offset?: number;
}

export interface MatchRecordListQuery {
  tournamentId?: string;
  stageId?: string;
  tableId?: string;
  playerId?: string;
  limit?: number;
  offset?: number;
}

export interface PaifuListQuery {
  tournamentId?: string;
  stageId?: string;
  tableId?: string;
  playerId?: string;
  limit?: number;
  offset?: number;
}
