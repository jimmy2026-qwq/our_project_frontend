import { APIMessage } from '@/system/api';
import type { MahjongTableView } from '@/objects';

export class MahjongCoreAdvanceRoundAPI extends APIMessage<MahjongTableView> {
  constructor(readonly tableId: string) {
    super();
  }
}
