import type { PaifuTile } from '../../paifu';

export interface MahjongDiscard {
  sequenceNo: number;
  playerId: string;
  tile: PaifuTile;
  tsumogiri: boolean;
  riichiDeclared: boolean;
  calledBy: string | null;
}
