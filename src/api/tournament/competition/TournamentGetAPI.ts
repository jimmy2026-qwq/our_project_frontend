import { APIMessage } from '@/system/api';
import type { TournamentDetailView } from '@/objects';

export class TournamentGetAPI extends APIMessage<TournamentDetailView> {
  readonly tournamentId: string;

  constructor(tournamentId: string) {
    super();
    this.tournamentId = tournamentId;
  }
}
