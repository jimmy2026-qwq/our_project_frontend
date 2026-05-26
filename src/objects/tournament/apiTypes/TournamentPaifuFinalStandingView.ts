import type { SeatWind } from '../SeatWind';

export interface TournamentPaifuFinalStandingView {
  playerId: string;
  seat: SeatWind;
  finalPoints: number;
  placement: number;
  uma: number;
  oka: number;
}
