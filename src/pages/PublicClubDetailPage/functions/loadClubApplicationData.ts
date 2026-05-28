import {
  GetCurrentClubApplicationAPI,
  ListClubsAPI,
} from '@/api/club';
import { GetCurrentPlayerAPI } from '@/api/player';
import { mapPlayerProfile } from '@/pages/objects/player';
import {
  mapClub,
  mapClubApplicationView,
  upsertClubApplicationInboxItem,
} from '@/pages/objects/club';
import { sendAPI } from '@/system/api';
import { ApiError } from '@/system/api/http';
import { mapEnvelope } from '@/system/api/http';

import type {
  ApplicationState,
  ClubDirectoryState,
  PlayerContextState,
} from '../objects/ClubApplication.types';
import { toClubApplicationViewModel } from './mapClubApplicationData';

export async function loadJoinableClubs(): Promise<ClubDirectoryState> {
  try {
    const envelope = await sendAPI(
      new ListClubsAPI({
        activeOnly: true,
        joinableOnly: true,
        limit: 20,
        offset: 0,
      }),
    ).then((response) => mapEnvelope(response, mapClub));
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
    const player = await sendAPI(new GetCurrentPlayerAPI(operatorId)).then(
      mapPlayerProfile,
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
}

export async function loadCurrentPendingApplication(
  clubId: string,
  operatorId: string,
): Promise<ApplicationState | null> {
  try {
    const view = await sendAPI(
      new GetCurrentClubApplicationAPI(clubId, { operatorId }),
    ).then(mapClubApplicationView);
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
