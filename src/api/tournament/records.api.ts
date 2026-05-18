import type {
  ListEnvelope,
  MatchRecordSummary,
  RecordFilters,
} from '@/objects';
import { toQueryString } from '@/lib/query';
import { request } from '../shared/http';

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
