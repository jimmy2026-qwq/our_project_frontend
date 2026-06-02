import type { PaifuTile } from '../../paifumanagement';
import type { MahjongCommandType } from './MahjongCommandType';

export interface MahjongLegalAction {
  commandType: MahjongCommandType;
  tile: PaifuTile | null;
  tiles: PaifuTile[];
  fromPlayerId: string | null;
  targetSequenceNo: number | null;
  priority: number;
}
