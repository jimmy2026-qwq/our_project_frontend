import { APIMessage } from '@/system/api';
import type { StartTableRequest, TournamentTableView } from '@/objects';

export class TournamentTableStartAPI extends APIMessage<TournamentTableView> {
  readonly tableId: string;
  readonly operatorId?: string;

  constructor(tableId: string, payload: StartTableRequest = {}) {
    super();
    this.tableId = tableId;
    this.operatorId = payload.operatorId;
  }
}
