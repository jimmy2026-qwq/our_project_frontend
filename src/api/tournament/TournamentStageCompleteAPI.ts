import { APIMessage } from '@/system/api';
import type { CompleteStageRequest, StageAdvancementSnapshot } from '@/objects';

export class TournamentStageCompleteAPI extends APIMessage<StageAdvancementSnapshot> {
  readonly tournamentId: string;
  readonly stageId: string;
  readonly request: CompleteStageRequest;

  constructor(tournamentId: string, stageId: string, request: CompleteStageRequest) {
    super();
    this.tournamentId = tournamentId;
    this.stageId = stageId;
    this.request = request;
  }
}
