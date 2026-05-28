import type { AuthSession } from '@/providers/auth/AuthSession';

import type { DetailState, TournamentPublicProfile } from '../../../objects/PublicTournamentDetailPage.types';
import {
  loadTournamentProfileForWorkbench,
  useTournamentProfileData,
} from './useTournamentProfileData';
import { useTournamentClubOptions } from '../components/TournamentDetailParticipantsTab/hooks/useTournamentClubOptions';
import { useTournamentParticipantData } from '../components/TournamentDetailParticipantsTab/hooks/useTournamentParticipantData';
import { useTournamentPlayerOptions } from '../components/TournamentDetailParticipantsTab/hooks/useTournamentPlayerOptions';
import { useTournamentTableData } from '../components/TournamentDetailTableTabs/hooks/useTournamentTableData';

export { loadTournamentProfileForWorkbench };

export function useTournamentDetailWorkbenchData({
  state,
  session,
}: {
  state: DetailState<TournamentPublicProfile>;
  session: AuthSession | null;
}) {
  const { localProfile, setLocalProfile } = useTournamentProfileData({
    state,
    session,
  });
  const {
    availableClubs,
    invitedClubs,
    selectedClubId,
    setSelectedClubId,
  } = useTournamentClubOptions({ localProfile, session, state });
  const { participantPlayers, setParticipantPlayers } =
    useTournamentParticipantData({ localProfile, state });
  const { availablePlayers, selectedPlayerId, setSelectedPlayerId } =
    useTournamentPlayerOptions(session);
  const { playerNames, tables } = useTournamentTableData({
    localProfile,
    state,
  });

  return {
    availableClubs,
    invitedClubs,
    localProfile,
    availablePlayers,
    participantPlayers,
    playerNames,
    selectedClubId,
    selectedPlayerId,
    tables,
    setParticipantPlayers,
    setLocalProfile,
    setSelectedClubId,
    setSelectedPlayerId,
  };
}
