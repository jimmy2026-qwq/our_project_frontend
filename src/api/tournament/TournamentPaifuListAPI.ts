import { APIMessage } from '@/system/api';
import type { ListEnvelope, PaifuListQuery, TournamentPaifuSummaryView } from '@/objects';

export class TournamentPaifuListAPI extends APIMessage<ListEnvelope<TournamentPaifuSummaryView>> {
  readonly query: PaifuListQuery;

  constructor(filters: PaifuListQuery = {}) {
    super();
    this.query = filters;
  }
}
