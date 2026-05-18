import type {
  AppealSummary,
  ListEnvelope,
} from '@/objects';
import { toQueryString } from '@/lib/query';
import { request, sendJson } from '../../shared/http';
import {
  buildAdjudicateAppealRequest,
  buildUpdateAppealWorkflowRequest,
} from './transport';

export interface AppealFilters {
  tournamentId?: string;
  stageId?: string;
  status?: 'Open' | 'UnderReview' | 'Resolved' | 'Rejected' | 'Escalated';
  tableId?: string;
  openedBy?: string;
  assigneeId?: string;
  priority?: string;
  overdueOnly?: boolean;
  limit?: number;
  offset?: number;
}

export interface AdjudicateAppealPayload {
  operatorId: string;
  decision: 'Resolve' | 'Reject' | 'Escalate';
  verdict: string;
  tableResolution?: 'RestorePriorState' | 'ContinueCurrentState' | 'ArchiveTable' | 'ForceResetTable';
  note?: string;
}

export interface UpdateAppealWorkflowPayload {
  operatorId: string;
  assigneeId?: string;
  clearAssignee?: boolean;
  priority?: string;
  dueAt?: string;
  clearDueAt?: boolean;
  note?: string;
}

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
