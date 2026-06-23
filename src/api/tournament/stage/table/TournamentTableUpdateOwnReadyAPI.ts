import { APIMessage } from '@/system/api';
import type { TournamentTableView, UpdateOwnTableReadyStateRequest } from '@/objects';

export class TournamentTableUpdateOwnReadyAPI extends APIMessage<TournamentTableView> {
  readonly tableId: string;
  readonly request: UpdateOwnTableReadyStateRequest;

  constructor(tableId: string, payload: UpdateOwnTableReadyStateRequest) {
    super();
    this.tableId = tableId;
    this.request = payload;
  }
}
