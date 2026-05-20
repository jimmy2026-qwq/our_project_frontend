import type { SeatWind } from './TournamentDomainTypes';

export interface TournamentPaifuFinalStandingView {
  playerId: string;
  seat: SeatWind;
  finalPoints: number;
  placement: number;
  uma: number;
  oka: number;
}

export interface TournamentPaifuSummaryView {
  paifuId: string;
  tableId: string;
  tournamentId: string;
  stageId: string;
  recordedAt: string;
  source: string;
  matchRecordId?: string | null;
  totalHands: number;
  playerIds: string[];
  finalStandings: TournamentPaifuFinalStandingView[];
}
