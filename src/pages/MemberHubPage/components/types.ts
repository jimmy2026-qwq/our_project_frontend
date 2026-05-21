import type {
  ApplicationInboxState,
  DashboardLoadState,
  MemberHubOperatorDirectory,
  MemberHubState,
} from '../objects/data';

export interface MemberHubPageSectionProps {
  directory: MemberHubOperatorDirectory;
  state: MemberHubState;
  playerDashboardState: DashboardLoadState;
  clubDashboardState: DashboardLoadState;
  applicationInboxState: ApplicationInboxState;
  onReload: () => void;
  onChangeOperator: (operatorId: string) => void;
  onChangePlayer: (playerId: string) => void;
  onChangeClub: (clubId: string) => void;
  onReview: (applicationId: string, decision: 'approve' | 'reject') => void;
}

export interface DashboardPanelProps {
  title: string;
  path: string;
  loadState: DashboardLoadState;
}

export interface DashboardPlaceholderProps extends DashboardPanelProps {
  roleNote: string;
}

export interface ApplicationInboxPanelProps {
  directory: MemberHubOperatorDirectory;
  state: MemberHubState;
  inboxState: ApplicationInboxState;
  onReview: (applicationId: string, decision: 'approve' | 'reject') => void;
}
