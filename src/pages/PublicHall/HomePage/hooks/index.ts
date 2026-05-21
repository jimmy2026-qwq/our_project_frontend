import { useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_PUBLIC_HALL_STATE,
} from '@/pages/PublicHall/objects/data.shared';
import type {
  HomeDataState,
  LeaderboardDataState,
  PublicHallState,
  PublicHallViewerContext,
} from '@/pages/PublicHall/objects/types';

import {
  loadPublicHallLeaderboardData,
  loadPublicHallHomeData,
  peekPublicHallHomeData,
  peekPublicHallLeaderboardData,
} from '../objects/data.home';

export function usePublicHallState() {
  const [state, setState] = useState<PublicHallState>(
    DEFAULT_PUBLIC_HALL_STATE,
  );
  return { state, setState };
}

export function usePublicHallHomeData(
  state: PublicHallState,
  context: PublicHallViewerContext,
  reloadKey = 0,
) {
  const [data, setData] = useState<HomeDataState | null>(() =>
    peekPublicHallHomeData(state, context),
  );
  const [isLoading, setIsLoading] = useState(
    () => !peekPublicHallHomeData(state, context),
  );
  const [error, setError] = useState<string | null>(null);
  const session = context.session;
  const requestState = useMemo<PublicHallState>(
    () => ({
      activeView: DEFAULT_PUBLIC_HALL_STATE.activeView,
      scheduleTournamentStatus: state.scheduleTournamentStatus,
      scheduleStageStatus: state.scheduleStageStatus,
      leaderboardClubId: state.leaderboardClubId,
      leaderboardStatus: state.leaderboardStatus,
      clubActiveOnly: state.clubActiveOnly,
    }),
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

export function usePublicHallLeaderboardData(
  state: PublicHallState,
  homeData: HomeDataState | null,
  reloadKey = 0,
) {
  const [data, setData] = useState<LeaderboardDataState | null>(() =>
    peekPublicHallLeaderboardData(state),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestState = useMemo<PublicHallState>(
    () => ({
      activeView: DEFAULT_PUBLIC_HALL_STATE.activeView,
      scheduleTournamentStatus:
        DEFAULT_PUBLIC_HALL_STATE.scheduleTournamentStatus,
      scheduleStageStatus: DEFAULT_PUBLIC_HALL_STATE.scheduleStageStatus,
      leaderboardClubId: state.leaderboardClubId,
      leaderboardStatus: state.leaderboardStatus,
      clubActiveOnly: DEFAULT_PUBLIC_HALL_STATE.clubActiveOnly,
    }),
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
