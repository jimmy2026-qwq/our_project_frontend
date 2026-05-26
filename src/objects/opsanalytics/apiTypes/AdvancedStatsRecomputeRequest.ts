import type { AdvancedStatsBackfillMode } from '../AdvancedStatsBackfillMode';

export interface AdvancedStatsRecomputeRequest {
  operatorId: string;
  mode?: AdvancedStatsBackfillMode;
  ownerType?: 'player' | 'club';
  ownerId?: string;
  reason?: string;
  limit?: number;
}
