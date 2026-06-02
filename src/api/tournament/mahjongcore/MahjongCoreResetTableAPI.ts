import { APIMessage } from '@/system/api';
import type { MahjongTableView, ResetMahjongTableRequest } from '@/objects';

export class MahjongCoreResetTableAPI extends APIMessage<MahjongTableView> {
  readonly tableId: string;
  readonly request: ResetMahjongTableRequest;

  constructor(tableId: string, request: ResetMahjongTableRequest) {
    super();
    this.tableId = tableId;
    this.request = request;
  }
}
