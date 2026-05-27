import {
  isProvisionalClubApplicationId,
  updateClubApplicationInboxStatus,
  upsertClubApplicationInboxItem,
} from '@/pages/objects/club';
import { ApiError } from '@/system/api/http';

import { clubsApi } from './application-data.api';
import { loadCurrentPendingApplication } from './application-data.loaders';
import {
  getTrackedApplication,
  toClubApplicationViewModel,
} from './application-data.models';
import type { ApplicationState } from './application-data.types';

export async function loadTrackedApplication(
  operatorId: string,
  clubId: string,
  applicationId?: string,
): Promise<ApplicationState> {
  const tracked = getTrackedApplication(operatorId, clubId, applicationId);

  if (
    !applicationId &&
    tracked?.status !== 'Rejected' &&
    tracked?.status !== 'Withdrawn'
  ) {
    try {
      const current = await loadCurrentPendingApplication(clubId, operatorId);

      if (current) {
        return current;
      }
    } catch (error) {
      if (!tracked) {
        return {
          application: null,
          warning:
            error instanceof Error
              ? error.message
              : 'Unable to load the current club application.',
        };
      }
    }
  }

  if (!tracked) {
    return {
      application: null,
    };
  }

  if (isProvisionalClubApplicationId(tracked.id)) {
    updateClubApplicationInboxStatus(tracked.id, 'Rejected');

    return {
      application: {
        id: tracked.id,
        clubId: tracked.clubId,
        status: 'Rejected',
        applicantName: tracked.applicantName,
        message: tracked.message,
        createdAt: tracked.submittedAt,
      },
      source: tracked.source,
      warning:
        'The backend no longer reports a pending application, so the provisional local record was preserved as rejected.',
    };
  }

  try {
    const view = await clubsApi.getClubApplication(clubId, tracked.id, {
      operatorId,
    });
    const application = toClubApplicationViewModel(view);

    upsertClubApplicationInboxItem({
      id: application.id,
      clubId: application.clubId,
      clubName: view.clubName,
      operatorId,
      applicantName: application.applicantName,
      message: application.message,
      status: application.status,
      submittedAt: application.createdAt,
      source: 'api',
    });

    return {
      application,
      source: 'api',
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      updateClubApplicationInboxStatus(tracked.id, 'Rejected');

      return {
        application: {
          id: tracked.id,
          clubId: tracked.clubId,
          status: 'Rejected',
          applicantName: tracked.applicantName,
          message: tracked.message,
          createdAt: tracked.submittedAt,
        },
        source: tracked.source,
        warning:
          'The backend no longer returned this application, so the local record was preserved as rejected.',
      };
    }

    return {
      application: {
        id: tracked.id,
        clubId: tracked.clubId,
        status: tracked.status,
        applicantName: tracked.applicantName,
        message: tracked.message,
        createdAt: tracked.submittedAt,
      },
      source: tracked.source,
      warning:
        error instanceof Error
          ? error.message
          : 'Application status fallback to local bridge.',
    };
  }
}
