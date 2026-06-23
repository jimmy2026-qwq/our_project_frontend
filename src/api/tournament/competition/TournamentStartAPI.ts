import { APIMessage } from '@/system/api';
import type { TournamentSummaryView } from '@/objects';

export class TournamentStartAPI extends APIMessage<TournamentSummaryView> {
  readonly tournamentId: string;
  readonly operatorId?: string;

  constructor(tournamentId: string, operatorId?: string) {
    super();
    this.tournamentId = tournamentId;
    this.operatorId = operatorId;
  }
}
