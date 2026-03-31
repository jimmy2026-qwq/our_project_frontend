import { useEffect, useMemo, useState } from 'react';

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
  }

  async function handleWithdraw() {
    if (!state?.application.application) {
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
