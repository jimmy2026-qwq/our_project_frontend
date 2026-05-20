import { APIMessage } from '@/system/api';
import type { ListEnvelope, TournamentWhitelistEntryView } from '@/objects';

export class TournamentWhitelistListAPI extends APIMessage<ListEnvelope<TournamentWhitelistEntryView>> {
  readonly tournamentId: string;
  readonly participantKind?: string;
  readonly playerId?: string;
  readonly clubId?: string;
  readonly limit?: number;
  readonly offset?: number;

  constructor(
    tournamentId: string,
    filters: { participantKind?: string; playerId?: string; clubId?: string; limit?: number; offset?: number } = {},
  ) {
    super();
    this.tournamentId = tournamentId;
    Object.assign(this, filters);
  }
}
