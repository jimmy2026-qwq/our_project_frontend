import type { MahjongYakuKind, PaifuTile } from '@/objects';
import type { SeatWind } from '@/objects/tournament';

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
  featuredTile?: PaifuTile;
  key: number | string;
  tiles: PaifuTile[];
  yakuKind: MahjongYakuKind;
};
