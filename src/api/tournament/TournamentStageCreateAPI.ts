import { APIMessage } from '@/system/api';
import type { CreateTournamentStageRequest, TournamentSummaryView } from '@/objects';

export class TournamentStageCreateAPI extends APIMessage<TournamentSummaryView> {
  readonly tournamentId: string;
  readonly request: CreateTournamentStageRequest;

  constructor(tournamentId: string, request: CreateTournamentStageRequest) {
    super();
    this.tournamentId = tournamentId;
    this.request = request;
  }
}
