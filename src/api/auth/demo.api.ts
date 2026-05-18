import type { DemoSummary } from '@/objects';
import type { DemoSummaryQuery } from '@/objects/auth';
import { toQueryString } from '@/lib/query';
import { request } from '../shared/http';

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
