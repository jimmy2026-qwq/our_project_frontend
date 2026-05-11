import type { DemoSummary } from '@/domain';
import { toQueryString } from '@/lib/query';
import type { DemoSummaryQuery } from './auth.shared';
import { request } from './http';

export const authDemoApi = {
  getDemoSummary(filters: DemoSummaryQuery = {}) {
    return request<DemoSummary>(
      `/demo/summary${toQueryString({
        variant: filters.variant ?? 'Basic',
        bootstrapIfMissing: filters.bootstrapIfMissing ?? true,
        refreshDerived: filters.refreshDerived ?? true,
      })}`,
    );
  },
};
