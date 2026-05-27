import { useEffect, useState } from 'react';

import type { ClubApplication, ClubSummary } from '@/pages/objects/club';
import {
  type HomeClubApplicationState,
  getFallbackPlayerName,
  loadPlayerContext,
  loadTrackedApplication,
  submitClubApplication,
  withdrawClubApplication,
} from '../../../../../objects/application-data';
import { useMutationNotice } from '@/app/feedback/useMutationNotice';
import { useNotice } from '@/app/feedback/useNotice';
import { useAuth } from '@/app/auth/useAuth';

export function useClubApplicationDialog({
  club,
  onOpenChange,
  onMembershipConfirmed,
  onApplicationUpdated,
}: {
  club: ClubSummary;
  onOpenChange: (open: boolean) => void;
  onMembershipConfirmed?: () => void;
  onApplicationUpdated?: (status: ClubApplication['status'] | null) => void;
}) {
  const { session } = useAuth();
  const { notifyMutationResult } = useMutationNotice();
  const { notifyWarning } = useNotice();
  const [state, setState] = useState<HomeClubApplicationState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!session?.user.roles.isRegisteredPlayer) {
      setState(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      const operatorId = session.user.operatorId ?? session.user.userId;
      const playerContext = await loadPlayerContext(
        operatorId,
        session.user.displayName,
      );
      const application = await loadTrackedApplication(operatorId, club.id);

      if (!cancelled) {
        onApplicationUpdated?.(application.application?.status ?? null);
        setState({
          operatorId,
          operatorDisplayName: session.user.displayName,
          clubId: club.id,
          message: '我想加入这个俱乐部，参与后续赛事安排。',
          withdrawNote: '计划有变动',
          clubs: {
            items: [club],
            source: 'api',
          },
          playerContext,
          application,
        });
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [club, onApplicationUpdated, session]);

  const selectedPlayerName =
    state?.playerContext.player?.displayName ??
    (state ? getFallbackPlayerName(state) : '');
  const application = state?.application.application ?? null;
  const isMember =
    state?.playerContext.player?.clubIds?.includes(club.id) ?? false;
  const canSubmit =
    !!state &&
    !isMember &&
    application?.status !== 'Pending' &&
    application?.status !== 'Approved';
  const canWithdraw = !!application && application.status === 'Pending';

  useEffect(() => {
    if (isMember) {
      onMembershipConfirmed?.();
    }
  }, [isMember, onMembershipConfirmed]);

  function setMessage(message: string) {
    setState((current) => (current ? { ...current, message } : current));
  }

  async function refreshCurrentState() {
    if (!state) {
      return;
    }

    setIsRefreshing(true);

    const [playerContext, applicationState] = await Promise.all([
      loadPlayerContext(state.operatorId, state.operatorDisplayName),
      loadTrackedApplication(
        state.operatorId,
        club.id,
        state.application.application?.id,
      ),
    ]);

    setState((current) =>
      current
        ? {
            ...current,
            playerContext,
            application: applicationState,
          }
        : current,
    );
    onApplicationUpdated?.(applicationState.application?.status ?? null);
    setIsRefreshing(false);
  }

  async function handleSubmit() {
    if (!state) {
      return;
    }

    try {
      const result = await submitClubApplication(state);
      setState((current) =>
        current
          ? {
              ...current,
              application: {
                application: result.application,
                source: result.source,
                warning: result.warning,
              },
            }
          : current,
      );
      notifyMutationResult(result, {
        successTitle: '申请已提交',
        successMessage: '俱乐部申请已经成功发送到后端。',
        fallbackTitle: '申请需要人工确认',
        fallbackMessage: '这次申请未能完全确认，请稍后刷新状态。',
      });
      onApplicationUpdated?.(result.application.status);
      onOpenChange(false);
    } catch (error) {
      notifyWarning(
        '申请提交失败',
        error instanceof Error ? error.message : '无法提交当前俱乐部申请。',
      );
    }
  }

  async function handleWithdraw() {
    if (!state) {
      return;
    }

    try {
      const result = await withdrawClubApplication(state);
      setState((current) =>
        current
          ? {
              ...current,
              application: {
                application: result.application,
                source: result.source,
                warning: result.warning,
              },
            }
          : current,
      );
      notifyMutationResult(result, {
        successTitle: '申请已撤回',
        successMessage: '撤回请求已经处理完成。',
        fallbackTitle: '撤回需要人工确认',
        fallbackMessage: '这次撤回未能完全确认，请稍后刷新状态。',
      });
      onApplicationUpdated?.(result.application.status);
    } catch (error) {
      notifyWarning(
        '撤回失败',
        error instanceof Error ? error.message : '无法撤回当前申请。',
      );
    }
  }

  return {
    application,
    canSubmit,
    canWithdraw,
    handleSubmit,
    handleWithdraw,
    isLoading,
    isMember,
    isRefreshing,
    refreshCurrentState,
    selectedPlayerName,
    setMessage,
    state,
  };
}
