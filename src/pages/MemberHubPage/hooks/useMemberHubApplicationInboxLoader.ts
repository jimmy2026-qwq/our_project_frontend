import { useCallback } from 'react';

import { ListClubApplicationsAPI } from '@/api/club/ListClubApplicationsAPI';
import type { ClubApplicationListQuery, ListEnvelope, Role } from '@/objects';
import type { ClubApplicationView } from '@/pages/objects/ClubApplicationViews';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import { readMemberHubApplicationsByClub } from '../functions/getMemberHubApplicationInboxBridge';
import {
  toClubApplicationView,
  toClubApplicationViewFromInboxItem,
} from '../objects/MemberHub.mappers';
import type { ApplicationInboxState } from '../objects/MemberHub.types';

function getClubApplications(
  clubId: string,
  filters: ClubApplicationListQuery,
) {
  return sendAPI(new ListClubApplicationsAPI(clubId, filters)).then(
    (envelope): ListEnvelope<ClubApplicationView> =>
      mapEnvelope(envelope, toClubApplicationView),
  );
}

export function useMemberHubApplicationInboxLoader() {
  return useCallback(
    async (
      clubId: string,
      operatorId: string,
      role: Role,
    ): Promise<ApplicationInboxState> => {
      if (role !== 'ClubAdmin') {
        return {
          items: [],
          source: 'api',
        };
      }

      try {
        const envelope = await getClubApplications(clubId, {
          operatorId,
          status: 'Pending',
          limit: 20,
          offset: 0,
        });

        return {
          items: envelope.items,
          source: 'api',
        };
      } catch (error) {
        return {
          items: readMemberHubApplicationsByClub(clubId).map(
            toClubApplicationViewFromInboxItem,
          ),
          source: 'api',
          warning:
            error instanceof Error
              ? error.message
              : 'Unable to load the live application inbox.',
        };
      }
    },
    [],
  );
}
