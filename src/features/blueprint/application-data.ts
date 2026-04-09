import { authApi } from '@/api/auth';
import { clubsApi } from '@/api/clubs';
import { ApiError } from '@/api/http';
import type { PlayerProfile } from '@/domain/auth';
import type { ClubApplication } from '@/domain/clubs';
import type { ClubSummary } from '@/domain/public';
import {
  readClubApplicationInboxItem,
  readClubApplicationsByOperator,
  updateClubApplicationInboxStatus,
  upsertClubApplicationInboxItem,
} from '@/lib/club-applications';
import { mockClubs } from '@/mocks/overview';

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

const mockApplications = new Map<string, ClubApplication>();

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

export function createMockClubApplication(
  clubId: string,
  operatorId: string,
  applicantName: string,
  message: string,
): ClubApplication {
  const application: ClubApplication = {
    id: `membership-${Date.now()}`,
    clubId,
    status: 'Pending',
    applicantName,
    message,
    createdAt: new Date().toISOString(),
  };
  mockApplications.set(`${clubId}:${operatorId}`, application);
  return application;
}

export function withdrawMockClubApplication(clubId: string, operatorId: string) {
  const key = `${clubId}:${operatorId}`;
  const existing = mockApplications.get(key);

  if (!existing) {
    throw new Error('Mock application not found.');
  }

  const updated: ClubApplication = {
    ...existing,
    status: 'Withdrawn',
  };
  mockApplications.set(key, updated);
  return updated;
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
      items: mockClubs,
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Club directory fallback to mock.',
    };
  }
}

export async function loadPlayerContext(
  operatorId: string,
  fallbackDisplayName: string,
): Promise<PlayerContextState> {
  try {
    const player = await authApi.getCurrentPlayer(operatorId);
    return {
      player,
      source: 'api',
    };
  } catch (error) {
    return {
      player: {
        playerId: operatorId,
        displayName: fallbackDisplayName,
      },
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Current player fallback to mock.',
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
      .sort((left, right) => Date.parse(right.submittedAt) - Date.parse(left.submittedAt))[0] ?? null
  );
}

export async function loadTrackedApplication(
  operatorId: string,
  clubId: string,
  applicationId?: string,
): Promise<ApplicationState> {
  const tracked = getTrackedApplication(operatorId, clubId, applicationId);

  if (!tracked) {
    return {
      application: null,
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
    return { application, source: 'api' as const };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const application = createMockClubApplication(state.clubId, state.operatorId, selectedPlayerName, message);
    upsertClubApplicationInboxItem({
      id: application.id,
      clubId: state.clubId,
      clubName: getSelectedClubName(state.clubId, state.clubs.items),
      operatorId: state.operatorId,
      applicantName: selectedPlayerName,
      message: application.message,
      status: application.status,
      submittedAt: application.createdAt,
      source: 'mock',
    });
    return {
      application,
      source: 'mock' as const,
      warning: error instanceof Error ? error.message : 'Club application fallback to mock.',
    };
  }
}

export async function withdrawClubApplication(state: HomeClubApplicationState) {
  const applicationId = state.application.application?.id;

  if (!applicationId) {
    throw new Error('Application id is missing.');
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
    return { application, source: 'api' as const };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const application = withdrawMockClubApplication(state.clubId, state.operatorId);
    updateClubApplicationInboxStatus(application.id, application.status);
    return {
      application,
      source: 'mock' as const,
      warning: error instanceof Error ? error.message : 'Withdraw request fallback to mock.',
    };
  }
}
