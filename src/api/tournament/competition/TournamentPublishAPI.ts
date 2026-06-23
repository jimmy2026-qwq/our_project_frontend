import { APIMessage } from '@/system/api';
import type { TournamentMutationView } from '@/objects';

export class TournamentPublishAPI extends APIMessage<TournamentMutationView> {
  readonly tournamentId: string;
  readonly operatorId?: string;

  constructor(tournamentId: string, operatorId?: string) {
    super();
    this.tournamentId = tournamentId;
    this.operatorId = operatorId;
  }
}
