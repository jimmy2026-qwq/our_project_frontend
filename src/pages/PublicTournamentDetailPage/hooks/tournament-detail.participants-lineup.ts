import { useEffect, useState } from 'react';

import type { PlayerProfile } from '@/pages/objects/player';
import { playerApi } from '@/pages/PublicShared/objects/data.transport';

import type { TournamentDetailWorkbenchState } from '../objects/tournament-detail.types';

export type LineupSubmission = NonNullable<
  NonNullable<TournamentDetailWorkbenchState['profile']['stages']>[number]['lineupSubmissions']
>[number];

export function useLineupPlayers({
  expandedClubIds,
  lineupSubmissionByClubId,
}: {
  expandedClubIds: string[];
  lineupSubmissionByClubId: Record<string, LineupSubmission>;
}) {
  const [lineupPlayersById, setLineupPlayersById] = useState<
    Record<string, PlayerProfile>
  >({});
  const [loadingLineupPlayerIds, setLoadingLineupPlayerIds] = useState<string[]>(
    [],
  );

  useEffect(() => {
    const missingPlayerIds = Array.from(
      new Set(
        expandedClubIds.flatMap((clubId) => {
          const submission = lineupSubmissionByClubId[clubId];
          return [
            ...(submission?.activePlayerIds ?? []),
            ...(submission?.reservePlayerIds ?? []),
          ];
        }),
      ),
    ).filter((playerId) => !lineupPlayersById[playerId]);

    if (missingPlayerIds.length === 0) {
      return;
    }

    let cancelled = false;
    setLoadingLineupPlayerIds((current) =>
      Array.from(new Set([...current, ...missingPlayerIds])),
    );

    void Promise.all(
      missingPlayerIds.map(async (playerId) => {
        try {
          const player = await playerApi.getPlayer(playerId);
          return [playerId, player] as const;
        } catch {
          return [playerId, null] as const;
        }
      }),
    ).then((entries) => {
      if (cancelled) {
        return;
      }

      setLineupPlayersById((current) => ({
        ...current,
        ...Object.fromEntries(
          entries.filter(
            (entry): entry is readonly [string, PlayerProfile] =>
              entry[1] !== null,
          ),
        ),
      }));
      setLoadingLineupPlayerIds((current) =>
        current.filter((playerId) => !missingPlayerIds.includes(playerId)),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [expandedClubIds, lineupPlayersById, lineupSubmissionByClubId]);

  return { lineupPlayersById, loadingLineupPlayerIds };
}
