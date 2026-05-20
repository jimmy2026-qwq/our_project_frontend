import { APIMessage } from '@/system/api';
import type { ListEnvelope, TableListQuery, TournamentTableView } from '@/objects';

export class TournamentStageTablesAPI extends APIMessage<ListEnvelope<TournamentTableView>> {
  readonly tournamentId: string;
  readonly stageId: string;
  readonly status?: string;
  readonly playerId?: string;
  readonly roundNumber?: number;
  readonly limit?: number;
  readonly offset?: number;

  constructor(tournamentId: string, stageId: string, filters: TableListQuery & { roundNumber?: number } = {}) {
    super();
    this.tournamentId = tournamentId;
    this.stageId = stageId;
    Object.assign(this, filters);
  }
}
