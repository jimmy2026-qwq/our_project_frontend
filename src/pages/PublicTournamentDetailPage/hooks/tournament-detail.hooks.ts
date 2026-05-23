import { useEffect, useMemo, useState } from 'react';
import type { NavigateFunction } from 'react-router-dom';

import type { AuthSession } from '@/providers/auth/AuthSession';
import type { TournamentPublicProfile } from '@/pages/PublicShared/objects';
import type { DetailState } from '@/pages/PublicShared/objects/types';

import {
  createRuleDraftFromStage,
  getCurrentRuleStage,
} from '../objects/tournament-detail.rules';
import type { TournamentStageRuleDraft } from '../objects/tournament-detail.rules';
import { useTournamentDetailActions } from './tournament-detail.actions';
import { useTournamentDetailWorkbenchData } from './tournament-detail.workbench-data';
import { buildTournamentDetailWorkbench } from './tournament-detail.workbench-state';

interface UseTournamentDetailWorkbenchParams {
  state: DetailState<TournamentPublicProfile>;
  session: AuthSession | null;
  navigate: NavigateFunction;
  onScheduleSuccess?: () => void;
}

export function useTournamentDetailWorkbench({
  state,
  session,
  navigate,
  onScheduleSuccess,
}: UseTournamentDetailWorkbenchParams) {
  const {
    availableClubs,
    availablePlayers,
    invitedClubs,
    localProfile,
    participantPlayers,
    playerNames,
    selectedClubId,
    selectedPlayerId,
    tables,
    setParticipantPlayers,
    setLocalProfile,
    setSelectedClubId,
    setSelectedPlayerId,
  } = useTournamentDetailWorkbenchData({ state, session });
  const [isSubmittingTournamentAction, setIsSubmittingTournamentAction] =
    useState(false);
  const [tournamentActionError, setTournamentActionError] = useState('');
  const [publishBlockedOpen, setPublishBlockedOpen] = useState(false);
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false);
  const [ruleDraft, setRuleDraft] = useState<TournamentStageRuleDraft>({
    format: 'Swiss',
    advanceCount: 8,
  });
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const profile = localProfile ?? state.item;
  const operatorId = session?.user.operatorId ?? session?.user.userId;
  const currentRuleStage = profile ? getCurrentRuleStage(profile) : null;

  useEffect(() => {
    if (!rulesDialogOpen) {
      setRuleDraft(createRuleDraftFromStage(currentRuleStage));
    }
  }, [currentRuleStage, rulesDialogOpen]);

  const workbench = useMemo(
    () =>
      buildTournamentDetailWorkbench({
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
      }),
    [
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
    ],
  );

  const {
    handleCompleteStage,
    handleInviteClub,
    handleInvitePlayer,
    handlePublishTournament,
    handleSaveRules,
    handleScheduleStage,
    handleSettleTournament,
    openRulesDialog,
  } = useTournamentDetailActions({
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
  });

  return {
    workbench,
    setSelectedClubId,
    setSelectedPlayerId,
    setPublishBlockedOpen,
    setRulesDialogOpen,
    setRuleDraft,
    setShowMoreInfo,
    handleInviteClub,
    handleInvitePlayer,
    handlePublishTournament,
    handleScheduleStage,
    handleCompleteStage,
    handleSettleTournament,
    handleSaveRules,
    openRulesDialog,
  };
}
