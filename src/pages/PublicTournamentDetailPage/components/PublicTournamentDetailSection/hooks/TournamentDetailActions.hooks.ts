import { loadTournamentProfileForWorkbench } from './TournamentDetailWorkbenchData.hooks';
import type { UseTournamentDetailActionsParams } from './TournamentDetailActions.types';
import { useTournamentInviteActions } from './TournamentInviteActions.hooks';
import { useTournamentLifecycleActions } from './TournamentLifecycleActions.hooks';
import { useTournamentRulesActions } from './TournamentRulesActions.hooks';

export function useTournamentDetailActions({
  availableClubs,
  currentRuleStage,
  navigate,
  onScheduleSuccess,
  operatorId,
  ruleDraft,
  setIsSubmittingTournamentAction,
  setLocalProfile,
  setParticipantPlayers,
  setPublishBlockedOpen,
  setRuleDraft,
  setRulesDialogOpen,
  setSelectedClubId,
  setSelectedPlayerId,
  setTournamentActionError,
  workbench,
}: UseTournamentDetailActionsParams) {
  async function refreshTournamentProfile(tournamentId: string) {
    const refreshed = await loadTournamentProfileForWorkbench(tournamentId);
    setLocalProfile(refreshed);
    return refreshed;
  }

  const inviteActions = useTournamentInviteActions({
    availableClubs,
    operatorId,
    refreshTournamentProfile,
    setIsSubmittingTournamentAction,
    setLocalProfile,
    setParticipantPlayers,
    setSelectedClubId,
    setSelectedPlayerId,
    setTournamentActionError,
    workbench,
  });
  const lifecycleActions = useTournamentLifecycleActions({
    availableClubs,
    navigate,
    onScheduleSuccess,
    operatorId,
    refreshTournamentProfile,
    setIsSubmittingTournamentAction,
    setLocalProfile,
    setPublishBlockedOpen,
    setTournamentActionError,
    workbench,
  });
  const rulesActions = useTournamentRulesActions({
    currentRuleStage,
    operatorId,
    refreshTournamentProfile,
    ruleDraft,
    setIsSubmittingTournamentAction,
    setRuleDraft,
    setRulesDialogOpen,
    setTournamentActionError,
    workbench,
  });

  return {
    ...inviteActions,
    ...lifecycleActions,
    ...rulesActions,
  };
}
