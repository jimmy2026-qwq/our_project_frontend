import { useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_PUBLIC_HALL_STATE,
  loadClubDetail,
  loadPublicHallLeaderboardData,
  loadPublicHallHomeData,
  loadTournamentDetail,
  peekPublicHallHomeData,
  peekPublicHallLeaderboardData,
} from './data';
import type {
  ClubDetailState,
  HomeDataPayload,
  LeaderboardDataPayload,
  PublicHallState,
  PublicHallViewerContext,
  TournamentDetailState,
} from './types';
import { playerApi } from '@/api/player';

export function usePublicHallState() {
  const [state, setState] = useState<PublicHallState>(DEFAULT_PUBLIC_HALL_STATE);
  return { state, setState };
}

export function usePublicHallHomeData(
  state: PublicHallState,
  context: PublicHallViewerContext,
  reloadKey = 0,
) {
  const [data, setData] = useState<HomeDataPayload | null>(() => peekPublicHallHomeData(state, context));
  const [isLoading, setIsLoading] = useState(() => !peekPublicHallHomeData(state, context));
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
          setError(loadError instanceof Error ? loadError.message : 'Public hall failed to render.');
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
  }, [
    reloadKey,
    requestContext,
    requestState,
  ]);

  return { data, isLoading, error };
}

export function usePublicHallLeaderboardData(
  state: PublicHallState,
  homeData: HomeDataPayload | null,
  reloadKey = 0,
) {
  const [data, setData] = useState<LeaderboardDataPayload | null>(() => peekPublicHallLeaderboardData(state));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestState = useMemo<PublicHallState>(
    () => ({
      activeView: DEFAULT_PUBLIC_HALL_STATE.activeView,
      scheduleTournamentStatus: DEFAULT_PUBLIC_HALL_STATE.scheduleTournamentStatus,
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
          setError(loadError instanceof Error ? loadError.message : 'Leaderboard failed to render.');
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
  }, [
    homeData,
    reloadKey,
    requestState,
  ]);

  return { data, isLoading, error };
}

export function useTournamentDetail(tournamentId: string | undefined) {
  const [state, setState] = useState<TournamentDetailState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!tournamentId) {
      setState({ item: null, source: 'api', warning: 'Tournament id is missing.' });
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setState(null);
    setIsLoading(true);

    void loadTournamentDetail(tournamentId)
      .then((result) => {
        if (!cancelled) {
          setState(result);
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
  }, [reloadKey, tournamentId]);

  return {
    state,
    isLoading,
    refresh: () => setReloadKey((current) => current + 1),
  };
}

async function resolveClubViewerId(
  fallbackViewerId?: string,
  isRegisteredPlayer = false,
) {
  if (!fallbackViewerId || !isRegisteredPlayer) {
    return fallbackViewerId;
  }

  try {
    const player = await playerApi.getCurrentPlayer(fallbackViewerId);
    return player.playerId || fallbackViewerId;
  } catch {
    return fallbackViewerId;
  }
}

export function useClubDetail(clubId: string | undefined, context?: PublicHallViewerContext) {
  const [state, setState] = useState<ClubDetailState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const operatorId = context?.session?.user.operatorId ?? context?.session?.user.userId;
  const isRegisteredPlayer = context?.session?.user.roles.isRegisteredPlayer ?? false;

  useEffect(() => {
    if (!clubId) {
      setState({ item: null, source: 'api', warning: 'Club id is missing.' });
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    void resolveClubViewerId(operatorId, isRegisteredPlayer)
      .then((viewerId) => loadClubDetail(clubId, viewerId))
      .then((result) => {
        if (!cancelled) {
          setState(result);
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
  }, [clubId, isRegisteredPlayer, operatorId, reloadKey]);

  return {
    state,
    isLoading,
    refresh: () => setReloadKey((current) => current + 1),
  };
}
