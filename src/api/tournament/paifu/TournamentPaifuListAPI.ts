import { APIMessage } from '@/system/api';
import type { ListEnvelope, PaifuListQuery, PaifuSummary } from '@/objects';

export class TournamentPaifuListAPI extends APIMessage<ListEnvelope<PaifuSummary>> {
  readonly query: PaifuListQuery;

  constructor(filters: PaifuListQuery = {}) {
    super();
    this.query = filters;
  }
}
