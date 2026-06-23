import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { TournamentMutationView } from '@/objects/tournament';

export class DeclineClubTournamentAPI extends APIMessage<TournamentMutationView> {
  readonly operatorId: string[];

  constructor(
    readonly clubId: string,
    readonly tournamentId: string,
    operatorId?: string,
  ) {
    super();
    this.operatorId = encodeBackendOption(operatorId);
  }
}
