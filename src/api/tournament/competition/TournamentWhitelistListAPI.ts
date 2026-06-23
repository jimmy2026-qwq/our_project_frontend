import { APIMessage } from '@/system/api';
import type { ListEnvelope, TournamentWhitelistEntry, TournamentWhitelistQuery } from '@/objects';

export class TournamentWhitelistListAPI extends APIMessage<ListEnvelope<TournamentWhitelistEntry>> {
  readonly tournamentId: string;
  readonly query: TournamentWhitelistQuery;

  constructor(
    tournamentId: string,
    filters: TournamentWhitelistQuery = {},
  ) {
    super();
    this.tournamentId = tournamentId;
    this.query = filters;
  }
}
