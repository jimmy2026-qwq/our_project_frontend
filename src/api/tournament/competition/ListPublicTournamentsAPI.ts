import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type {
  ListEnvelope,
  PublicTournamentQuery,
  PublicTournamentSummaryView,
} from '@/objects';
import type { TournamentStatus } from '@/objects/tournament';
import type { BackendOption } from '@/system/api/backend-option.transport';

export class ListPublicTournamentsAPI extends APIMessage<ListEnvelope<PublicTournamentSummaryView>> {
  readonly status: BackendOption<TournamentStatus>;
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
