import type { ApplicationState } from '@/pages/PublicClubDetailPage/objects/application/ApplicationState';
import type { ClubDirectoryState } from '@/pages/PublicClubDetailPage/objects/application/ClubDirectoryState';
import type { PlayerContextState } from '@/pages/PublicClubDetailPage/objects/application/PlayerContextState';

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
