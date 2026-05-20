import { APIMessage } from '@/system/api';
import type { StageRankingSnapshot } from '@/objects';

export class TournamentStageStandingsAPI extends APIMessage<StageRankingSnapshot> {
  readonly tournamentId: string;
  readonly stageId: string;

  constructor(tournamentId: string, stageId: string) {
    super();
    this.tournamentId = tournamentId;
    this.stageId = stageId;
  }
}
