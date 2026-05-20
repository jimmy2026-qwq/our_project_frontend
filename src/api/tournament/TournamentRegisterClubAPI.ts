import { APIMessage } from '@/system/api';
import type { TournamentMutationView } from '@/objects';

export class TournamentRegisterClubAPI extends APIMessage<TournamentMutationView> {
  readonly tournamentId: string;
  readonly clubId: string;
  readonly operatorId?: string;

  constructor(tournamentId: string, clubId: string, operatorId?: string) {
    super();
    this.tournamentId = tournamentId;
    this.clubId = clubId;
    this.operatorId = operatorId;
  }
}
