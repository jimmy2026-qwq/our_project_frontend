import { APIMessage } from '@/system/api';
import type { ListEnvelope, MatchRecordListQuery, TournamentMatchRecordView } from '@/objects';

export class TournamentRecordListAPI extends APIMessage<ListEnvelope<TournamentMatchRecordView>> {
  readonly query: MatchRecordListQuery;

  constructor(filters: MatchRecordListQuery = {}) {
    super();
    this.query = filters;
  }
}
