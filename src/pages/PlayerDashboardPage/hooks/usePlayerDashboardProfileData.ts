import { useCallback } from 'react';

import { GetPublicClubAPI } from '@/api/club';
import { OpsAnalyticsPlayerDashboardAPI } from '@/api/opsanalytics';
import { GetCurrentPlayerAPI } from '@/api/player';
import { sendAPI } from '@/system/api';

import { toDashboardSummary } from '../functions/toDashboardSummary';
import { toPlayerProfile } from '../objects/PlayerDashboard.mappers';
import type { PlayerClubLink } from '../objects/PlayerDashboard.types';

function getPlayerClubLinks(clubIds: string[]) {
  return Promise.all(
    clubIds.map(async (clubId) => {
      try {
        return {
          id: clubId,
          name: await sendAPI(new GetPublicClubAPI(clubId)).then(
            (club) => club.name,
          ),
        };
      } catch {
        return {
          id: clubId,
          name: clubId,
        };
      }
    }),
  ) satisfies Promise<PlayerClubLink[]>;
}

export function usePlayerDashboardProfileData() {
  return useCallback(async (operatorId: string) => {
    const [player, dashboard] = await Promise.all([
      sendAPI(new GetCurrentPlayerAPI(operatorId)).then(toPlayerProfile),
      sendAPI(
        new OpsAnalyticsPlayerDashboardAPI({
          playerId: operatorId,
          operatorId,
        }),
      ).then(toDashboardSummary),
    ]);

    return {
      player,
      dashboard,
      playerClubs: await getPlayerClubLinks(player.clubIds ?? []),
    };
  }, []);
}
