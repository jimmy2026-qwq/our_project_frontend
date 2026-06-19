import type { TournamentParticipantKind } from './TournamentParticipantKind';

export interface TournamentWhitelistEntry {
  participantKind: TournamentParticipantKind;
  playerId: string | null;
  clubId: string | null;
}
