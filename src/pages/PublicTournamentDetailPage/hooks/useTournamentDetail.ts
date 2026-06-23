import { useEffect, useState } from 'react';

import { GetPublicTournamentAPI, TournamentGetAPI } from '@/api/tournament';

import { sendAPI } from '@/system/api';

import type { TournamentDetailState } from '@/pages/PublicTournamentDetailPage/objects/state/TournamentDetailState';
import { toPublicTournamentDetail, toTournamentDetailFromAdminView } from '../functions/toTournamentDetailTournamentData';

async function loadTournamentDetail(
  tournamentId: string,
): Promise<TournamentDetailState> {
  try {
    const item = await sendAPI(new GetPublicTournamentAPI(tournamentId)).then(
      toPublicTournamentDetail,
    );
    return { item };
  } catch (error) {
    try {
      const draftItem = await sendAPI(new TournamentGetAPI(tournamentId));
      return {
        item: toTournamentDetailFromAdminView(draftItem),
        warning:
          'This tournament is still in draft mode and is shown through the admin endpoint.',
      };
    } catch {
      // fall through
    }

    return {
      item: null,
      warning:
        error instanceof Error
          ? error.message
          : 'Unable to load tournament detail.',
    };
  }
}

export function useTournamentDetail(tournamentId: string | undefined) {
  const [state, setState] = useState<TournamentDetailState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!tournamentId) {
      setState({
        item: null,
        warning: 'Tournament id is missing.',
      });
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setState((current) =>
      current?.item?.id === tournamentId ? current : null,
    );
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
