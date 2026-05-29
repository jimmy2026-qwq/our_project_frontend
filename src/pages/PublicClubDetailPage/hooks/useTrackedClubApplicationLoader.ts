import { useCallback } from 'react';

import {
  GetClubApplicationAPI,
  GetCurrentClubApplicationAPI,
} from '@/api/club';
import {
  isProvisionalClubApplicationId,
  updateTrackedClubApplicationStatus,
  upsertTrackedClubApplication,
} from '../functions/getClubApplicationTracker';
import { sendAPI } from '@/system/api';
import { ApiError } from '@/system/api/http';

import type { ApplicationState } from '../objects/ClubApplication.types';
import { getTrackedApplication } from '../functions/getTrackedClubApplication';
import { toClubApplicationViewModel } from '../objects/ClubApplication.mappers';
import { toClubApplicationView } from '../objects/ClubDetailApplication.mappers';

export function useTrackedClubApplicationLoader() {
  const loadCurrentPendingApplication = useCallback(
    async (
      clubId: string,
      operatorId: string,
    ): Promise<ApplicationState | null> => {
      try {
        const view = await sendAPI(
          new GetCurrentClubApplicationAPI(clubId, { operatorId }),
        ).then(toClubApplicationView);
        const application = toClubApplicationViewModel(view);

        upsertTrackedClubApplication({
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
          return null;
        }

        throw error;
      }
    },
    [],
  );

  const loadTrackedApplication = useCallback(
    async (
      operatorId: string,
      clubId: string,
      applicationId?: string,
    ): Promise<ApplicationState> => {
      const tracked = getTrackedApplication(operatorId, clubId, applicationId);

      if (
        !applicationId &&
        tracked?.status !== 'Rejected' &&
        tracked?.status !== 'Withdrawn'
      ) {
        try {
          const current = await loadCurrentPendingApplication(
            clubId,
            operatorId,
          );

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
        updateTrackedClubApplicationStatus(tracked.id, 'Rejected');

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
        const view = await sendAPI(
          new GetClubApplicationAPI(clubId, tracked.id, { operatorId }),
        ).then(toClubApplicationView);
        const application = toClubApplicationViewModel(view);

        upsertTrackedClubApplication({
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
          updateTrackedClubApplicationStatus(tracked.id, 'Rejected');

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
    },
    [loadCurrentPendingApplication],
  );

  return { loadCurrentPendingApplication, loadTrackedApplication };
}
