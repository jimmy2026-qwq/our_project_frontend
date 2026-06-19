import type { SeatWind } from '@/objects/tournament';

export interface TableSeatState {
  seat: SeatWind;
  playerId: string;
  initialPoints: number;
  disconnected: boolean;
  ready: boolean;
  clubId?: string | null;
}
