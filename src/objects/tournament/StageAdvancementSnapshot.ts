import type { StageStandingEntry } from './StageStandingEntry';

export interface StageAdvancementSnapshot {
  tournamentId: string;
  stageId: string;
  generatedAt: string;
  rule: string;
  standings: StageStandingEntry[];
  qualifiedPlayerIds: string[];
  reservePlayerIds: string[];
  summary: string;
}
