import { APIMessage } from '@/system/api';
import type { TournamentSummaryView } from '@/objects';

export class TournamentWhitelistClubAPI extends APIMessage<TournamentSummaryView> {
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
