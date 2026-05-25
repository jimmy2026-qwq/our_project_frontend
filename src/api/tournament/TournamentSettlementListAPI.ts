import { APIMessage } from '@/system/api';
import type { ListEnvelope, TournamentSettlementQuery, TournamentSettlementView } from '@/objects';
import type { TournamentSettlementStatus } from '@/objects/tournament';

export class TournamentSettlementListAPI extends APIMessage<ListEnvelope<TournamentSettlementView>> {
  readonly tournamentId: string;
  readonly stageId?: string;
  readonly status?: TournamentSettlementStatus;
  readonly championId?: string;
  readonly limit?: number;
  readonly offset?: number;

  constructor(
    tournamentId: string,
    filters: TournamentSettlementQuery = {},
  ) {
    super();
    this.tournamentId = tournamentId;
    Object.assign(this, filters);
  }
}
