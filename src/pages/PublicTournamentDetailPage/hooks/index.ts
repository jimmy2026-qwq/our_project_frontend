import { useEffect, useState } from 'react';

import { loadTournamentDetail } from '@/pages/PublicShared/objects/data.detail';
import type { TournamentDetailState } from '@/pages/PublicShared/objects/types';

export function useTournamentDetail(tournamentId: string | undefined) {
  const [state, setState] = useState<TournamentDetailState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!tournamentId) {
      setState({
        item: null,
        source: 'api',
        warning: 'Tournament id is missing.',
      });
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
