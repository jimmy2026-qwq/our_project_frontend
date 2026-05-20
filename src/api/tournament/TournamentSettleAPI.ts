import { APIMessage } from '@/system/api';
import type { SettleTournamentRequest, TournamentSettlementView } from '@/objects';

export class TournamentSettleAPI extends APIMessage<TournamentSettlementView> {
  readonly tournamentId: string;
  readonly request: SettleTournamentRequest;

  constructor(tournamentId: string, request: SettleTournamentRequest) {
    super();
    this.tournamentId = tournamentId;
    this.request = request;
  }
}
