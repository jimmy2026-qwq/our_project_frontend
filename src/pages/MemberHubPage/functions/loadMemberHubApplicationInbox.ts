import { ListClubApplicationsAPI } from '@/api/club/ListClubApplicationsAPI';
import type { Role } from '@/objects';
import type {
  ClubApplicationListQuery,
  ListEnvelope,
} from '@/objects';
import {
  readClubApplicationInbox,
} from '@/pages/objects/club/ClubApplicationInbox';
import { mapClubApplicationView } from '@/pages/objects/club/ClubMappers';
import type { ClubApplicationView } from '@/pages/objects/club';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import type { ApplicationInboxState } from '../objects/MemberHub.types';
import { mapMemberHubApplication } from './mapMemberHubApplication';

function getClubApplications(
  clubId: string,
  filters: ClubApplicationListQuery,
) {
  return sendAPI(new ListClubApplicationsAPI(clubId, filters)).then(
    (envelope): ListEnvelope<ClubApplicationView> =>
      mapEnvelope(envelope, mapClubApplicationView),
  );
}

export async function loadClubApplicationInbox(
  clubId: string,
  operatorId: string,
  role: Role,
): Promise<ApplicationInboxState> {
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
      items: readClubApplicationInbox()
        .filter((item) => item.clubId === clubId)
        .map(mapMemberHubApplication),
      source: 'api',
      warning:
        error instanceof Error
          ? error.message
          : 'Unable to load the live application inbox.',
    };
  }
}

