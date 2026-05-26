import type { TournamentParticipantKind } from '../TournamentParticipantKind';

export interface TournamentWhitelistQuery {
  participantKind?: TournamentParticipantKind;
  playerId?: string;
  clubId?: string;
  limit?: number;
  offset?: number;
}
