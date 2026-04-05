import { useEffect, useMemo, useState } from 'react';

import { useDialog, useMutationNotice, useNotice } from '@/hooks';
import { useAuth } from '@/hooks/useAuth';
import type { HomeClubApplicationState } from './application-data';
import {
  getOperatorApplications,
  getSelectedClubName,
  loadJoinableClubs,
  loadPlayerContext,
  loadTrackedApplication,
  submitClubApplication,
  withdrawClubApplication,
} from './application-data';

export function useHomeClubApplication() {
  const { session } = useAuth();
  const { confirmDanger } = useDialog();
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
      const clubs = await loadJoinableClubs();
      const initialOperatorId = session.user.operatorId ?? session.user.userId;
      const initialClubId = clubs.items[0]?.id ?? 'club-1';
      const playerContext = await loadPlayerContext(initialOperatorId, session.user.displayName);
      const application = await loadTrackedApplication(initialOperatorId, initialClubId);

      if (!cancelled) {
        setState({
          operatorId: initialOperatorId,
          operatorDisplayName: session.user.displayName,
          clubId: initialClubId,
          message: 'I would like to join next split.',
          withdrawNote: 'schedule changed',
          clubs,
          playerContext,
          application,
        });
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session]);

  const myApplications = useMemo(
    () => (state ? getOperatorApplications(state.operatorId) : []),
    [state],
  );

  async function refreshCurrentApplication() {
    if (!state) {
      return;
    }

    setIsRefreshing(true);

    const result = await loadTrackedApplication(
      state.operatorId,
      state.clubId,
      state.application.application?.id,
    );

    setState((current) =>
      current
        ? {
            ...current,
            application: result,
          }
        : current,
    );

    setIsRefreshing(false);
  }

  useEffect(() => {
    if (!state) {
      return;
    }

    void refreshCurrentApplication();
  }, [state?.clubId]);

  useEffect(() => {
    if (!state) {
      return;
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === 'riichi-nexus.club-applications') {
        void refreshCurrentApplication();
      }
    }

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [state]);

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
        successTitle: 'Club application submitted',
        successMessage: 'The request was sent to the backend successfully.',
        fallbackTitle: 'Club application submitted with fallback',
        fallbackMessage: 'The request used the local fallback flow.',
      });
    } catch (error) {
      notifyWarning('Club application failed', error instanceof Error ? error.message : '提交申请失败，请稍后再试。');
    }
  }

  async function handleWithdraw() {
    if (!state?.application.application) {
      return;
    }

    const confirmed = await confirmDanger({
      title: 'Withdraw current application?',
      message: 'This will mark the current club application as withdrawn and sync the result back into the local flow.',
      confirmText: 'Withdraw',
    });

    if (!confirmed) {
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
        successTitle: 'Application withdrawn',
        successMessage: 'The withdraw request completed successfully.',
        fallbackTitle: 'Application withdrawn with fallback',
        fallbackMessage: 'The withdraw flow used the local fallback path.',
      });
    } catch (error) {
      notifyWarning('Withdraw failed', error instanceof Error ? error.message : '撤回申请失败，请稍后再试。');
    }
  }

  return {
    state,
    setState,
    isLoading,
    isRefreshing,
    myApplications,
    handleSubmit,
    handleWithdraw,
    refreshCurrentApplication,
    getSelectedClubName,
  };
}
