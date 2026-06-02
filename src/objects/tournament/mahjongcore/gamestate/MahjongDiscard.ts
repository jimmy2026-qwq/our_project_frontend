import type { PaifuTile } from '../../paifumanagement';

export interface MahjongDiscard {
  sequenceNo: number;
  playerId: string;
  tile: PaifuTile;
  tsumogiri: boolean;
  riichiDeclared: boolean;
  calledBy: string | null;
}
