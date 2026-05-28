import { useEffect, useMemo, useState } from 'react';

import {
  getPublicHallLeaderboardRequestState,
} from '../../../functions/getPublicHallRequestState';
import type {
  HomeDataState,
  LeaderboardDataState,
  PublicHallState,
} from '../../../objects/PublicHallPage.types';
import {
  loadPublicHallLeaderboardData,
  peekPublicHallLeaderboardData,
} from '../functions/loadPublicHallLeaderboardData';

export function usePublicHallLeaderboardData(
  state: PublicHallState,
  homeData: HomeDataState | null,
  reloadKey = 0,
) {
  const initialRequestState = getPublicHallLeaderboardRequestState(state);
  const [data, setData] = useState<LeaderboardDataState | null>(() =>
    peekPublicHallLeaderboardData(initialRequestState),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestState = useMemo<PublicHallState>(
    () => getPublicHallLeaderboardRequestState(state),
    [state.leaderboardClubId, state.leaderboardStatus],
  );

  useEffect(() => {
    if (!homeData) {
      return;
    }

    let cancelled = false;
    const staleData = peekPublicHallLeaderboardData(requestState);

    if (staleData) {
      setData(staleData);
    }

    setIsLoading(!staleData);
    setError(null);

    void loadPublicHallLeaderboardData(requestState, homeData.clubs)
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
              : 'Leaderboard failed to render.',
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
  }, [homeData, reloadKey, requestState]);

  return { data, isLoading, error };
}
