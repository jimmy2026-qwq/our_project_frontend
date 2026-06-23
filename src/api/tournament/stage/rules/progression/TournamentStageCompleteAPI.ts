import { APIMessage } from '@/system/api';
import type { StageAdvancementSnapshot } from '@/objects';

export class TournamentStageCompleteAPI extends APIMessage<StageAdvancementSnapshot> {
  readonly tournamentId: string;
  readonly stageId: string;
  readonly operatorId?: string;

  constructor(tournamentId: string, stageId: string, operatorId?: string) {
    super();
    this.tournamentId = tournamentId;
    this.stageId = stageId;
    this.operatorId = operatorId;
  }
}
