import { APIMessage } from '@/system/api';
import type { StageAdvancementSnapshot } from '@/objects';

export class TournamentStageAdvancementPreviewAPI extends APIMessage<StageAdvancementSnapshot> {
  readonly tournamentId: string;
  readonly stageId: string;

  constructor(tournamentId: string, stageId: string) {
    super();
    this.tournamentId = tournamentId;
    this.stageId = stageId;
  }
}
