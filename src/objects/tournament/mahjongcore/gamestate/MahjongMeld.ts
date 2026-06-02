import type { PaifuTile } from '../../paifumanagement';
import type { MahjongMeldType } from './MahjongMeldType';

export interface MahjongMeld {
  meldType: MahjongMeldType;
  owner: string;
  fromPlayer: string | null;
  calledTile: PaifuTile | null;
  tiles: PaifuTile[];
  closed: boolean;
}
