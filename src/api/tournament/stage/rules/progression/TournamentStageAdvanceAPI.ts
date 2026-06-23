import { APIMessage } from '@/system/api';
import type { TournamentTableView } from '@/objects';

export class TournamentStageAdvanceAPI extends APIMessage<TournamentTableView[]> {
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
