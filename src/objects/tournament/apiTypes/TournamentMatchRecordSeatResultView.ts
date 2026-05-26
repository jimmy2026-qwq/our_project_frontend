import type { SeatWind } from '../SeatWind';

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

