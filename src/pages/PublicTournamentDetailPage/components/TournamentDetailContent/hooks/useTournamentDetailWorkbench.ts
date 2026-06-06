import { useEffect, useMemo, useState } from 'react';
import type { NavigateFunction } from 'react-router-dom';

import { DEFAULT_MAHJONG_RULESET } from '@/objects';
import type { AuthSession } from '@/providers/auth/AuthSession';
import type { TournamentPublicProfile } from '../../../objects/PublicTournamentDetailPage.types';
import type { DetailState } from '../../../objects/PublicTournamentDetailPage.types';

import {
  createRuleDraftFromStage,
  getCurrentRuleStage,
} from '../../../functions/getTournamentDetailRules';
import type { TournamentStageRuleDraft } from '../../../objects/TournamentDetailRule.types';
import { useTournamentDetailActions } from './useTournamentDetailActions';
import { useTournamentDetailWorkbenchData } from './useTournamentDetailWorkbenchData';
import { buildTournamentDetailWorkbench } from '../../../functions/buildTournamentDetailWorkbench';

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
    recordByTableId,
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
    mahjongRuleset: DEFAULT_MAHJONG_RULESET,
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
        recordByTableId,
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
      recordByTableId,
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
