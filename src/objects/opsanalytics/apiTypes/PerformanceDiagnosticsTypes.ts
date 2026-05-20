export interface PerformanceStatusCount {
  statusCode: number;
  count: number;
}

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
