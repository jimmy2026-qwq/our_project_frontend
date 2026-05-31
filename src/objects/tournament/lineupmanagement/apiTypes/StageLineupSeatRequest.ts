import type { SeatWind } from '../../tablemanagement/SeatWind';

export interface StageLineupSeatRequest {
  playerId: string;
  preferredWind?: SeatWind | null;
  reserve?: boolean;
}
