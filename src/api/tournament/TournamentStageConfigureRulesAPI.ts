import { APIMessage } from '@/system/api';
import type { ConfigureStageRulesRequest, TournamentSummaryView } from '@/objects';

export class TournamentStageConfigureRulesAPI extends APIMessage<TournamentSummaryView> {
  readonly tournamentId: string;
  readonly stageId: string;
  readonly request: ConfigureStageRulesRequest;

  constructor(tournamentId: string, stageId: string, request: ConfigureStageRulesRequest) {
    super();
    this.tournamentId = tournamentId;
    this.stageId = stageId;
    this.request = request;
  }
}
