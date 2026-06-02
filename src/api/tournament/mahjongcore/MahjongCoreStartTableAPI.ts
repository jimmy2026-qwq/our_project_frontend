import { APIMessage } from '@/system/api';
import type { MahjongTableView, StartMahjongTableRequest } from '@/objects';

export class MahjongCoreStartTableAPI extends APIMessage<MahjongTableView> {
  readonly tableId: string;
  readonly request: StartMahjongTableRequest;

  constructor(tableId: string, request: StartMahjongTableRequest) {
    super();
    this.tableId = tableId;
    this.request = request;
  }
}
