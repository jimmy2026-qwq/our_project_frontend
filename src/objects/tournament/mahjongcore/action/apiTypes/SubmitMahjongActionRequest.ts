import type { PaifuTile } from '../../../paifumanagement';
import type { MahjongCommandType } from '../MahjongCommandType';

export interface SubmitMahjongActionRequest {
  playerId: string;
  commandType: MahjongCommandType;
  tile?: PaifuTile | null;
  tiles?: PaifuTile[];
  targetSequenceNo?: number | null;
  idempotencyKey: string;
}
