import { APIMessage } from '@/system/api';
import type { ListEnvelope, TableListQuery, TournamentTableView } from '@/objects';
import type { TableStatus } from '@/objects/tournament';

export class TournamentTableListAPI extends APIMessage<ListEnvelope<TournamentTableView>> {
  readonly status?: TableStatus;
  readonly playerId?: string;
  readonly tournamentId?: string;
  readonly stageId?: string;
  readonly roundNumber?: number;
  readonly limit?: number;
  readonly offset?: number;

  constructor(filters: TableListQuery & { tournamentId?: string; stageId?: string; roundNumber?: number } = {}) {
    super();
    Object.assign(this, filters);
  }
}
