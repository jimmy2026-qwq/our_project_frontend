import { useEffect, useMemo, useState } from 'react';

import { GetPlayerAPI } from '@/api/player';
import { sendAPI } from '@/system/api';

export function useTableMatchPlayerNames(playerIds: string[]) {
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({});
  const playerIdsKey = useMemo(
    () => Array.from(new Set(playerIds.filter(Boolean))).sort().join('|'),
    [playerIds],
  );

  useEffect(() => {
    let cancelled = false;
    const uniquePlayerIds = playerIdsKey ? playerIdsKey.split('|') : [];
    const missingPlayerIds = uniquePlayerIds.filter(
      (playerId) => !(playerId in playerNames),
    );

    if (missingPlayerIds.length === 0) {
      return undefined;
    }

    async function loadPlayerNames() {
      const entries = await Promise.all(
        missingPlayerIds.map(async (playerId) => {
          try {
            const profile = await sendAPI(new GetPlayerAPI(playerId));
            return [playerId, profile.nickname || playerId] as const;
          } catch {
            return [playerId, playerId] as const;
          }
        }),
      );

      if (!cancelled) {
        setPlayerNames((current) => ({
          ...current,
          ...Object.fromEntries(entries),
        }));
      }
    }

    void loadPlayerNames();

    return () => {
      cancelled = true;
    };
  }, [playerIdsKey, playerNames]);

  return playerNames;
}
