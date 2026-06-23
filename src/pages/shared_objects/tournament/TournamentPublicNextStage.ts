import type { StageStatus } from '@/objects';

export interface TournamentPublicNextStage {
  nextStageId: string;
  nextStageName: string;
  nextStageStatus: StageStatus;
  nextScheduledAt: string;
}
