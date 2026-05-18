import type { DemoSummary } from '@/objects';
import { toQueryString } from '@/lib/query';
import type { DemoSummaryQuery } from './requests/auth.requests';
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
