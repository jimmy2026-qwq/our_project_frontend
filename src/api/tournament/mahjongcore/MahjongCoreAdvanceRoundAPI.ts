import { APIMessage } from '@/system/api';
import type { AdvanceMahjongRoundRequest, MahjongTableView } from '@/objects';

export class MahjongCoreAdvanceRoundAPI extends APIMessage<MahjongTableView> {
  readonly request?: AdvanceMahjongRoundRequest;

  constructor(
    readonly tableId: string,
    request?: AdvanceMahjongRoundRequest,
  ) {
    super();
    this.request = request;
  }
}
