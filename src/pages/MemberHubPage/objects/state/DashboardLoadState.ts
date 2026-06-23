import type { DashboardSummary } from '@/pages/shared_objects/dashboard/OpsAnalyticsDashboard';

export interface DashboardLoadState {
  dashboard: DashboardSummary | null;
  warning?: string;
}
