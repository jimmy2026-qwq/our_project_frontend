import { useEffect, useMemo, useState } from 'react';

import { getPublicHallLeaderboardRequestState } from '../functions/getPublicHallRequestState';
import type {
  HomeDataState,
  LeaderboardDataState,
  PublicHallState,
} from '../objects/PublicHallPage.types';
import { peekPublicHallLeaderboardData } from '../functions/getPublicHallLeaderboardDataCache';
import { usePublicHallLeaderboardDataLoader } from './usePublicHallLeaderboardDataLoader';

export function usePublicHallLeaderboardData(
  state: PublicHallState,
  homeData: HomeDataState | null,
  reloadKey = 0,
) {
  const loadPublicHallLeaderboardData = usePublicHallLeaderboardDataLoader();
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
              : '排行榜加载失败。',
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
  }, [homeData, loadPublicHallLeaderboardData, reloadKey, requestState]);

  return { data, isLoading, error };
}
