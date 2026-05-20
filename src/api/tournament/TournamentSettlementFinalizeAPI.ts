import { APIMessage } from '@/system/api';
import type { FinalizeTournamentSettlementRequest, TournamentSettlementView } from '@/objects';

export class TournamentSettlementFinalizeAPI extends APIMessage<TournamentSettlementView> {
  readonly tournamentId: string;
  readonly settlementId: string;
  readonly request: FinalizeTournamentSettlementRequest;

  constructor(tournamentId: string, settlementId: string, request: FinalizeTournamentSettlementRequest) {
    super();
    this.tournamentId = tournamentId;
    this.settlementId = settlementId;
    this.request = request;
  }
}
