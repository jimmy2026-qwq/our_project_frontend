import type { Dispatch, SetStateAction } from 'react';
import type { NavigateFunction } from 'react-router-dom';

import { playerApi, tournamentApi } from '@/pages/PublicShared/objects/data.transport';
import type { TournamentPublicProfile } from '@/pages/PublicShared/objects';
import type { ClubSummary } from '@/pages/objects/club';
import type { PlayerProfile } from '@/pages/objects/player';

import type { TournamentDetailWorkbenchState } from '../objects/tournament-detail.types';
import {
  createRuleDraftFromStage,
  getDefaultRoundCount,
  normalizeKnockoutBracketSize,
} from '../objects/tournament-detail.rules';
import type { TournamentStageRuleDraft } from '../objects/tournament-detail.rules';
import { getNextStageMissingLineupClubNames } from '../objects/tournament-detail.workbench';
import { loadTournamentProfileForWorkbench } from './tournament-detail.workbench-data';

type CurrentRuleStage =
  NonNullable<TournamentPublicProfile['stages']>[number] | null;

interface UseTournamentDetailActionsParams {
  availableClubs: ClubSummary[];
  currentRuleStage: CurrentRuleStage;
  navigate: NavigateFunction;
  onScheduleSuccess?: () => void;
  operatorId?: string;
  ruleDraft: TournamentStageRuleDraft;
  setIsSubmittingTournamentAction: Dispatch<SetStateAction<boolean>>;
  setLocalProfile: Dispatch<SetStateAction<TournamentPublicProfile | null>>;
  setParticipantPlayers: Dispatch<SetStateAction<PlayerProfile[]>>;
  setPublishBlockedOpen: Dispatch<SetStateAction<boolean>>;
  setRuleDraft: Dispatch<SetStateAction<TournamentStageRuleDraft>>;
  setRulesDialogOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedClubId: Dispatch<SetStateAction<string>>;
  setSelectedPlayerId: Dispatch<SetStateAction<string>>;
  setTournamentActionError: Dispatch<SetStateAction<string>>;
  workbench: TournamentDetailWorkbenchState | null;
}

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

  async function handleInviteClub() {
    if (!workbench?.profile.id || !workbench.selectedClubId || !operatorId) {
      return;
    }

    const invitedClubId = workbench.selectedClubId;

    try {
      setIsSubmittingTournamentAction(true);
      setTournamentActionError('');
      await tournamentApi.registerTournamentClub(
        workbench.profile.id,
        invitedClubId,
        operatorId,
      );

      let remainingSelectable = availableClubs.filter(
        (club) => club.id !== invitedClubId,
      );

      try {
        const refreshed = await refreshTournamentProfile(workbench.profile.id);
        remainingSelectable = availableClubs.filter(
          (club) => !(refreshed.clubIds ?? []).includes(club.id),
        );
      } catch {
        setLocalProfile((current) =>
          current
            ? {
                ...current,
                clubIds: Array.from(
                  new Set([...(current.clubIds ?? []), invitedClubId]),
                ),
                clubCount:
                  typeof current.clubCount === 'number'
                    ? Math.max(
                        current.clubCount,
                        (current.clubIds?.length ?? 0) + 1,
                      )
                    : current.clubCount,
              }
            : current,
        );
      }

      setSelectedClubId((current) =>
        current === invitedClubId
          ? (remainingSelectable[0]?.id ?? '')
          : current,
      );
    } catch (error) {
      setTournamentActionError(
        error instanceof Error ? error.message : '邀请俱乐部失败，请稍后重试。',
      );
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  }

  async function handleInvitePlayer() {
    if (!workbench?.profile.id || !workbench.selectedPlayerId || !operatorId) {
      return;
    }

    const invitedPlayerId = workbench.selectedPlayerId;

    try {
      setIsSubmittingTournamentAction(true);
      setTournamentActionError('');
      await tournamentApi.registerTournamentPlayer(
        workbench.profile.id,
        invitedPlayerId,
        operatorId,
      );

      const invitedPlayer =
        workbench.selectablePlayers.find(
          (player) => player.playerId === invitedPlayerId,
        ) ?? (await playerApi.getPlayer(invitedPlayerId));

      setParticipantPlayers((current) => {
        if (current.some((player) => player.playerId === invitedPlayerId)) {
          return current;
        }

        return [...current, invitedPlayer].sort((left, right) =>
          left.displayName.localeCompare(right.displayName, 'zh-CN'),
        );
      });
      setSelectedPlayerId((current) => {
        if (current !== invitedPlayerId) {
          return current;
        }

        return (
          workbench.selectablePlayers.find(
            (player) => player.playerId !== invitedPlayerId,
          )?.playerId ?? ''
        );
      });
    } catch (error) {
      setTournamentActionError(
        error instanceof Error
          ? error.message
          : '邀请个人参赛失败，请稍后重试。',
      );
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  }

  async function handlePublishTournament() {
    if (!operatorId || !workbench?.profile.id) {
      return;
    }

    if ((workbench.profile.clubIds?.length ?? 0) === 0) {
      setPublishBlockedOpen(true);
      return;
    }

    try {
      setIsSubmittingTournamentAction(true);
      setTournamentActionError('');
      await tournamentApi.publishTournament(workbench.profile.id, operatorId);

      try {
        await refreshTournamentProfile(workbench.profile.id);
      } catch {
        setLocalProfile((current) =>
          current
            ? {
                ...current,
                status: 'RegistrationOpen',
              }
            : current,
        );
      }

      navigate('/public');
    } catch (error) {
      setTournamentActionError(
        error instanceof Error ? error.message : '发布赛事失败，请稍后重试。',
      );
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  }

  async function handleScheduleStage() {
    const stageId =
      workbench?.headerStageAction?.kind === 'scheduleStage'
        ? workbench.headerStageAction.stageId
        : workbench?.profile.nextStageId;

    if (!operatorId || !workbench?.profile.id || !stageId) {
      return;
    }

    const missingLineupClubNames = getNextStageMissingLineupClubNames(
      workbench.profile,
      [...workbench.invitedClubs, ...availableClubs],
    );

    if (missingLineupClubNames.length > 0) {
      setTournamentActionError(
        `还有俱乐部未提交参赛名单，暂时不能排桌：${missingLineupClubNames.join('、')}`,
      );
      return;
    }

    try {
      setIsSubmittingTournamentAction(true);
      setTournamentActionError('');
      await tournamentApi.scheduleTournamentStage(
        workbench.profile.id,
        stageId,
        operatorId,
      );
      await refreshTournamentProfile(workbench.profile.id);
      onScheduleSuccess?.();
    } catch (error) {
      setTournamentActionError(
        error instanceof Error ? error.message : '编排牌桌失败，请稍后重试。',
      );
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  }

  function openRulesDialog() {
    setRuleDraft(createRuleDraftFromStage(currentRuleStage));
    setRulesDialogOpen(true);
    setTournamentActionError('');
  }

  async function handleSaveRules() {
    if (!operatorId || !workbench?.profile.id) {
      return;
    }

    const isKnockout = ruleDraft.format === 'Knockout';
    const advanceCount = isKnockout
      ? normalizeKnockoutBracketSize(ruleDraft.advanceCount)
      : Math.max(1, Math.floor(ruleDraft.advanceCount || 0));

    try {
      setIsSubmittingTournamentAction(true);
      setTournamentActionError('');

      if (currentRuleStage) {
        await tournamentApi.configureTournamentStageRules(
          workbench.profile.id,
          currentRuleStage.stageId,
          {
            operatorId,
            format: ruleDraft.format,
            roundCount: currentRuleStage.roundCount,
            advancementRuleType: isKnockout
              ? 'KnockoutElimination'
              : 'SwissCut',
            cutSize: isKnockout ? undefined : advanceCount,
            bracketSize: isKnockout ? advanceCount : undefined,
            targetTableCount: isKnockout ? advanceCount / 4 : undefined,
            schedulingPoolSize: currentRuleStage.schedulingPoolSize ?? 4,
            pairingMethod: isKnockout
              ? undefined
              : currentRuleStage.swissRule?.pairingMethod ?? 'balanced-elo',
            carryOverPoints: isKnockout
              ? undefined
              : currentRuleStage.swissRule?.carryOverPoints ?? true,
            maxRounds: isKnockout
              ? undefined
              : currentRuleStage.swissRule?.maxRounds ?? currentRuleStage.roundCount,
            thirdPlaceMatch: isKnockout
              ? currentRuleStage.knockoutRule?.thirdPlaceMatch ?? false
              : undefined,
            repechageEnabled: isKnockout
              ? currentRuleStage.knockoutRule?.repechageEnabled ?? false
              : undefined,
            seedingPolicy: isKnockout
              ? currentRuleStage.knockoutRule?.seedingPolicy ?? 'rating'
              : undefined,
          },
        );
      } else {
        await tournamentApi.createTournamentStage(workbench.profile.id, {
          name: `${workbench.profile.name} ${isKnockout ? '淘汰赛' : '瑞士轮'}`,
          format: ruleDraft.format,
          order: 1,
          roundCount: getDefaultRoundCount(ruleDraft.format),
          operatorId,
          advancementRuleType: isKnockout
            ? 'KnockoutElimination'
            : 'SwissCut',
          cutSize: isKnockout ? undefined : advanceCount,
          bracketSize: isKnockout ? advanceCount : undefined,
          targetTableCount: isKnockout ? advanceCount / 4 : undefined,
          pairingMethod: isKnockout ? undefined : 'balanced-elo',
          carryOverPoints: isKnockout ? undefined : true,
          maxRounds: isKnockout ? undefined : getDefaultRoundCount(ruleDraft.format),
          thirdPlaceMatch: isKnockout ? false : undefined,
          repechageEnabled: isKnockout ? false : undefined,
          seedingPolicy: isKnockout ? 'rating' : undefined,
          schedulingPoolSize: 4,
        });
      }

      await refreshTournamentProfile(workbench.profile.id);
      setRulesDialogOpen(false);
    } catch (error) {
      setTournamentActionError(
        error instanceof Error
          ? error.message
          : '保存阶段规则失败，请稍后重试。',
      );
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  }

  async function handleCompleteStage() {
    if (
      !operatorId ||
      !workbench?.profile.id ||
      workbench.headerStageAction?.kind !== 'completeStage'
    ) {
      return;
    }

    try {
      setIsSubmittingTournamentAction(true);
      setTournamentActionError('');
      await tournamentApi.completeTournamentStage(
        workbench.profile.id,
        workbench.headerStageAction.stageId,
        { operatorId },
      );
      await refreshTournamentProfile(workbench.profile.id);
      onScheduleSuccess?.();
    } catch (error) {
      setTournamentActionError(
        error instanceof Error
          ? error.message
          : '结束赛段失败，请稍后重试。',
      );
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  }

  async function handleSettleTournament() {
    if (
      !operatorId ||
      !workbench?.profile.id ||
      workbench.headerStageAction?.kind !== 'settleTournament'
    ) {
      return;
    }

    try {
      setIsSubmittingTournamentAction(true);
      setTournamentActionError('');
      await tournamentApi.settleTournament(workbench.profile.id, {
        operatorId,
        finalStageId: workbench.headerStageAction.stageId,
        prizePool: 0,
        houseFeeAmount: 0,
        clubShareRatio: 0,
        adjustments: [],
        finalizeSettlement: true,
      });
      await refreshTournamentProfile(workbench.profile.id);
      onScheduleSuccess?.();
    } catch (error) {
      setTournamentActionError(
        error instanceof Error
          ? error.message
          : '赛事结算失败，请稍后重试。',
      );
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  }

  return {
    handleCompleteStage,
    handleInviteClub,
    handleInvitePlayer,
    handlePublishTournament,
    handleSaveRules,
    handleScheduleStage,
    handleSettleTournament,
    openRulesDialog,
  };
}
