import type { ListEnvelope } from '@/domain';
import { toQueryString } from '@/lib/query';
import type { PublicScheduleContract } from './contracts/public';
import { mapPublicSchedule } from './public.mappers';
import { mapEnvelope, request } from './http';
import type { ScheduleFilters } from './public.shared';

export const publicSchedulesApi = {
  getPublicSchedules(filters: ScheduleFilters) {
    return request<ListEnvelope<PublicScheduleContract>>(
      `/public/schedules${toQueryString(filters)}`,
    ).then((envelope) => mapEnvelope(envelope, mapPublicSchedule));
  },
};
