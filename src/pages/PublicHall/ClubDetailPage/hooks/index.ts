import { useEffect, useState } from 'react';

import { GetCurrentPlayerAPI } from '@/api/player/GetCurrentPlayerAPI';
import { loadClubDetail } from '@/pages/PublicHall/objects/data.detail';
import type {
  ClubDetailState,
  PublicHallViewerContext,
} from '@/pages/PublicHall/objects/types';
import { sendAPI } from '@/system/api';

async function resolveClubViewerId(
  fallbackViewerId?: string,
  isRegisteredPlayer = false,
) {
  if (!fallbackViewerId || !isRegisteredPlayer) {
    return fallbackViewerId;
  }

  try {
    const player = await sendAPI(new GetCurrentPlayerAPI(fallbackViewerId));
    return player.playerId || fallbackViewerId;
  } catch {
    return fallbackViewerId;
  }
}

export function useClubDetail(
  clubId: string | undefined,
  context?: PublicHallViewerContext,
) {
  const [state, setState] = useState<ClubDetailState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const operatorId =
    context?.session?.user.operatorId ?? context?.session?.user.userId;
  const isRegisteredPlayer =
    context?.session?.user.roles.isRegisteredPlayer ?? false;

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
