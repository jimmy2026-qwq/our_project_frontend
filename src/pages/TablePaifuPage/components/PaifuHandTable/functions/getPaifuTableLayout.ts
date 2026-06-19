import { SeatWinds, type SeatWind } from '@/objects/tournament';
import type { PaifuTile } from '@/objects';

export function getDisplayTiles(seat: SeatWind, tiles: PaifuTile[]) {
  if (seat === SeatWinds.South || seat === SeatWinds.North) {
    return [...tiles].reverse();
  }

  return tiles;
}
