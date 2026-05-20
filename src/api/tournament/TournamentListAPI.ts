import { APIMessage } from '@/system/api';
import type { ListEnvelope, TournamentListQuery, TournamentSummaryView } from '@/objects';

export class TournamentListAPI extends APIMessage<ListEnvelope<TournamentSummaryView>> {
  readonly status?: string;
  readonly adminId?: string;
  readonly organizer?: string;
  readonly limit?: number;
  readonly offset?: number;

  constructor(filters: TournamentListQuery = {}) {
    super();
    Object.assign(this, filters);
  }
}
