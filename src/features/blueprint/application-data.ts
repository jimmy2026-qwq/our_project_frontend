import { authApi } from '@/api/auth';
import { clubsApi } from '@/api/clubs';
import { ApiError } from '@/api/http';
import type { PlayerProfile } from '@/domain/auth';
import type { ClubApplication } from '@/domain/clubs';
import type { ClubSummary } from '@/domain/public';
import {
  createProvisionalClubApplicationId,
  isProvisionalClubApplicationId,
  readClubApplicationInboxItem,
  readClubApplicationsByOperator,
  updateClubApplicationInboxStatus,
  upsertClubApplicationInboxItem,
} from '@/lib/club-applications';

export type DataSource = 'api' | 'mock';

export interface ClubDirectoryState {
  items: ClubSummary[];
  source: DataSource;
  warning?: string;
}

export interface PlayerContextState {
  player: PlayerProfile | null;
  source?: DataSource;
  warning?: string;
}

export interface ApplicationState {
  application: ClubApplication | null;
  source?: DataSource;
  warning?: string;
}

export interface HomeClubApplicationState {
  operatorId: string;
  operatorDisplayName: string;
  clubId: string;
  message: string;
  withdrawNote: string;
  clubs: ClubDirectoryState;
  playerContext: PlayerContextState;
  application: ApplicationState;
}

type ClubApplicationMutation = Awaited<ReturnType<typeof clubsApi.submitClubApplication>>;

export function formatDateTime(value: string) {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return 'Unavailable';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

export function getSelectedClubName(clubId: string, clubs: ClubSummary[]) {
  return clubs.find((club) => club.id === clubId)?.name ?? clubId;
}

export function getFallbackPlayerName(state: Pick<HomeClubApplicationState, 'operatorDisplayName' | 'operatorId'>) {
  return state.operatorDisplayName || state.operatorId;
}

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
      warning: error instanceof Error ? error.message : 'Unable to load joinable clubs.',
    };
  }
}

export async function loadPlayerContext(
  operatorId: string,
  _fallbackDisplayName: string,
): Promise<PlayerContextState> {
  try {
    const player = await authApi.getCurrentPlayer(operatorId);
    return {
      player,
      source: 'api',
    };
  } catch (error) {
    return {
      player: null,
      source: 'api',
      warning: error instanceof Error ? error.message : 'Unable to load current player context.',
    };
  }
}

export function getOperatorApplications(operatorId: string) {
  return readClubApplicationsByOperator(operatorId).slice(0, 3);
}

function toClubApplicationViewModel(view: {
  applicationId: string;
  clubId: string;
  applicant: PlayerProfile;
  message: string;
  status: ClubApplication['status'];
  submittedAt: string;
}) {
  return {
    id: view.applicationId,
    clubId: view.clubId,
    status: view.status,
    applicantName: view.applicant.displayName,
    message: view.message,
    createdAt: view.submittedAt,
  } satisfies ClubApplication;
}

function toClubApplicationMutationModel(
  clubId: string,
  fallbackApplicantName: string,
  application: ClubApplicationMutation,
): ClubApplication {
  return {
    id: application.id,
    clubId,
    status: application.status,
    applicantName: application.displayName.trim() || fallbackApplicantName,
    message: application.message?.trim() || '',
    createdAt: application.submittedAt,
  };
}

function getTrackedApplication(operatorId: string, clubId: string, applicationId?: string) {
  if (applicationId) {
    const tracked = readClubApplicationInboxItem(applicationId);

    if (tracked?.clubId === clubId) {
      return tracked;
    }
  }

  return (
    readClubApplicationsByOperator(operatorId)
      .filter((item) => item.clubId === clubId)
      .sort((left, right) => {
        const leftProvisional = isProvisionalClubApplicationId(left.id);
        const rightProvisional = isProvisionalClubApplicationId(right.id);

        if (leftProvisional !== rightProvisional) {
          return leftProvisional ? 1 : -1;
        }

        return Date.parse(right.submittedAt) - Date.parse(left.submittedAt);
      })[0] ?? null
  );
}

async function loadCurrentPendingApplication(
  clubId: string,
  operatorId: string,
): Promise<ApplicationState | null> {
  try {
    const view = await clubsApi.getCurrentClubApplication(clubId, { operatorId });
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

export async function loadTrackedApplication(
  operatorId: string,
  clubId: string,
  applicationId?: string,
): Promise<ApplicationState> {
  const tracked = getTrackedApplication(operatorId, clubId, applicationId);

  if (!applicationId && tracked?.status !== 'Rejected' && tracked?.status !== 'Withdrawn') {
    try {
      const current = await loadCurrentPendingApplication(clubId, operatorId);

      if (current) {
        return current;
      }
    } catch (error) {
      if (!tracked) {
        return {
          application: null,
          warning: error instanceof Error ? error.message : 'Unable to load the current club application.',
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
      warning: 'The backend no longer reports a pending application, so the provisional local record was preserved as rejected.',
    };
  }

  try {
    const view = await clubsApi.getClubApplication(clubId, tracked.id, { operatorId });
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
        warning: 'The backend no longer returned this application, so the local record was preserved as rejected.',
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
      warning: error instanceof Error ? error.message : 'Application status fallback to local bridge.',
    };
  }
}

export async function submitClubApplication(state: HomeClubApplicationState) {
  const selectedPlayerName =
    state.playerContext.player?.displayName ?? getFallbackPlayerName(state);
  const message = state.message.trim() || 'I would like to join next split.';

  try {
    const response = await clubsApi.submitClubApplication(state.clubId, {
      operatorId: state.operatorId,
      displayName: selectedPlayerName,
      message,
    });
    const application = toClubApplicationMutationModel(state.clubId, selectedPlayerName, response);
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
      const current = await loadCurrentPendingApplication(state.clubId, state.operatorId);

      if (current?.application) {
        return {
          application: current.application,
          source: current.source ?? 'api',
          warning: 'The backend reported that the pending application already exists, so the current live record was loaded instead.',
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
        warning: 'The backend reported that a pending application already exists, so the local view was synchronized to pending.',
      };
    }

    if (error instanceof ApiError) {
      throw error;
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
    throw new Error('This pending application has not been fully synchronized yet. Please refresh after the backend exposes the live application record.');
  }

  try {
    const response = await clubsApi.withdrawClubApplication(state.clubId, applicationId, {
      operatorId: state.operatorId,
      note: state.withdrawNote,
    });
    const application = toClubApplicationMutationModel(
      state.clubId,
      state.application.application?.applicantName ?? getFallbackPlayerName(state),
      response,
    );
    updateClubApplicationInboxStatus(application.id, application.status);
    return { application, source: 'api' as const, warning: undefined };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw error;
  }
}
