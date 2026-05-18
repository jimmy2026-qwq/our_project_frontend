import type { SeatWind, TournamentFormat } from './index';

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

export interface StartTablePayload {
  operatorId?: string;
}

export interface ResetTablePayload {
  operatorId: string;
  note: string;
}

export interface FileAppealPayload {
  playerId: string;
  description: string;
}

export interface UpdateSeatStatePayload {
  operatorId: string;
  seat: SeatWind;
  ready?: boolean;
  disconnected?: boolean;
  note?: string;
}

export interface UpdateOwnReadyStatePayload {
  operatorId: string;
  ready?: boolean;
  note?: string;
}
