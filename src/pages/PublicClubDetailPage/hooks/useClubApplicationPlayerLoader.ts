import { useCallback } from 'react';

import { GetPlayerAPI } from '@/api/player';
import { sendAPI } from '@/system/api';

import type { PlayerContextState } from '@/pages/PublicClubDetailPage/objects/application/PlayerContextState';
import { toPlayerProfile } from '../functions/toClubDetailPlayerData';

export function useClubApplicationPlayerLoader() {
  const loadPlayerContext = useCallback(
    async (operatorId: string): Promise<PlayerContextState> => {
      try {
        const player = await sendAPI(new GetPlayerAPI(operatorId)).then(
          toPlayerProfile,
        );

        return {
          player,
        };
      } catch (error) {
        return {
          player: null,
          warning:
            error instanceof Error
              ? error.message
              : 'Unable to load current player context.',
        };
      }
    },
    [],
  );

  return { loadPlayerContext };
}
