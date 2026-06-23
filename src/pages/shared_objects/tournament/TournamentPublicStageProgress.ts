import type { TournamentPublicStage } from './TournamentPublicStage';

export interface TournamentPublicStageProgress {
  stageCount: number;
  activeStageCount?: number;
  participantCount?: number;
  stages?: TournamentPublicStage[];
}
