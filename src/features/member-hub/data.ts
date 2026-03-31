import { apiClient } from '@/api/client';
import type { ClubApplicationView, DashboardSummary, Role } from '@/domain/models';
import {
  readClubApplicationInbox,
  type ClubApplicationInboxItem,
  updateClubApplicationInboxStatus,
} from '@/lib/club-applications';
import { mockClubs, mockDashboards } from '@/mocks/overview';

export type DataSource = 'api' | 'mock';

export interface DashboardLoadState {
  dashboard: DashboardSummary | null;
  source: DataSource;
  warning?: string;
}

export interface ApplicationInboxState {
  items: ClubApplicationView[];
  source: DataSource;
  warning?: string;
}

export interface MockOperator {
  id: string;
  label: string;
  role: Role;
  playerId: string;
  managedClubIds: string[];
}

export interface MemberHubState {
  operatorId: string;
  playerId: string;
  clubId: string;
}

export const mockOperators: MockOperator[] = [
  {
    id: 'player-registered-1',
    label: 'Aoi / Registered Player',
    role: 'RegisteredPlayer',
    playerId: 'player-registered-1',
    managedClubIds: [],
  },
  {
    id: 'player-admin',
    label: 'Saki / Club Admin',
    role: 'ClubAdmin',
    playerId: 'player-registered-2',
    managedClubIds: ['club-1', 'club-2'],
  },
];

export const DEFAULT_MEMBER_HUB_STATE: MemberHubState = {
  operatorId: mockOperators[0].id,
  playerId: mockOperators[0].playerId,
  clubId: 'club-1',
};

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function findMockDashboard(ownerId: string) {
  return mockDashboards.find((item) => item.ownerId === ownerId) ?? null;
}

export async function loadPlayerDashboard(playerId: string, operatorId: string): Promise<DashboardLoadState> {
  try {
    const dashboard = await apiClient.getPlayerDashboard(playerId, operatorId);
    return { dashboard, source: 'api' };
  } catch (error) {
    return {
      dashboard: findMockDashboard(playerId),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Player dashboard fallback to mock.',
    };
  }
}

export async function loadClubDashboard(clubId: string, operatorId: string): Promise<DashboardLoadState> {
  try {
    const dashboard = await apiClient.getClubDashboard(clubId, operatorId);
    return { dashboard, source: 'api' };
  } catch (error) {
    return {
      dashboard: findMockDashboard(clubId),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Club dashboard fallback to mock.',
    };
  }
}

function toApplicationView(item: ClubApplicationInboxItem): ClubApplicationView {
  return {
    applicationId: item.id,
    clubId: item.clubId,
    clubName: item.clubName,
    applicant: {
      playerId: item.operatorId,
      displayName: item.applicantName,
    },
    submittedAt: item.submittedAt,
    message: item.message,
    status: item.status,
    reviewedBy: null,
    reviewedByDisplayName: null,
    reviewedAt: null,
    reviewNote: null,
    withdrawnByPrincipalId: null,
    canReview: item.status === 'Pending',
    canWithdraw: false,
  };
}

export async function loadClubApplicationInbox(
  clubId: string,
  operatorId: string,
  role: Role,
): Promise<ApplicationInboxState> {
  if (role !== 'ClubAdmin') {
    return {
      items: [],
      source: 'mock',
    };
  }

  try {
    const envelope = await apiClient.getClubApplications(clubId, {
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
        .map(toApplicationView),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Application inbox fallback to mock.',
    };
  }
}

export function getActiveOperator(operatorId: string) {
  return mockOperators.find((operator) => operator.id === operatorId) ?? mockOperators[0];
}

export function normalizeClubIdForOperator(state: MemberHubState) {
  const activeOperator = getActiveOperator(state.operatorId);

  if (activeOperator.managedClubIds.includes(state.clubId)) {
    return state.clubId;
  }

  return activeOperator.managedClubIds[0] ?? mockClubs[0].id;
}

export async function reviewApplication(
  clubId: string,
  applicationId: string,
  operatorId: string,
  decision: 'approve' | 'reject',
) {
  try {
    await apiClient.reviewClubApplication(clubId, applicationId, {
      operatorId,
      decision,
      note: `${decision}d from member hub`,
    });
  } catch {
    updateClubApplicationInboxStatus(applicationId, decision === 'approve' ? 'Approved' : 'Rejected');
  }
}
