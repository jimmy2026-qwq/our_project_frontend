import type { PaifuActionType } from '../PaifuActionType';

export interface TournamentPaifuActionView {
  sequenceNo: number;
  actor: string | null;
  actionType: PaifuActionType | string;
  tile: string | null;
  shantenAfterAction: number | null;
  handTilesAfterAction: string[] | null;
  revealedTiles: string[];
  note: string | null;
}
