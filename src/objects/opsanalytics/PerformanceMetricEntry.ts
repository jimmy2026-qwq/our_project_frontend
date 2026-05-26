import type { PerformanceStatusCount } from './PerformanceStatusCount';

export interface PerformanceMetricEntry {
  key: string;
  count: number;
  totalMillis: number;
  averageMillis: number;
  maxMillis: number;
  lastMillis: number;
  lastUpdatedAt: string;
  statusCounts: PerformanceStatusCount[];
}
