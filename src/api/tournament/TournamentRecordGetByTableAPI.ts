import { APIMessage } from '@/system/api';
import type { TournamentMatchRecordView } from '@/objects';

export class TournamentRecordGetByTableAPI extends APIMessage<TournamentMatchRecordView> {
  readonly tableId: string;

  constructor(tableId: string) {
    super();
    this.tableId = tableId;
  }
}
