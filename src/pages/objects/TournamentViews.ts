import type { TableStatus } from '@/objects';
import type { SeatWind } from '@/objects/tournament';

export interface TournamentTableSummary {
  id: string;
  tournamentId: string;
  stageId: string;
  tableCode: string;
  status: TableStatus;
  playerIds: string[];
  seatCount: number;
}

export interface TableSeatState {
  seat: SeatWind;
  playerId: string;
  initialPoints: number;
  disconnected: boolean;
  ready: boolean;
  clubId?: string | null;
}

export interface TableDetail {
  id: string;
  tournamentId: string;
  stageId: string;
  tableNo: number;
  status: TableStatus;
  seats: TableSeatState[];
}

export interface MatchRecordSeatResultSummary {
  playerId: string;
  placement: number;
  finalPoints?: number;
  scoreDelta?: number;
}

export interface MatchRecordSummary {
  id: string;
  tournamentId: string;
  tournamentName?: string;
  stageId: string;
  stageName?: string;
  tableId: string;
  recordedAt: string;
  winnerId: string;
  summary: string;
  seatResults?: MatchRecordSeatResultSummary[];
}

export interface AppealSummary {
  id: string;
  tournamentId: string;
  stageId: string;
  tableId: string;
  status: 'Open' | 'UnderReview' | 'Resolved' | 'Rejected' | 'Escalated';
  openedBy: string;
  createdBy?: string;
  description: string;
  attachments?: string[];
  priority?: string | null;
  assigneeId?: string | null;
  dueAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  resolution?: string | null;
  verdict?: string | null;
  reopenCount?: number;
}
