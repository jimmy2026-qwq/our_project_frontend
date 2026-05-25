import type { SeatWind } from './TournamentDomainTypes';

export interface TournamentMatchRecordSeatResultView {
  playerId: string;
  seat: SeatWind;
  clubId: string | null;
  finalPoints: number;
  placement: number;
  scoreDelta: number;
  uma: number;
  oka: number;
}

export interface TournamentMatchRecordView {
  recordId: string;
  tableId: string;
  tournamentId: string;
  stageId: string;
  stageRoundNumber: number;
  generatedAt: string;
  seatResults: TournamentMatchRecordSeatResultView[];
  paifuId: string | null;
  finalizedBy: string | null;
  sourceEvent: string;
  notes: string[];
}
