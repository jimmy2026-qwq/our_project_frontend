import type { ClubMembershipApplicationResponse } from '@/objects';
import type { ClubApplication } from '@/pages/objects/ClubApplicationViews';
import type { ClubSummary } from '@/pages/objects/ClubSummary';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';

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

export interface TrackedClubApplicationItem {
  id: string;
  clubId: string;
  clubName: string;
  operatorId: string;
  applicantName: string;
  message: string;
  status: ClubApplication['status'];
  submittedAt: string;
  source: DataSource;
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

export type ClubApplicationMutation = ClubMembershipApplicationResponse;
