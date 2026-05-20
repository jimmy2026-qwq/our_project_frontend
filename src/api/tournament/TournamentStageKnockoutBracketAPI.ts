import { APIMessage } from '@/system/api';
import type { KnockoutBracketSnapshot } from '@/objects';

export class TournamentStageKnockoutBracketAPI extends APIMessage<KnockoutBracketSnapshot> {
  readonly tournamentId: string;
  readonly stageId: string;

  constructor(tournamentId: string, stageId: string) {
    super();
    this.tournamentId = tournamentId;
    this.stageId = stageId;
  }
}
