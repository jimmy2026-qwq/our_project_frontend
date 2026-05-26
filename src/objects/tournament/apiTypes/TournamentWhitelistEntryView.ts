import type { TournamentParticipantKind } from '../TournamentParticipantKind';

export interface TournamentWhitelistEntryView {
  participantKind: TournamentParticipantKind;
  playerId: string | null;
  clubId: string | null;
}
