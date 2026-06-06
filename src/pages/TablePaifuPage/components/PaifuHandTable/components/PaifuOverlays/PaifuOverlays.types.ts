import type { SeatWind } from '@/objects/tournament';
import type { MahjongYakuKind } from '@/objects';

export type ActiveOperation = {
  key: number | string;
  label: string;
  seat: SeatWind;
};

export type WinningCallFlashView = {
  animationMs: number;
  key: number | string;
  label: string;
  seat: SeatWind;
  variant?: 'riichi' | 'win';
};

export type YakumanTileBurstView = {
  featuredTile?: string;
  key: number | string;
  tiles: string[];
  yakuKind: MahjongYakuKind;
};
