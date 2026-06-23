import { APIMessage } from '@/system/api';
import type { ListEnvelope, StageTableQuery, TournamentTableView } from '@/objects';

export class TournamentStageTablesAPI extends APIMessage<ListEnvelope<TournamentTableView>> {
  readonly tournamentId: string;
  readonly stageId: string;
  readonly query: StageTableQuery;

  constructor(tournamentId: string, stageId: string, filters: StageTableQuery = {}) {
    super();
    this.tournamentId = tournamentId;
    this.stageId = stageId;
    this.query = filters;
  }
}
