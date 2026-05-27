import { useMemo, useState } from 'react';

import type { ClubSummary } from '@/pages/objects/club';

import { participantText } from '../../../objects/tournament-participants-text';
import type { TournamentDetailWorkbenchState } from '../../../../../objects/tournament-detail.types';
import {
  type LineupSubmission,
  useLineupPlayers,
} from './TournamentDetailParticipantsLineup.hooks';

export function useTournamentDetailParticipantsTab(
  workbench: TournamentDetailWorkbenchState,
) {
  const [clubsExpanded, setClubsExpanded] = useState(false);
  const [playersExpanded, setPlayersExpanded] = useState(false);
  const [clubInviteOpen, setClubInviteOpen] = useState(false);
  const [playerInviteOpen, setPlayerInviteOpen] = useState(false);
  const [expandedClubIds, setExpandedClubIds] = useState<string[]>([]);

  const nextStage = useMemo(
    () =>
      workbench.profile.stages?.find(
        (stage) => stage.stageId === workbench.profile.nextStageId,
      ) ?? workbench.profile.stages?.[0],
    [workbench.profile.nextStageId, workbench.profile.stages],
  );
  const lineupSubmissionByClubId = useMemo(
    () =>
      Object.fromEntries(
        (nextStage?.lineupSubmissions ?? []).map((submission) => [
          submission.clubId,
          submission,
        ]),
      ) as Record<string, LineupSubmission>,
    [nextStage?.lineupSubmissions],
  );
  const { lineupPlayersById, loadingLineupPlayerIds } = useLineupPlayers({
    expandedClubIds,
    lineupSubmissionByClubId,
  });
  const clubOptions = workbench.selectableClubs.map((club) => ({
    id: club.id,
    label: club.name,
  }));
  const playerOptions = workbench.selectablePlayers.map((player) => ({
    id: player.playerId,
    label: `${player.displayName} / ${participantText.elo} ${player.elo ?? 0}`,
  }));

  function toggleClubRoster(club: ClubSummary) {
    setExpandedClubIds((current) =>
      current.includes(club.id)
        ? current.filter((clubId) => clubId !== club.id)
        : [...current, club.id],
    );
  }

  return {
    clubsExpanded,
    playersExpanded,
    clubInviteOpen,
    playerInviteOpen,
    expandedClubIds,
    lineupSubmissionByClubId,
    lineupPlayersById,
    loadingLineupPlayerIds,
    clubOptions,
    playerOptions,
    setClubsExpanded,
    setPlayersExpanded,
    setClubInviteOpen,
    setPlayerInviteOpen,
    toggleClubRoster,
  };
}
