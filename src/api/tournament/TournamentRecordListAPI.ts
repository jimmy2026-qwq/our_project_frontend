import { APIMessage } from '@/system/api';
import type { ListEnvelope, MatchRecordListQuery, TournamentMatchRecordView } from '@/objects';

export class TournamentRecordListAPI extends APIMessage<ListEnvelope<TournamentMatchRecordView>> {
  readonly tournamentId?: string;
  readonly stageId?: string;
  readonly playerId?: string;
  readonly tableId?: string;
  readonly limit?: number;
  readonly offset?: number;

  constructor(filters: MatchRecordListQuery & { tableId?: string } = {}) {
    super();
    Object.assign(this, filters);
  }
}
