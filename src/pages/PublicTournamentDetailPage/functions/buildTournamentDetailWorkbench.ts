import type { AuthSession } from '@/providers/auth/AuthSession';
import type { ClubSummary } from '@/pages/objects/ClubSummary';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';
import type { TournamentPublicProfile } from '../objects/PublicTournamentDetailPage.types';

import type {
  TournamentDetailTableItem,
  TournamentDetailWorkbenchState,
} from '../objects/TournamentDetail.types';
import type { TournamentStageRuleDraft } from '../objects/TournamentDetailRule.types';
import {
  getNextStageLineupSubmissionCounts,
  getNextStageMissingLineupClubNames,
} from './getNextStageLineup';
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
  ruleDraft: TournamentStageRuleDraft;
  rulesDialogOpen: boolean;
  selectedClubId: string;
  selectedPlayerId: string;
  session: AuthSession | null;
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
    canManageTournament && profile.status === 'Draft';
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
    invitedClubs,
    selectableClubs,
    participantPlayers,
    selectablePlayers,
    selectedPlayerId,
    visibleTables,
  };
}
