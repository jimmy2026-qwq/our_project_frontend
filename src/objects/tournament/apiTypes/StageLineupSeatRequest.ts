import type { SeatWind } from '../SeatWind';

export interface StageLineupSeatRequest {
  playerId: string;
  preferredWind?: SeatWind | null;
  reserve?: boolean;
}

