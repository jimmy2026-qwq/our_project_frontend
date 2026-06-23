import type { MahjongYakuKind, PaifuTile } from '@/objects';

export type YakumanTileBurstView = {
  featuredTile?: PaifuTile;
  key: number | string;
  tiles: PaifuTile[];
  yakuKind: MahjongYakuKind;
};
