import type { PaifuActionType, PaifuTile } from '../../paifumanagement';

export interface MahjongPublicEventView {
  sequenceNo: number;
  actor: string | null;
  actionType: PaifuActionType;
  tile: PaifuTile | null;
  tiles: PaifuTile[];
  note: string | null;
}
