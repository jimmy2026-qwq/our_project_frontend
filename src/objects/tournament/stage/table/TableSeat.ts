import type { SeatWind } from './SeatWind';

export interface TableSeat {
  seat: SeatWind;
  playerId: string;
  initialPoints: number;
  disconnected: boolean;
  ready: boolean;
  clubId: string | null;
}
