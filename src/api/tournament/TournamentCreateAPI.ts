import { APIMessage } from '@/system/api';
import type { CreateTournamentRequest, TournamentSummaryView } from '@/objects';

export class TournamentCreateAPI extends APIMessage<TournamentSummaryView> {
  readonly request: CreateTournamentRequest;

  constructor(payload: CreateTournamentRequest) {
    super();
    this.request = payload;
  }
}
