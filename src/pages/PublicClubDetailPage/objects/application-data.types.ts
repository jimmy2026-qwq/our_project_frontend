import type { ClubMembershipApplicationResponse } from '@/objects';
import type {
  ClubApplication,
  ClubSummary,
} from '@/pages/objects/club';
import type { PlayerProfile } from '@/pages/objects/player';

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

export type ClubApplicationMutation = ClubMembershipApplicationResponse;
