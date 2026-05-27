import { DEFAULT_PUBLIC_HALL_STATE } from './state';
import type { PublicHallState } from './types';

export function getPublicHallHomeRequestState(
  state: PublicHallState,
): PublicHallState {
  return {
    activeView: DEFAULT_PUBLIC_HALL_STATE.activeView,
    scheduleTournamentStatus: state.scheduleTournamentStatus,
    scheduleStageStatus: state.scheduleStageStatus,
    leaderboardClubId: state.leaderboardClubId,
    leaderboardStatus: state.leaderboardStatus,
    clubActiveOnly: state.clubActiveOnly,
  };
}

export function getPublicHallLeaderboardRequestState(
  state: PublicHallState,
): PublicHallState {
  return {
    activeView: DEFAULT_PUBLIC_HALL_STATE.activeView,
    scheduleTournamentStatus:
      DEFAULT_PUBLIC_HALL_STATE.scheduleTournamentStatus,
    scheduleStageStatus: DEFAULT_PUBLIC_HALL_STATE.scheduleStageStatus,
    leaderboardClubId: state.leaderboardClubId,
    leaderboardStatus: state.leaderboardStatus,
    clubActiveOnly: DEFAULT_PUBLIC_HALL_STATE.clubActiveOnly,
  };
}
