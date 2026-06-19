import type { PaifuActionType } from './PaifuActionType';
import type { PaifuTile } from './PaifuTile';

export interface PaifuAction {
  sequenceNo: number;
  actor: string | null;
  actionType: PaifuActionType | string;
  tile: PaifuTile | null;
  fromPlayer?: string | null;
  targetSequenceNo?: number | null;
  shantenAfterAction: number | null;
  handTilesAfterAction: PaifuTile[] | null;
  revealedTiles: PaifuTile[];
  note: string | null;
}
