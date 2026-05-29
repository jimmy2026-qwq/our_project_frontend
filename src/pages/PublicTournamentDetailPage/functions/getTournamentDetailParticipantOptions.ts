import type { ClubSummary } from '@/pages/objects/ClubSummary';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';

import type { TournamentPublicProfile } from '../objects/PublicTournamentDetailPage.types';

export function getTournamentDetailParticipantOptions({
  availableClubs,
  availablePlayers,
  participantPlayers,
  profile,
}: {
  availableClubs: ClubSummary[];
  availablePlayers: PlayerProfile[];
  participantPlayers: PlayerProfile[];
  profile: TournamentPublicProfile;
}) {
  const invitedClubIds = profile.clubIds ?? [];
  const selectableClubs = availableClubs.filter(
    (club) => !invitedClubIds.includes(club.id),
  );
  const participantPlayerIds = new Set(
    participantPlayers.map((player) => player.playerId),
  );
  const selectablePlayers = availablePlayers.filter(
    (player) => !participantPlayerIds.has(player.playerId),
  );

  return { selectableClubs, selectablePlayers };
}
