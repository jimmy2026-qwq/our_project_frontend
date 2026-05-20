import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type {
  ListEnvelope,
  PublicTournamentQuery,
  PublicTournamentSummaryView,
} from '@/objects';

export class ListPublicTournamentsAPI extends APIMessage<ListEnvelope<PublicTournamentSummaryView>> {
  readonly status: string[];
  readonly organizer: string[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(filters: PublicTournamentQuery = {}) {
    super();
    this.status = encodeBackendOption(filters.status);
    this.organizer = encodeBackendOption(filters.organizer);
    this.limit = encodeBackendOption(filters.limit);
    this.offset = encodeBackendOption(filters.offset);
  }
}
