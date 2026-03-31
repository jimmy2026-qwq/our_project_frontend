import { useEffect, useState } from 'react';

import {
  DEFAULT_PUBLIC_HALL_STATE,
  loadClubDetail,
  loadPublicHallHomeData,
  loadTournamentDetail,
} from './data';
import type {
  ClubDetailState,
  HomeDataPayload,
  PublicHallState,
  TournamentDetailState,
} from './types';

export function usePublicHallState() {
  const [state, setState] = useState<PublicHallState>(DEFAULT_PUBLIC_HALL_STATE);
  return { state, setState };
}

export function usePublicHallHomeData(state: PublicHallState, reloadKey = 0) {
  const [data, setData] = useState<HomeDataPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    void loadPublicHallHomeData(state)
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
  }, [reloadKey, state]);

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
  }, [clubId]);

  return { state, isLoading };
}
