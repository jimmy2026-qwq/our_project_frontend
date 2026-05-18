import type {
  AppealSummary,
  ListEnvelope,
} from '@/objects';
import type {
  AdjudicateAppealPayload,
  AppealFilters,
  UpdateAppealWorkflowPayload,
} from '@/objects/tournament/appeal';
import { toQueryString } from '@/lib/query';
import { request, sendJson } from '../../shared/http';
import {
  buildAdjudicateAppealRequest,
  buildUpdateAppealWorkflowRequest,
} from './transport';

export const appealsApi = {
  getAppeals(filters: AppealFilters) {
    return request<ListEnvelope<AppealSummary>>(`/appeals${toQueryString(filters)}`);
  },
  adjudicateAppeal(appealId: string, payload: AdjudicateAppealPayload) {
    return sendJson<AppealSummary>(
      `/appeals/${appealId}/adjudicate`,
      'POST',
      buildAdjudicateAppealRequest(payload),
    );
  },
  updateAppealWorkflow(appealId: string, payload: UpdateAppealWorkflowPayload) {
    return sendJson<AppealSummary>(
      `/appeals/${appealId}/workflow`,
      'POST',
      buildUpdateAppealWorkflowRequest(payload),
    );
  },
  buildAppealsPath(filters: AppealFilters) {
    return `/appeals${toQueryString(filters)}`;
  },
};
