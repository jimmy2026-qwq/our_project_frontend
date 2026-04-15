import type { AuthSession } from '@/domain/auth';
import type { Role } from '@/domain/common';
import type { ClubApplicationView } from '@/domain/clubs';
import type { DashboardSummary } from '@/domain/dashboard';
import type { ClubSummary } from '@/domain/public';
import type { ClubApplicationInboxItem } from '@/lib/club-applications';

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

const EMPTY_OPERATOR: MemberHubOperator = {
  id: '',
  label: 'No operator',
  role: 'RegisteredPlayer',
  playerId: '',
  managedClubIds: [],
};

export const DEFAULT_MEMBER_HUB_STATE: MemberHubState = {
  operatorId: '',
  playerId: '',
  clubId: '',
};

export const DEFAULT_MEMBER_HUB_DIRECTORY: MemberHubOperatorDirectory = {
  items: [],
  clubsById: {},
  source: 'api',
};

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function uniqueById(items: MemberHubOperator[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

export function createClubsById(items: ClubSummary[]) {
  return Object.fromEntries(items.map((club) => [club.id, club] as const));
}

export function buildFallbackDirectory(session: AuthSession | null): MemberHubOperatorDirectory {
  const sessionOperatorId = session?.user.operatorId ?? session?.user.userId ?? '';
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
    items: currentOperator ? [currentOperator] : [],
    clubsById: {},
    source: 'api',
  };
}

export function createMemberHubState(
  directory: MemberHubOperatorDirectory,
  preferredOperatorId?: string,
): MemberHubState {
  const activeOperator =
    directory.items.find((operator) => operator.id === preferredOperatorId) ?? directory.items[0] ?? EMPTY_OPERATOR;
  const firstClubId = activeOperator.managedClubIds[0] ?? Object.keys(directory.clubsById)[0] ?? '';

  return {
    operatorId: activeOperator.id,
    playerId: activeOperator.playerId,
    clubId: firstClubId,
  };
}

export function toApplicationView(item: ClubApplicationInboxItem): ClubApplicationView {
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

export function getActiveOperator(directory: MemberHubOperatorDirectory, operatorId: string) {
  return directory.items.find((operator) => operator.id === operatorId) ?? directory.items[0] ?? EMPTY_OPERATOR;
}

export function normalizeClubIdForOperator(directory: MemberHubOperatorDirectory, state: MemberHubState) {
  const activeOperator = getActiveOperator(directory, state.operatorId);

  if (activeOperator.managedClubIds.includes(state.clubId)) {
    return state.clubId;
  }

  return activeOperator.managedClubIds[0] ?? Object.keys(directory.clubsById)[0] ?? '';
}
