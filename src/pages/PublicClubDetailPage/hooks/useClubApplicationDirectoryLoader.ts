import { useCallback } from 'react';

import { ListClubsAPI } from '@/api/club';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import type { ClubDirectoryState } from '../objects/ClubApplication.types';
import { toClubSummary } from '../objects/ClubDetailClub.mappers';

export function useClubApplicationDirectoryLoader() {
  const loadJoinableClubs =
    useCallback(async (): Promise<ClubDirectoryState> => {
      try {
        const envelope = await sendAPI(
          new ListClubsAPI({
            activeOnly: true,
            joinableOnly: true,
            limit: 20,
            offset: 0,
          }),
        ).then((response) => mapEnvelope(response, toClubSummary));

        return {
          items: envelope.items,
          source: 'api',
        };
      } catch (error) {
        return {
          items: [],
          source: 'api',
          warning:
            error instanceof Error
              ? error.message
              : 'Unable to load joinable clubs.',
        };
      }
    }, []);

  return { loadJoinableClubs };
}
