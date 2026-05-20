import { APIMessage } from '@/system/api';
import type { TournamentSummaryView } from '@/objects';

export class TournamentWhitelistPlayerAPI extends APIMessage<TournamentSummaryView> {
  readonly tournamentId: string;
  readonly playerId: string;
  readonly operatorId?: string;

  constructor(tournamentId: string, playerId: string, operatorId?: string) {
    super();
    this.tournamentId = tournamentId;
    this.playerId = playerId;
    this.operatorId = operatorId;
  }
}
