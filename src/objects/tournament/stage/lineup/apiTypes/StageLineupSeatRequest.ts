import type { SeatWind } from '../../table/SeatWind';

export interface StageLineupSeatRequest {
  playerId: string;
  preferredWind?: SeatWind | null;
  reserve?: boolean;
}
