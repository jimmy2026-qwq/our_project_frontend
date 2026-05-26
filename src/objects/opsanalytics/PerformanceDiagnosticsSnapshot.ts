import type { PerformanceMetricEntry } from './PerformanceMetricEntry';

export interface PerformanceDiagnosticsSnapshot {
  startedAt: string;
  generatedAt: string;
  totalRequestCount: number;
  totalRepositoryCallCount: number;
  slowestRequests: PerformanceMetricEntry[];
  busiestRequests: PerformanceMetricEntry[];
  slowestRepositoryCalls: PerformanceMetricEntry[];
  busiestRepositoryCalls: PerformanceMetricEntry[];
}
