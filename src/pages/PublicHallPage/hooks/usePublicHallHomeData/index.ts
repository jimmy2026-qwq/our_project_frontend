import { useEffect, useMemo, useState } from 'react';

import {
  getPublicHallHomeRequestState,
} from '../../objects/data.home.request';
import type {
  HomeDataState,
  PublicHallState,
  PublicHallViewerContext,
} from '../../objects/types';
import {
  loadPublicHallHomeData,
  peekPublicHallHomeData,
} from './loaders';

export function usePublicHallHomeData(
  state: PublicHallState,
  context: PublicHallViewerContext,
  reloadKey = 0,
) {
  const session = context.session;
  const initialRequestState = getPublicHallHomeRequestState(state);
  const initialRequestContext = { session };
  const [data, setData] = useState<HomeDataState | null>(() =>
    peekPublicHallHomeData(initialRequestState, initialRequestContext),
  );
  const [isLoading, setIsLoading] = useState(
    () => !peekPublicHallHomeData(initialRequestState, initialRequestContext),
  );
  const [error, setError] = useState<string | null>(null);
  const requestState = useMemo<PublicHallState>(
    () => getPublicHallHomeRequestState(state),
    [
      state.clubActiveOnly,
      state.leaderboardClubId,
      state.leaderboardStatus,
      state.scheduleStageStatus,
      state.scheduleTournamentStatus,
    ],
  );
  const requestContext = useMemo<PublicHallViewerContext>(
    () => ({ session }),
    [session],
  );

  useEffect(() => {
    let cancelled = false;
    const staleData = peekPublicHallHomeData(requestState, requestContext);

    if (staleData) {
      setData(staleData);
    }

    setIsLoading(!staleData);
    setError(null);

    void loadPublicHallHomeData(requestState, requestContext)
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Public hall failed to render.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey, requestContext, requestState]);

  return { data, isLoading, error };
}
