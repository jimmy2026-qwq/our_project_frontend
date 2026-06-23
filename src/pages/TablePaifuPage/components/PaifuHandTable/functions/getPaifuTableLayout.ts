import { SeatWind } from '@/objects/tournament';
import type { PaifuTile } from '@/objects';

export function getDisplayTiles(seat: SeatWind, tiles: PaifuTile[]) {
  if (seat === SeatWind.South || seat === SeatWind.North) {
    return [...tiles].reverse();
  }

  return tiles;
}
