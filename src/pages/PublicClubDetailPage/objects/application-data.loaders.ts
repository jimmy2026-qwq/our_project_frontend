import { upsertClubApplicationInboxItem } from '@/pages/objects/club';
import { ApiError } from '@/system/api/http';

import { clubsApi, getCurrentPlayer } from './application-data.api';
import { toClubApplicationViewModel } from './application-data.models';
import type {
  ApplicationState,
  ClubDirectoryState,
  PlayerContextState,
} from './application-data.types';

export async function loadJoinableClubs(): Promise<ClubDirectoryState> {
  try {
    const envelope = await clubsApi.getClubs({
      activeOnly: true,
      joinableOnly: true,
      limit: 20,
      offset: 0,
    });
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
}

export async function loadPlayerContext(
  operatorId: string,
  _fallbackDisplayName: string,
): Promise<PlayerContextState> {
  try {
    const player = await getCurrentPlayer(operatorId);
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
}

export async function loadCurrentPendingApplication(
  clubId: string,
  operatorId: string,
): Promise<ApplicationState | null> {
  try {
    const view = await clubsApi.getCurrentClubApplication(clubId, {
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
      return null;
    }

    throw error;
  }
}
