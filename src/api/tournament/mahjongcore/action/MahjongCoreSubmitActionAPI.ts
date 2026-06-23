import { APIMessage } from '@/system/api';
import type { MahjongActionResponse, SubmitMahjongActionRequest } from '@/objects';

export class MahjongCoreSubmitActionAPI extends APIMessage<MahjongActionResponse> {
  readonly tableId: string;
  readonly request: SubmitMahjongActionRequest;

  constructor(tableId: string, request: SubmitMahjongActionRequest) {
    super();
    this.tableId = tableId;
    this.request = request;
  }
}
