import type { PaifuTile } from '../../paifumanagement';

export interface MahjongPendingCallView {
  discardSequenceNo: number;
  discardPlayerId: string;
  tile: PaifuTile;
  waitingPlayerIds: string[];
}
