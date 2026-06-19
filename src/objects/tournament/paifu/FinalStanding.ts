import type { SeatWind } from '../stage/table/SeatWind';

export interface FinalStanding {
  playerId: string;
  seat: SeatWind;
  finalPoints: number;
  placement: number;
  uma: number | null;
  oka: number | null;
}
