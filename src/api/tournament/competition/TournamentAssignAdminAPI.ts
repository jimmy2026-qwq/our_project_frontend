import { APIMessage } from '@/system/api';
import type { AssignTournamentAdminRequest, TournamentSummaryView } from '@/objects';

export class TournamentAssignAdminAPI extends APIMessage<TournamentSummaryView> {
  readonly tournamentId: string;
  readonly request: AssignTournamentAdminRequest;

  constructor(tournamentId: string, request: AssignTournamentAdminRequest) {
    super();
    this.tournamentId = tournamentId;
    this.request = request;
  }
}
