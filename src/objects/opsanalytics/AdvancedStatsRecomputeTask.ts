import type { AdvancedStatsRecomputeTaskStatus } from './AdvancedStatsRecomputeTaskStatus';
import type { DashboardOwner } from './DashboardOwner';

export interface AdvancedStatsRecomputeTask {
  id: string;
  owner: DashboardOwner;
  reason: string;
  calculatorVersion: number;
  requestedAt: string;
  status: AdvancedStatsRecomputeTaskStatus;
  attempts: number;
  lastError: string | null;
  lastMatchRecordId: string | null;
  nextAttemptAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  deadLetteredAt: string | null;
  version: number;
}
