import { APIMessage } from '@/system/api';
import type { TournamentSettlementView } from '@/objects';

export class TournamentSettlementGetAPI extends APIMessage<TournamentSettlementView> {
  readonly tournamentId: string;
  readonly stageId: string;

  constructor(tournamentId: string, stageId: string) {
    super();
    this.tournamentId = tournamentId;
    this.stageId = stageId;
  }
}
