import { APIMessage } from '@/system/api';
import type { AdvanceKnockoutStageRequest, Table } from '@/objects';

export class TournamentStageAdvanceAPI extends APIMessage<Table[]> {
  readonly tournamentId: string;
  readonly stageId: string;
  readonly request: AdvanceKnockoutStageRequest;

  constructor(tournamentId: string, stageId: string, request: AdvanceKnockoutStageRequest) {
    super();
    this.tournamentId = tournamentId;
    this.stageId = stageId;
    this.request = request;
  }
}
