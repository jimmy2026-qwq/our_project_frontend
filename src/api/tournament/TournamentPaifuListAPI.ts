import { APIMessage } from '@/system/api';
import type { ListEnvelope, TournamentPaifuSummaryView } from '@/objects';

export class TournamentPaifuListAPI extends APIMessage<ListEnvelope<TournamentPaifuSummaryView>> {
  readonly tableId?: string;
  readonly playerId?: string;
  readonly tournamentId?: string;
  readonly stageId?: string;
  readonly limit?: number;
  readonly offset?: number;

  constructor(filters: { tableId?: string; playerId?: string; tournamentId?: string; stageId?: string; limit?: number; offset?: number } = {}) {
    super();
    Object.assign(this, filters);
  }
}
