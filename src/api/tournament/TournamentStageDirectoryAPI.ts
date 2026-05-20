import { APIMessage } from '@/system/api';
import type { TournamentStageDirectoryEntry } from '@/objects';

export class TournamentStageDirectoryAPI extends APIMessage<TournamentStageDirectoryEntry[]> {
  readonly tournamentId: string;

  constructor(tournamentId: string) {
    super();
    this.tournamentId = tournamentId;
  }
}
