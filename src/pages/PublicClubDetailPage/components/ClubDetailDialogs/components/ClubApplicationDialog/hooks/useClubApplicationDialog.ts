import { useEffect, useRef, useState } from 'react';

import { useAuthContext } from '@/app/auth/useAuthContext';
import { ClubApplicationStatuses } from '@/objects';
import type { ClubApplication } from '@/pages/shared_objects/club/ClubApplication';
import type { ClubSummary } from '@/pages/shared_objects/club/ClubSummary';

import type { HomeClubApplicationState } from '../../../../../objects/ClubApplication.types';
import { getFallbackPlayerName } from '../../../../../functions/getClubApplicationDisplay';
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
  const { session } = useAuthContext();
  const { loadPlayerContext, loadTrackedApplication } =
    useClubApplicationLoaders();
  const [state, setState] = useState<HomeClubApplicationState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onApplicationUpdatedRef = useRef(onApplicationUpdated);
  const { handleSubmit, handleWithdraw } = useClubApplicationDialogActions({
    onApplicationUpdated,
    onOpenChange,
    setState,
    state,
  });

  useEffect(() => {
    onApplicationUpdatedRef.current = onApplicationUpdated;
  }, [onApplicationUpdated]);

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
        onApplicationUpdatedRef.current?.(
          application.application?.status ?? null,
        );
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
    club.id,
    club.memberCount,
    club.name,
    club.powerRating,
    club.relations,
    club.treasury,
    loadPlayerContext,
    loadTrackedApplication,
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
    application?.status !== ClubApplicationStatuses.Pending &&
    application?.status !== ClubApplicationStatuses.Approved;
  const canWithdraw =
    !!application && application.status === ClubApplicationStatuses.Pending;

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
