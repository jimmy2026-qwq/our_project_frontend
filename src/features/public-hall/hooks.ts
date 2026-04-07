import { useEffect, useState } from 'react';

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
  const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';
  const isRegisteredPlayer = session?.user.roles.isRegisteredPlayer ?? false;
  const isTournamentAdmin = session?.user.roles.isTournamentAdmin ?? false;
  const isSuperAdmin = session?.user.roles.isSuperAdmin ?? false;

  useEffect(() => {
    let cancelled = false;
    const staleData = peekPublicHallHomeData(state, context);

    if (staleData) {
      setData(staleData);
    }

    setIsLoading(!staleData);
    setError(null);

    void loadPublicHallHomeData(state, context)
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
    isRegisteredPlayer,
    isSuperAdmin,
    isTournamentAdmin,
    operatorId,
    reloadKey,
    state.clubActiveOnly,
    state.scheduleStageStatus,
    state.scheduleTournamentStatus,
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

  useEffect(() => {
    if (!homeData || state.activeView !== 'leaderboard') {
      return;
    }

    let cancelled = false;
    const staleData = peekPublicHallLeaderboardData(state);

    if (staleData) {
      setData(staleData);
    }

    setIsLoading(!staleData);
    setError(null);

    void loadPublicHallLeaderboardData(state, homeData.clubs)
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
    state.activeView,
    state.leaderboardClubId,
    state.leaderboardStatus,
  ]);

  return { data, isLoading, error };
}

export function useTournamentDetail(tournamentId: string | undefined) {
  const [state, setState] = useState<TournamentDetailState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tournamentId) {
      setState({ item: null, source: 'mock', warning: 'Tournament id is missing.' });
      setIsLoading(false);
      return;
    }

    let cancelled = false;
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
  }, [tournamentId]);

  return { state, isLoading };
}

export function useClubDetail(clubId: string | undefined) {
  const [state, setState] = useState<ClubDetailState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!clubId) {
      setState({ item: null, source: 'mock', warning: 'Club id is missing.' });
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    void loadClubDetail(clubId)
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
  }, [clubId, reloadKey]);

  return {
    state,
    isLoading,
    refresh: () => setReloadKey((current) => current + 1),
  };
}
