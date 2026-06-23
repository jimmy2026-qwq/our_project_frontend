import type { ClubSummary } from '@/pages/shared_objects/club/ClubSummary';
import type { PlayerProfile } from '@/pages/shared_objects/player/PlayerProfile';

export interface TournamentDetailParticipantWorkbenchState {
  invitedClubs: ClubSummary[];
  lineupSubmissionCounts: Record<string, number>;
  participantPlayers: PlayerProfile[];
  selectableClubs: ClubSummary[];
  selectablePlayers: PlayerProfile[];
  selectedClubId: string | null;
  selectedPlayerId: string | null;
  submittedLineupClubIds: string[];
}
