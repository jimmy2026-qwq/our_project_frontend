import { useEffect, useState } from 'react';

import { useAuth } from '@/app/auth/useAuth';
import type { ClubApplication } from '@/pages/objects/ClubApplicationViews';
import type { ClubSummary } from '@/pages/objects/ClubSummary';

import type { HomeClubApplicationState } from '../../../../../objects/ClubApplication.types';
import { getFallbackPlayerName } from '../../../../../functions/getClubApplicationHelpers';
import { useClubApplicationLoaders } from '../../../../../hooks/useClubApplicationLoaders';
import { useClubApplicationDialogActions } from './useClubApplicationDialogActions';

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
  const { loadPlayerContext, loadTrackedApplication } =
    useClubApplicationLoaders();
  const [state, setState] = useState<HomeClubApplicationState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { handleSubmit, handleWithdraw } = useClubApplicationDialogActions({
    onApplicationUpdated,
    onOpenChange,
    setState,
    state,
  });

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
      const playerContext = await loadPlayerContext(operatorId);
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
  }, [
    club,
    loadPlayerContext,
    loadTrackedApplication,
    onApplicationUpdated,
    session,
  ]);

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
      loadPlayerContext(state.operatorId),
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
