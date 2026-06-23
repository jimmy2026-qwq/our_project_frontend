import { StageStatus, TournamentStatuses, type TournamentStatus } from '@/objects';

import { PublicHallLeaderboardDisplayStatus } from '@/pages/PublicHallPage/objects/PublicHallLeaderboardDisplayStatus';
import { PublicView } from '../navigation/PublicView';

export interface PublicHallState {
  activeView: PublicView;
  scheduleTournamentStatus?: TournamentStatus;
  scheduleStageStatus?: StageStatus;
  leaderboardClubId: string;
  leaderboardStatus?: PublicHallLeaderboardDisplayStatus;
  clubActiveOnly: boolean;
}

export const DEFAULT_PUBLIC_HALL_STATE: PublicHallState = {
  activeView: PublicView.Schedules,
  scheduleTournamentStatus: TournamentStatuses.InProgress,
  scheduleStageStatus: StageStatus.Active,
  leaderboardClubId: '',
  leaderboardStatus: PublicHallLeaderboardDisplayStatus.Active,
  clubActiveOnly: true,
};
