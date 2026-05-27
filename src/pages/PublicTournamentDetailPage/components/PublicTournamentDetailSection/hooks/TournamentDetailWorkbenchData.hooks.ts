import type { AuthSession } from '@/providers/auth/AuthSession';

import type { DetailState, TournamentPublicProfile } from '../../../objects/types';
import {
  loadTournamentProfileForWorkbench,
  useTournamentProfileData,
} from './TournamentProfileData.hooks';
import { useTournamentClubOptions } from './TournamentClubOptions.hooks';
import { useTournamentParticipantData } from './TournamentParticipantData.hooks';
import { useTournamentPlayerOptions } from './TournamentPlayerOptions.hooks';
import { useTournamentTableData } from './TournamentTableData.hooks';

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
