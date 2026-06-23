import { APIMessage } from '@/system/api';
import type { ArchiveMahjongTableRequest, MahjongActionResponse } from '@/objects';

export class MahjongCoreArchiveTableAPI extends APIMessage<MahjongActionResponse> {
  readonly tableId: string;
  readonly request: ArchiveMahjongTableRequest;

  constructor(tableId: string, request: ArchiveMahjongTableRequest) {
    super();
    this.tableId = tableId;
    this.request = request;
  }
}
