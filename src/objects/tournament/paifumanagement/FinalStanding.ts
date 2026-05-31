import type { SeatWind } from '../tablemanagement/SeatWind';

export interface FinalStanding {
  playerId: string;
  seat: SeatWind;
  finalPoints: number;
  placement: number;
  uma: number | null;
  oka: number | null;
}
