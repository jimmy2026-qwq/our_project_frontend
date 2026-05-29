import { useCallback } from 'react';

import { GetCurrentPlayerAPI } from '@/api/player';
import { sendAPI } from '@/system/api';

import type { PlayerContextState } from '../objects/ClubApplication.types';
import { toPlayerProfile } from '../objects/ClubDetailPlayer.mappers';

export function useClubApplicationPlayerLoader() {
  const loadPlayerContext = useCallback(
    async (operatorId: string): Promise<PlayerContextState> => {
      try {
        const player = await sendAPI(new GetCurrentPlayerAPI(operatorId)).then(
          toPlayerProfile,
        );

        return {
          player,
          source: 'api',
        };
      } catch (error) {
        return {
          player: null,
          source: 'api',
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
