import type { NavigateFunction } from 'react-router-dom';

import {
  TournamentPublishAPI,
  TournamentSettleAPI,
  TournamentStageCompleteAPI,
  TournamentStageScheduleTablesAPI,
} from '@/api/tournament';
import { sendAPI } from '@/system/api';

import { getNextStageMissingLineupClubNames } from '../../../objects/TournamentDetail.workbench';
import type {
  RefreshTournamentProfile,
  UseTournamentDetailActionsParams,
} from '../../TournamentDetailContent/hooks/useTournamentDetailActions.types';

export function useTournamentLifecycleActions({
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
}: Pick<
  UseTournamentDetailActionsParams,
  | 'availableClubs'
  | 'onScheduleSuccess'
  | 'operatorId'
  | 'setIsSubmittingTournamentAction'
  | 'setLocalProfile'
  | 'setPublishBlockedOpen'
  | 'setTournamentActionError'
  | 'workbench'
> & {
  navigate: NavigateFunction;
  refreshTournamentProfile: RefreshTournamentProfile;
}) {
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
      await sendAPI(new TournamentPublishAPI(workbench.profile.id, operatorId));

      try {
        await refreshTournamentProfile(workbench.profile.id);
      } catch {
        setLocalProfile((current) =>
          current ? { ...current, status: 'RegistrationOpen' } : current,
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
      await sendAPI(
        new TournamentStageScheduleTablesAPI(
          workbench.profile.id,
          stageId,
          operatorId,
        ),
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
      await sendAPI(
        new TournamentStageCompleteAPI(
          workbench.profile.id,
          workbench.headerStageAction.stageId,
          { operatorId },
        ),
      );
      await refreshTournamentProfile(workbench.profile.id);
      onScheduleSuccess?.();
    } catch (error) {
      setTournamentActionError(
        error instanceof Error ? error.message : '结束赛段失败，请稍后重试。',
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
      await sendAPI(
        new TournamentSettleAPI(workbench.profile.id, {
          operatorId,
          finalStageId: workbench.headerStageAction.stageId,
          prizePool: 0,
          houseFeeAmount: 0,
          clubShareRatio: 0,
          adjustments: [],
          finalizeSettlement: true,
        }),
      );
      await refreshTournamentProfile(workbench.profile.id);
      onScheduleSuccess?.();
    } catch (error) {
      setTournamentActionError(
        error instanceof Error ? error.message : '赛事结算失败，请稍后重试。',
      );
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  }

  return {
    handleCompleteStage,
    handlePublishTournament,
    handleScheduleStage,
    handleSettleTournament,
  };
}
