import { APIMessage } from '@/system/api';
import type { TournamentTableView } from '@/objects';

export class TournamentTableStartAPI extends APIMessage<TournamentTableView> {
  readonly tableId: string;
  readonly operatorId?: string;

  constructor(tableId: string, operatorId?: string) {
    super();
    this.tableId = tableId;
    this.operatorId = operatorId;
  }
}
