import { APIMessage } from '@/system/api';
import type { TournamentTableView } from '@/objects';

export class TournamentTableGetAPI extends APIMessage<TournamentTableView> {
  readonly tableId: string;

  constructor(tableId: string) {
    super();
    this.tableId = tableId;
  }
}
