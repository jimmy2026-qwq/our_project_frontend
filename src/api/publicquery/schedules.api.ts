import type { ListEnvelope } from '@/objects';
import { toQueryString } from '@/lib/query';
import type { PublicScheduleContract } from './responses/publicquery.responses';
import { mapPublicSchedule } from './mappers';
import { mapEnvelope, request } from '../shared/http';
import type { ScheduleFilters } from './requests/publicquery.requests';

export const publicSchedulesApi = {
  getPublicSchedules(filters: ScheduleFilters) {
    return request<ListEnvelope<PublicScheduleContract>>(
      `/public/schedules${toQueryString(filters)}`,
    ).then((envelope) => mapEnvelope(envelope, mapPublicSchedule));
  },
};
