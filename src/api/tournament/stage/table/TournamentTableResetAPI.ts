import { APIMessage } from '@/system/api';
import type { ForceResetTableRequest, TournamentTableView } from '@/objects';

export class TournamentTableResetAPI extends APIMessage<TournamentTableView> {
  readonly tableId: string;
  readonly request: ForceResetTableRequest;

  constructor(tableId: string, payload: ForceResetTableRequest) {
    super();
    this.tableId = tableId;
    this.request = payload;
  }
}
