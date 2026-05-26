import type { TournamentPaifuActionType } from './TournamentPaifuActionType';

export interface TournamentPaifuActionView {
  sequenceNo: number;
  actor: string | null;
  actionType: TournamentPaifuActionType | string;
  tile: string | null;
  shantenAfterAction: number | null;
  handTilesAfterAction: string[] | null;
  revealedTiles: string[];
  note: string | null;
}
