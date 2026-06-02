import type { SeatWind } from '@/objects/tournament';

export interface PublicClubRecentMatchSeatView {
  playerId: string;
  nickname: string;
  clubId: string | null;
  seat: SeatWind;
  placement: number;
  scoreDelta: number;
  finalPoints: number;
}
