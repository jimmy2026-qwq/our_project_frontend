import { APIMessage } from '@/system/api';
import type { TournamentMutationView } from '@/objects';

export class TournamentStageScheduleTablesAPI extends APIMessage<TournamentMutationView> {
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
