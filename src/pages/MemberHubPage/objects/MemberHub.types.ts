import type { Role } from '@/objects';
import type { ClubApplicationView, ClubSummary } from '@/pages/objects/club';
import type { DashboardSummary } from '@/pages/objects/opsanalytics';

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

export const EMPTY_MEMBER_HUB_OPERATOR: MemberHubOperator = {
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

