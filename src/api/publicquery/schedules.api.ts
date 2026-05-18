import type { ListEnvelope } from '@/objects';
import type { PublicScheduleContract, ScheduleFilters } from '@/objects/publicquery';
import { toQueryString } from '@/lib/query';
import { mapPublicSchedule } from './mappers';
import { mapEnvelope, request } from '../shared/http';

export const publicSchedulesApi = {
  getPublicSchedules(filters: ScheduleFilters) {
    return request<ListEnvelope<PublicScheduleContract>>(
      `/public/schedules${toQueryString(filters)}`,
    ).then((envelope) => mapEnvelope(envelope, mapPublicSchedule));
  },
};
