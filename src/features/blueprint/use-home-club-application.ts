import { useEffect, useMemo, useState } from 'react';

import { useDialog, useMutationNotice } from '@/hooks';
import type { HomeClubApplicationState } from './application-data';
import {
  getOperatorApplications,
  getSelectedClubName,
  loadJoinableClubs,
  loadPlayerContext,
  playerOptions,
  submitClubApplication,
  withdrawClubApplication,
} from './application-data';

export function useHomeClubApplication() {
  const { confirmDanger } = useDialog();
  const { notifyMutationResult } = useMutationNotice();
  const [state, setState] = useState<HomeClubApplicationState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const clubs = await loadJoinableClubs();
      const initialOperatorId = playerOptions[0].operatorId;
      const playerContext = await loadPlayerContext(initialOperatorId);

      if (!cancelled) {
        setState({
          operatorId: initialOperatorId,
          clubId: clubs.items[0]?.id ?? 'club-1',
          message: 'I would like to join next split.',
          withdrawNote: 'schedule changed',
          clubs,
          playerContext,
          application: { application: null },
        });
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const myApplications = useMemo(
    () => (state ? getOperatorApplications(state.operatorId) : []),
    [state],
  );

  async function changeOperator(operatorId: string) {
    if (!state) {
      return;
    }

    const playerContext = await loadPlayerContext(operatorId);
    setState((current) =>
      current
        ? {
            ...current,
            operatorId,
            playerContext,
          }
        : current,
    );
  }

  async function handleSubmit() {
    if (!state) {
      return;
    }

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
  }

  return {
    state,
    setState,
    isLoading,
    myApplications,
    changeOperator,
    handleSubmit,
    handleWithdraw,
    getSelectedClubName,
  };
}
