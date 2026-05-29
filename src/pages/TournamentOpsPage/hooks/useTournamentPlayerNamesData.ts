import { useEffect, type Dispatch, type SetStateAction } from 'react';

import { GetPlayerAPI } from '@/api/player/GetPlayerAPI';
import type { TournamentTableSummary } from '@/pages/objects/TournamentViews';
import { sendAPI } from '@/system/api';

import type { LoadState } from '../objects/data';
import { toPlayerProfile } from '../objects/TournamentOps.mappers';

export function useTournamentPlayerNamesData(
  tables: LoadState<TournamentTableSummary> | null,
  playerNames: Record<string, string>,
  setPlayerNames: Dispatch<SetStateAction<Record<string, string>>>,
) {
  useEffect(() => {
    let cancelled = false;

    async function loadPlayerNames() {
      if (!tables) {
        return;
      }

      const missingPlayerIds = Array.from(
        new Set(
          tables.envelope.items
            .flatMap((table) => table.playerIds)
            .filter((playerId) => !(playerId in playerNames)),
        ),
      );

      if (missingPlayerIds.length === 0) {
        return;
      }

      const entries = await Promise.all(
        missingPlayerIds.map(async (playerId) => {
          try {
            const profile = await sendAPI(new GetPlayerAPI(playerId)).then(
              toPlayerProfile,
            );
            return [playerId, profile.displayName] as const;
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
  }, [playerNames, setPlayerNames, tables]);
}
