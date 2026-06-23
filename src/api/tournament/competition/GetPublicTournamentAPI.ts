import { APIMessage } from '@/system/api';
import type { PublicTournamentDetailView } from '@/objects';

export class GetPublicTournamentAPI extends APIMessage<PublicTournamentDetailView> {
  constructor(readonly tournamentId: string) {
    super();
  }
}
