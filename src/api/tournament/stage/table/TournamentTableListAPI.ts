import { APIMessage } from '@/system/api';
import type { ListEnvelope, TableListQuery, TournamentTableView } from '@/objects';

export class TournamentTableListAPI extends APIMessage<ListEnvelope<TournamentTableView>> {
  readonly query: TableListQuery;

  constructor(filters: TableListQuery = {}) {
    super();
    this.query = filters;
  }
}
