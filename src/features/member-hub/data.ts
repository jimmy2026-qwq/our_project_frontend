import { apiClient } from '@/api/client';
import type { AuthSession, ClubApplicationView, ClubSummary, DashboardSummary, Role } from '@/domain/models';
import {
  readClubApplicationInbox,
  type ClubApplicationInboxItem,
  updateClubApplicationInboxStatus,
  upsertClubApplicationInboxItem,
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

export interface MemberHubOperator {
  id: string;
  label: string;
  role: Role;
  playerId: string;
  managedClubIds: string[];
}

export interface MemberHubOperatorDirectory {
  items: MemberHubOperator[];
  clubsById: Record<string, ClubSummary>;
  source: DataSource;
  warning?: string;
}

export interface MemberHubState {
  operatorId: string;
  playerId: string;
  clubId: string;
}

export const fallbackOperators: MemberHubOperator[] = [
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
  operatorId: fallbackOperators[0].id,
  playerId: fallbackOperators[0].playerId,
  clubId: 'club-1',
};

export const DEFAULT_MEMBER_HUB_DIRECTORY: MemberHubOperatorDirectory = {
  items: fallbackOperators,
  clubsById: createClubsById(mockClubs),
  source: 'mock',
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

function uniqueById(items: MemberHubOperator[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

function createClubsById(items: ClubSummary[]) {
  return Object.fromEntries(items.map((club) => [club.id, club] as const));
}

function buildFallbackDirectory(session: AuthSession | null): MemberHubOperatorDirectory {
  const sessionOperatorId = session?.user.operatorId ?? session?.user.userId;
  const sessionDisplayName = session?.user.displayName ?? 'Current User';
  const currentOperator =
    sessionOperatorId && session?.user.roles.isRegisteredPlayer
      ? {
          id: sessionOperatorId,
          label: `${sessionDisplayName} / Registered Player`,
          role: 'RegisteredPlayer' as const,
          playerId: sessionOperatorId,
          managedClubIds: [],
        }
      : null;

  return {
    items: uniqueById(currentOperator ? [currentOperator, ...fallbackOperators] : fallbackOperators),
    clubsById: createClubsById(mockClubs),
    source: 'mock',
  };
}

export async function loadMemberHubOperatorDirectory(
  session: AuthSession | null,
): Promise<MemberHubOperatorDirectory> {
  const fallback = buildFallbackDirectory(session);
  const currentOperatorId = session?.user.operatorId ?? session?.user.userId;
  const currentDisplayName = session?.user.displayName ?? 'Current User';

  try {
    const currentOperatorClubs = currentOperatorId
      ? await apiClient.getClubs({
          adminId: currentOperatorId,
          activeOnly: true,
          limit: 20,
          offset: 0,
        })
      : { items: [] as ClubSummary[] };
    const operators: MemberHubOperator[] = [];

    if (currentOperatorId && session?.user.roles.isRegisteredPlayer) {
      const isAdmin = currentOperatorClubs.items.length > 0;
      operators.push({
        id: currentOperatorId,
        label: `${currentDisplayName} / ${isAdmin ? 'Club Admin' : 'Registered Player'}`,
        role: isAdmin ? 'ClubAdmin' : 'RegisteredPlayer',
        playerId: currentOperatorId,
        managedClubIds: isAdmin ? currentOperatorClubs.items.map((club) => club.id) : [],
      });
    }

    const summary =
      operators.some((operator) => operator.role === 'ClubAdmin')
        ? null
        : await apiClient.getDemoSummary({
            bootstrapIfMissing: false,
            refreshDerived: false,
          });
    const recommendedOperatorId = summary?.recommendedOperatorId?.trim();
    const recommendedClubs =
      recommendedOperatorId && recommendedOperatorId !== currentOperatorId
        ? await apiClient.getClubs({
            adminId: recommendedOperatorId,
            activeOnly: true,
            limit: 20,
            offset: 0,
          })
        : { items: [] as ClubSummary[] };

    if (recommendedOperatorId && recommendedOperatorId !== currentOperatorId && recommendedClubs.items.length > 0) {
      operators.push({
        id: recommendedOperatorId,
        label: 'Demo Admin / Club Admin',
        role: 'ClubAdmin',
        playerId: recommendedOperatorId,
        managedClubIds: recommendedClubs.items.map((club) => club.id),
      });
    }

    if (operators.length === 0) {
      return fallback;
    }

    return {
      items: uniqueById(operators),
      clubsById: createClubsById([...currentOperatorClubs.items, ...recommendedClubs.items]),
      source: 'api',
    };
  } catch (error) {
    return {
      ...fallback,
      warning: error instanceof Error ? error.message : 'Operator directory fallback to mock.',
    };
  }
}

export function createMemberHubState(
  directory: MemberHubOperatorDirectory,
  preferredOperatorId?: string,
): MemberHubState {
  const activeOperator =
    directory.items.find((operator) => operator.id === preferredOperatorId) ?? directory.items[0] ?? fallbackOperators[0];

  return {
    operatorId: activeOperator.id,
    playerId: activeOperator.playerId,
    clubId: activeOperator.managedClubIds[0] ?? Object.keys(directory.clubsById)[0] ?? mockClubs[0].id,
  };
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

export function getActiveOperator(directory: MemberHubOperatorDirectory, operatorId: string) {
  return directory.items.find((operator) => operator.id === operatorId) ?? directory.items[0] ?? fallbackOperators[0];
}

export function normalizeClubIdForOperator(directory: MemberHubOperatorDirectory, state: MemberHubState) {
  const activeOperator = getActiveOperator(directory, state.operatorId);

  if (activeOperator.managedClubIds.includes(state.clubId)) {
    return state.clubId;
  }

  return activeOperator.managedClubIds[0] ?? Object.keys(directory.clubsById)[0] ?? mockClubs[0].id;
}

export async function reviewApplication(
  clubId: string,
  applicationId: string,
  operatorId: string,
  decision: 'approve' | 'reject',
) {
  try {
    const application = await apiClient.reviewClubApplication(clubId, applicationId, {
      operatorId,
      decision,
      note: `${decision}d from member hub`,
    });
    upsertClubApplicationInboxItem({
      id: application.applicationId,
      clubId: application.clubId,
      clubName: application.clubName,
      operatorId: application.applicant.playerId,
      applicantName: application.applicant.displayName,
      message: application.message,
      status: application.status,
      submittedAt: application.submittedAt,
      source: 'api',
    });
    return { source: 'api' as const };
  } catch {
    updateClubApplicationInboxStatus(applicationId, decision === 'approve' ? 'Approved' : 'Rejected');
    return {
      source: 'mock' as const,
      warning: 'The member hub review used the local inbox fallback.',
    };
  }
}
