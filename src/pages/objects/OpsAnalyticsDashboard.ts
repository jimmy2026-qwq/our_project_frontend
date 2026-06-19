import type { DashboardMetric } from './DashboardMetric';

export interface DashboardSummary {
  ownerId: string;
  ownerType: 'player' | 'club';
  headline: string;
  metrics: DashboardMetric[];
}
