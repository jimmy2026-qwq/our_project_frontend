import type { SeatWind } from '../SeatWind';

export interface TournamentTableSeatView {
  seat: SeatWind;
  playerId: string;
  initialPoints: number;
  disconnected: boolean;
  ready: boolean;
  clubId: string | null;
}

