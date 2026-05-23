import { useEffect, useMemo, useState } from 'react';
import type { NavigateFunction } from 'react-router-dom';

import {
  playerApi,
  tournamentApi,
} from '@/pages/PublicHall/objects/data.transport';
import type { AuthSession } from '@/providers/auth/AuthSession';
import type { TournamentPublicProfile } from '@/pages/PublicHall/objects';

import type { DetailState } from '@/pages/PublicHall/objects/types';
import type { TournamentDetailWorkbenchState } from '../objects/tournament-detail.types';
import {
  getNextStageLineupSubmissionCounts,
  getNextStageMissingLineupClubNames,
  getTableSortWeight,
} from '../objects/tournament-detail.workbench';
import {
  createRuleDraftFromStage,
  getCurrentRuleStage,
  getDefaultRoundCount,
  normalizeKnockoutBracketSize,
} from '../objects/tournament-detail.rules';
import type { TournamentStageRuleDraft } from '../objects/tournament-detail.rules';
import {
  loadTournamentProfileForWorkbench,
  useTournamentDetailWorkbenchData,
} from './tournament-detail.workbench-data';

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

  const workbench = useMemo<TournamentDetailWorkbenchState | null>(() => {
    if (!profile) {
      return null;
    }

    const canManageTournament =
      !!session?.user.roles.isRegisteredPlayer &&
      (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);
    const canPublishTournament =
      canManageTournament && profile.status === 'Draft';
    const missingLineupClubNames = getNextStageMissingLineupClubNames(
      profile,
      [...invitedClubs, ...availableClubs],
    );
    const lineupSubmissionCounts = getNextStageLineupSubmissionCounts(profile);
    const submittedLineupClubIds = Object.keys(lineupSubmissionCounts);
    const orderedStages = [...(profile.stages ?? [])].sort(
      (left, right) => (left.order ?? 0) - (right.order ?? 0),
    );
    const isStageCompleted = (stage: (typeof orderedStages)[number]) =>
      stage.status === 'Completed' || stage.status === 'Archived';
    const isTournamentClosed =
      profile.status === 'Completed' ||
      profile.status === 'Archived';
    const declaredNextStage = orderedStages.find(
      (stage) => stage.stageId === profile.nextStageId,
    );
    const nextStage =
      declaredNextStage && !isStageCompleted(declaredNextStage)
        ? declaredNextStage
        : orderedStages.find((stage) => !isStageCompleted(stage)) ?? null;
    const nextStageTables = nextStage
      ? tables.filter((table) => table.stageId === nextStage.stageId)
      : [];
    const isWaitingForLineups =
      canManageTournament &&
      !!profile.nextStageId &&
      (profile.status === 'RegistrationOpen' ||
        profile.status === 'InProgress') &&
      missingLineupClubNames.length > 0;
    const canScheduleStage =
      canManageTournament &&
      !!nextStage &&
      !isTournamentClosed &&
      (profile.status === 'RegistrationOpen' ||
        profile.status === 'Scheduled' ||
        profile.status === 'InProgress') &&
      missingLineupClubNames.length === 0 &&
      !isStageCompleted(nextStage) &&
      nextStageTables.length === 0 &&
      (nextStage.tableCount ?? 0) === 0;
    const completableStage =
      orderedStages.find((stage) => {
        if (isStageCompleted(stage)) {
          return false;
        }

        const stageTables = tables.filter(
          (table) => table.stageId === stage.stageId,
        );
        const scheduledTableCount = Math.max(
          stage.tableCount ?? 0,
          stageTables.length,
        );
        const archivedTableCount =
          stageTables.length > 0
            ? stageTables.filter((table) => table.status === 'Archived').length
            : stage.archivedTableCount ?? 0;

        return (
          scheduledTableCount > 0 &&
          archivedTableCount >= scheduledTableCount &&
          (stage.pendingTablePlanCount ?? 0) === 0
        );
      }) ?? null;
    const finalStage = orderedStages[orderedStages.length - 1] ?? null;
    const allStagesCompleted =
      orderedStages.length > 0 && orderedStages.every(isStageCompleted);
    const canSettleTournament =
      canManageTournament &&
      !!finalStage &&
      allStagesCompleted &&
      !isTournamentClosed;
    const headerStageAction =
      canScheduleStage && nextStage
        ? ({
            kind: 'scheduleStage',
            label: '赛段排桌',
            stageId: nextStage.stageId,
          } as const)
        : completableStage && canManageTournament && !isTournamentClosed
          ? ({
              kind: 'completeStage',
              label: '结束赛段',
              stageId: completableStage.stageId,
            } as const)
          : canSettleTournament && finalStage
            ? ({
                kind: 'settleTournament',
                label: '赛事结算',
                stageId: finalStage.stageId,
              } as const)
            : null;
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
    const visibleTables = [
      ...(canManageTournament
        ? tables
        : tables.filter(
            (table) =>
              (table.status === 'WaitingPreparation' &&
                !!operatorId &&
                table.playerIds.includes(operatorId)) ||
              table.status === 'InProgress' ||
              table.status === 'Scoring' ||
              table.status === 'AppealPending' ||
              table.status === 'AppealInProgress' ||
              table.status === 'Archived',
          )),
    ].sort((left, right) => {
      const leftIsOwnWaitingTable =
        !canManageTournament &&
        !!operatorId &&
        left.status === 'WaitingPreparation' &&
        left.playerIds.includes(operatorId);
      const rightIsOwnWaitingTable =
        !canManageTournament &&
        !!operatorId &&
        right.status === 'WaitingPreparation' &&
        right.playerIds.includes(operatorId);

      if (leftIsOwnWaitingTable !== rightIsOwnWaitingTable) {
        return leftIsOwnWaitingTable ? -1 : 1;
      }

      const weightDelta =
        getTableSortWeight(left.status) - getTableSortWeight(right.status);

      if (weightDelta !== 0) {
        return weightDelta;
      }

      return left.tableCode.localeCompare(right.tableCode, 'zh-CN');
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
  }, [
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
    tournamentActionError,
    tables,
  ]);

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
          : '\u9080\u8bf7\u4e2a\u4eba\u53c2\u8d5b\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002',
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
        `还有俱乐部未提交参赛名单，暂时不能排期：${missingLineupClubNames.join('、')}`,
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
