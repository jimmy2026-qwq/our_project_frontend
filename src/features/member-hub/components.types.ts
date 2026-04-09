import type {
  ApplicationInboxState,
  DashboardLoadState,
  MemberHubOperatorDirectory,
  MemberHubState,
} from './data';

export interface MemberHubPageSectionProps {
  directory: MemberHubOperatorDirectory;
  state: MemberHubState;
  playerPayload: DashboardLoadState;
  clubPayload: DashboardLoadState;
  inboxPayload: ApplicationInboxState;
  onReload: () => void;
  onChangeOperator: (operatorId: string) => void;
  onChangePlayer: (playerId: string) => void;
  onChangeClub: (clubId: string) => void;
  onReview: (applicationId: string, decision: 'approve' | 'reject') => void;
}

export interface DashboardPanelProps {
  title: string;
  path: string;
  payload: DashboardLoadState;
}

export interface DashboardPlaceholderProps extends DashboardPanelProps {
  roleNote: string;
}

export interface ApplicationInboxPanelProps {
  directory: MemberHubOperatorDirectory;
  state: MemberHubState;
  payload: ApplicationInboxState;
  onReview: (applicationId: string, decision: 'approve' | 'reject') => void;
}
