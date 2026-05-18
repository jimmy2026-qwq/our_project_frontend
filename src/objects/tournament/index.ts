import type { TableStatus } from '../shared/common';

export type SeatWind = 'East' | 'South' | 'West' | 'North';
export type TournamentFormat = 'Swiss' | 'Knockout';

export interface CreateTournamentPayload {
  name: string;
  organizer: string;
  startsAt: string;
  endsAt: string;
  adminId?: string;
  stage: {
    name: string;
    format: TournamentFormat;
    order?: number;
    roundCount: number;
    schedulingPoolSize?: number;
  };
}

export interface SubmitStageLineupPayload {
  clubId: string;
  operatorId: string;
  playerIds: string[];
  note?: string;
}

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
  disconnected: boolean;
  ready: boolean;
}

export interface TableDetail {
  id: string;
  tournamentId: string;
  stageId: string;
  tableNo: number;
  status: TableStatus;
  seats: TableSeatState[];
}

export interface MatchRecordSummary {
  id: string;
  tournamentId: string;
  stageId: string;
  tableId: string;
  recordedAt: string;
  winnerId: string;
  summary: string;
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

export interface PaifuFinalStanding {
  playerId: string;
  seat: SeatWind;
  finalPoints: number;
  placement: number;
  uma?: number;
  oka?: number;
}

export interface PaifuRoundSummary {
  descriptor: {
    roundWind: SeatWind;
    handNumber: number;
    honba: number;
  };
  actions: Array<{
    sequenceNo: number;
    actor?: string;
    actionType: string;
    tile?: string;
  }>;
  result: {
    outcome: string;
    winner?: string;
    target?: string;
    han?: number;
    fu?: number;
    points: number;
  };
}

export interface TablePaifuDetail {
  id: string;
  metadata: {
    tableId: string;
    tournamentId: string;
    stageId: string;
    recordedAt: string;
  };
  rounds: PaifuRoundSummary[];
  finalStandings: PaifuFinalStanding[];
}
