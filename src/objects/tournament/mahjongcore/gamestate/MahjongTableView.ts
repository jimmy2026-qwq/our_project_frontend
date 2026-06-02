import type { TableId } from '../../tablemanagement';
import type { MahjongLegalAction } from '../action';
import type { MahjongRoundView } from './MahjongRoundView';
import type { MahjongRuleset } from './MahjongRuleset';
import type { MahjongSeatView } from './MahjongSeatView';
import type { MahjongTableStatus } from './MahjongTableStatus';

export interface MahjongTableView {
  tableId: TableId;
  status: MahjongTableStatus;
  ruleset: MahjongRuleset;
  seats: MahjongSeatView[];
  currentRound: MahjongRoundView | null;
  legalActions: MahjongLegalAction[];
  finishedRoundCount: number;
  lastEventSequenceNo: number;
  version: number;
}
