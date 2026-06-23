import { useCallback } from 'react';

import { ListClubApplicationsAPI } from '@/api/club/membership/ListClubApplicationsAPI';
import { ClubApplicationStatuses, Role, type ClubApplicationListQuery, type ListEnvelope } from '@/objects';
import type { ClubApplicationView } from '@/pages/shared_objects/club/ClubApplicationView';
import { mapEnvelope } from '@/system/api';
import { sendAPI } from '@/system/api';

import { readMemberHubApplicationsByClub } from '../functions/getMemberHubApplicationInboxBridge';
import { toClubApplicationView, toClubApplicationViewFromInboxItem } from '../functions/toMemberHubData';
import type { ApplicationInboxState } from '../objects/state/ApplicationInboxState';


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
      if (role !== Role.ClubAdmin) {
        return {
          items: [],
        };
      }

      try {
        const envelope = await getClubApplications(clubId, {
          operatorId,
          status: ClubApplicationStatuses.Pending,
          limit: 20,
          offset: 0,
        });

        return {
          items: envelope.items,
        };
      } catch (error) {
        return {
          items: readMemberHubApplicationsByClub(clubId).map(
            toClubApplicationViewFromInboxItem,
          ),
          warning:
            error instanceof Error
              ? error.message
              : '申请收件箱加载失败。',
        };
      }
    },
    [],
  );
}
