import type { StageStandingEntry } from './StageStandingEntry';

export interface StageRankingSnapshot {
  tournamentId: string;
  stageId: string;
  generatedAt: string;
  entries: StageStandingEntry[];
  archivedTableCount: number;
  scheduledTableCount: number;
}
