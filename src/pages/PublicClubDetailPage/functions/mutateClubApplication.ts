import {
  SubmitClubApplicationAPI,
  WithdrawClubApplicationAPI,
} from '@/api/club';
import {
  createProvisionalClubApplicationId,
  isProvisionalClubApplicationId,
  updateClubApplicationInboxStatus,
  upsertClubApplicationInboxItem,
  type ClubApplication,
} from '@/pages/objects/club';
import { sendAPI } from '@/system/api';
import { ApiError } from '@/system/api/http';

import type { HomeClubApplicationState } from '../objects/ClubApplication.types';
import {
  getFallbackPlayerName,
  getSelectedClubName,
} from './getClubApplicationHelpers';
import { loadCurrentPendingApplication } from './loadClubApplicationData';
import { toClubApplicationMutationModel } from './mapClubApplicationData';

export async function submitClubApplication(state: HomeClubApplicationState) {
  const selectedPlayerName =
    state.playerContext.player?.displayName ?? getFallbackPlayerName(state);
  const message = state.message.trim() || 'I would like to join next split.';

  try {
    const response = await sendAPI(
      new SubmitClubApplicationAPI(state.clubId, {
        operatorId: state.operatorId,
        displayName: selectedPlayerName,
        message,
      }),
    );
    const application = toClubApplicationMutationModel(
      state.clubId,
      selectedPlayerName,
      response,
    );
    upsertClubApplicationInboxItem({
      id: application.id,
      clubId: state.clubId,
      clubName: getSelectedClubName(state.clubId, state.clubs.items),
      operatorId: state.operatorId,
      applicantName: selectedPlayerName,
      message: application.message,
      status: application.status,
      submittedAt: application.createdAt,
      source: 'api',
    });
    return { application, source: 'api' as const, warning: undefined };
  } catch (error) {
    if (
      error instanceof ApiError &&
      /already has a pending application/i.test(error.message)
    ) {
      const current = await loadCurrentPendingApplication(
        state.clubId,
        state.operatorId,
      );

      if (current?.application) {
        return {
          application: current.application,
          source: current.source ?? 'api',
          warning:
            'The backend reported that the pending application already exists, so the current live record was loaded instead.',
        };
      }

      const provisionalApplication: ClubApplication = {
        id: createProvisionalClubApplicationId(state.clubId, state.operatorId),
        clubId: state.clubId,
        status: 'Pending',
        applicantName: selectedPlayerName,
        message,
        createdAt: new Date().toISOString(),
      };

      upsertClubApplicationInboxItem({
        id: provisionalApplication.id,
        clubId: state.clubId,
        clubName: getSelectedClubName(state.clubId, state.clubs.items),
        operatorId: state.operatorId,
        applicantName: selectedPlayerName,
        message: provisionalApplication.message,
        status: provisionalApplication.status,
        submittedAt: provisionalApplication.createdAt,
        source: 'api',
      });

      return {
        application: provisionalApplication,
        source: 'api' as const,
        warning:
          'The backend reported that a pending application already exists, so the local view was synchronized to pending.',
      };
    }

    throw error;
  }
}

export async function withdrawClubApplication(state: HomeClubApplicationState) {
  const applicationId = state.application.application?.id;

  if (!applicationId) {
    throw new Error('Application id is missing.');
  }

  if (isProvisionalClubApplicationId(applicationId)) {
    throw new Error(
      'This pending application has not been fully synchronized yet. Please refresh after the backend exposes the live application record.',
    );
  }

  const response = await sendAPI(
    new WithdrawClubApplicationAPI(state.clubId, applicationId, {
      operatorId: state.operatorId,
      note: state.withdrawNote,
    }),
  );
  const application = toClubApplicationMutationModel(
    state.clubId,
    state.application.application?.applicantName ?? getFallbackPlayerName(state),
    response,
  );
  updateClubApplicationInboxStatus(application.id, application.status);
  return { application, source: 'api' as const, warning: undefined };
}
