import { useCallback } from 'react';

import { ListClubsAPI } from '@/api/club';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import type { ClubDirectoryState } from '@/pages/PublicClubDetailPage/objects/application/ClubDirectoryState';
import { toClubSummary } from '../functions/toClubDetailClubData';

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
        };
      } catch (error) {
        return {
          items: [],
          warning:
            error instanceof Error
              ? error.message
              : 'Unable to load joinable clubs.',
        };
      }
    }, []);

  return { loadJoinableClubs };
}
