import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ClubTournamentQuery, ClubTournamentParticipationView, ListEnvelope } from '@/objects';
import type { ClubTournamentScope } from '@/objects/club';
import type { BackendOption } from '@/system/api/backend-option.transport';

export class ListClubTournamentsAPI extends APIMessage<ListEnvelope<ClubTournamentParticipationView>> {
  readonly scope: BackendOption<ClubTournamentScope>;
  readonly viewer: string[];
  readonly limit: number[];
  readonly offset: number[];

  constructor(
    readonly clubId: string,
    filters: ClubTournamentQuery = {},
  ) {
    super();
    this.scope = encodeBackendOption(filters.scope);
    this.viewer = encodeBackendOption(filters.viewer);
    this.limit = encodeBackendOption(filters.limit);
    this.offset = encodeBackendOption(filters.offset);
  }
}
