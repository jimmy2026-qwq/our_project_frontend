import type {
  ListEnvelope,
  MatchRecordSummary,
} from '@/domain';
import { toQueryString } from '@/lib/query';
import { request } from './http';

export interface RecordFilters {
  tournamentId?: string;
  stageId?: string;
  playerId?: string;
  limit?: number;
  offset?: number;
}

export const recordsApi = {
  getRecords(filters: RecordFilters) {
    return request<ListEnvelope<MatchRecordSummary>>(`/records${toQueryString(filters)}`);
  },
  buildRecordsPath(filters: RecordFilters) {
    return `/records${toQueryString(filters)}`;
  },
  buildDictionaryEntryPath(key: string) {
    return `/dictionary/${key}`;
  },
  buildDictionaryListPath(prefix: string, limit = 20, offset = 0) {
    return `/dictionary${toQueryString({ prefix, limit, offset })}`;
  },
  buildDictionaryAuditPath(key: string, operatorId: string, eventType?: string, limit = 20) {
    return `/audits/dictionary/${key}${toQueryString({ operatorId, eventType, limit })}`;
  },
};
