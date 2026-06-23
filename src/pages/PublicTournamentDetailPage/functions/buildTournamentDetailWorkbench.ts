import type { AuthContextSession } from '@/app/auth/AuthContextSession';
import { TournamentStatuses } from '@/objects';
import type { ClubSummary } from '@/pages/shared_objects/club/ClubSummary';
import type { MatchRecordSummary } from '@/pages/shared_objects/tournament/MatchRecordSummary';
import type { PlayerProfile } from '@/pages/shared_objects/player/PlayerProfile';
import type { TournamentPublicProfile } from '@/pages/shared_objects/tournament/TournamentPublicProfile';

import type { TournamentDetailTableItem } from '@/pages/PublicTournamentDetailPage/objects/table/TournamentDetailTableItem';
import type { TournamentDetailWorkbenchState } from '@/pages/PublicTournamentDetailPage/objects/state/workbench/TournamentDetailWorkbenchState';
import type { TournamentStageRuleDraft } from '@/pages/PublicTournamentDetailPage/objects/stage/TournamentStageRuleDraft';
import { getNextStageLineupSubmissionCounts, getNextStageMissingLineupClubNames } from './getNextStageLineup';
import { getTournamentDetailHeaderAction } from './getTournamentDetailHeaderAction';
import { getTournamentDetailParticipantOptions } from './getTournamentDetailParticipantOptions';
import { getTournamentDetailStageProgress } from './getTournamentDetailStageProgress';
import { getVisibleTournamentTables } from './getVisibleTournamentTables';

interface BuildTournamentDetailWorkbenchParams {
  availableClubs: ClubSummary[];
  availablePlayers: PlayerProfile[];
  invitedClubs: ClubSummary[];
  isSubmittingTournamentAction: boolean;
  operatorId?: string;
  participantPlayers: PlayerProfile[];
  playerNames: Record<string, string>;
  profile: TournamentPublicProfile | null;
  publishBlockedOpen: boolean;
  recordByTableId: Record<string, MatchRecordSummary>;
  ruleDraft: TournamentStageRuleDraft;
  rulesDialogOpen: boolean;
  selectedClubId: string | null;
  selectedPlayerId: string | null;
  session: AuthContextSession | null;
  showMoreInfo: boolean;
  tables: TournamentDetailTableItem[];
  tournamentActionError: string;
}

export function buildTournamentDetailWorkbench({
  availableClubs,
  availablePlayers,
  invitedClubs,
  isSubmittingTournamentAction,
  operatorId,
  participantPlayers,
  playerNames,
  profile,
  publishBlockedOpen,
  recordByTableId,
  ruleDraft,
  rulesDialogOpen,
  selectedClubId,
  selectedPlayerId,
  session,
  showMoreInfo,
  tables,
  tournamentActionError,
}: BuildTournamentDetailWorkbenchParams): TournamentDetailWorkbenchState | null {
  if (!profile) {
    return null;
  }

  const canManageTournament =
    !!session?.user.roles.isRegisteredPlayer &&
    (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);
  const canPublishTournament =
    canManageTournament && profile.status === TournamentStatuses.Draft;
  const missingLineupClubNames = getNextStageMissingLineupClubNames(profile, [
    ...invitedClubs,
    ...availableClubs,
  ]);
  const lineupSubmissionCounts = getNextStageLineupSubmissionCounts(profile);
  const submittedLineupClubIds = Object.keys(lineupSubmissionCounts);
  const {
    orderedStages,
    isTournamentClosed,
    nextStage,
    isWaitingForLineups,
    canScheduleStage,
  } = getTournamentDetailStageProgress({
    canManageTournament,
    missingLineupClubNames,
    profile,
    tables,
  });
  const headerStageAction = getTournamentDetailHeaderAction({
    canManageTournament,
    canScheduleStage,
    isTournamentClosed,
    nextStage,
    orderedStages,
    tables,
  });
  const { selectableClubs, selectablePlayers } =
    getTournamentDetailParticipantOptions({
      availableClubs,
      availablePlayers,
      participantPlayers,
      profile,
    });
  const visibleTables = getVisibleTournamentTables({
    canManageTournament,
    operatorId,
    tables,
  });

  return {
    profile,
    selectedClubId,
    isSubmittingTournamentAction,
    tournamentActionError,
    publishBlockedOpen,
    rulesDialogOpen,
    ruleDraft,
    playerNames,
    showMoreInfo,
    canManageTournament,
    canPublishTournament,
    canScheduleStage,
    headerStageAction,
    isWaitingForLineups,
    missingLineupClubNames,
    submittedLineupClubIds,
    lineupSubmissionCounts,
    recordByTableId,
    invitedClubs,
    selectableClubs,
    participantPlayers,
    selectablePlayers,
    selectedPlayerId,
    operatorId,
    visibleTables,
  };
}
