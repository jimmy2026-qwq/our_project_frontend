import type { PaifuTile } from '../../paifu';

export interface MahjongPendingCallView {
  discardSequenceNo: number;
  discardPlayerId: string;
  tile: PaifuTile;
  waitingPlayerIds: string[];
}
