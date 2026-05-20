import { APIMessage } from '@/system/api';
import type { ListEnvelope, TournamentSettlementView } from '@/objects';

export class TournamentSettlementListAPI extends APIMessage<ListEnvelope<TournamentSettlementView>> {
  readonly tournamentId: string;
  readonly stageId?: string;
  readonly status?: string;
  readonly championId?: string;
  readonly limit?: number;
  readonly offset?: number;

  constructor(
    tournamentId: string,
    filters: { stageId?: string; status?: string; championId?: string; limit?: number; offset?: number } = {},
  ) {
    super();
    this.tournamentId = tournamentId;
    Object.assign(this, filters);
  }
}
