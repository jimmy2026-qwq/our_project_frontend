import type { PaifuActionType, PaifuTile } from '../../paifu';

export interface MahjongPublicEventView {
  sequenceNo: number;
  actor: string | null;
  actionType: PaifuActionType;
  tile: PaifuTile | null;
  tiles: PaifuTile[];
  note: string | null;
}
