import { APIMessage } from '@/system/api';
import type { ListEnvelope, TournamentSettlementQuery, TournamentSettlementView } from '@/objects';

export class TournamentSettlementListAPI extends APIMessage<ListEnvelope<TournamentSettlementView>> {
  readonly tournamentId: string;
  readonly query: TournamentSettlementQuery;

  constructor(
    tournamentId: string,
    filters: TournamentSettlementQuery = {},
  ) {
    super();
    this.tournamentId = tournamentId;
    this.query = filters;
  }
}
