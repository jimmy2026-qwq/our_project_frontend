import { APIMessage } from '@/system/api';
import type { AppealListQuery, AppealTicketView, ListEnvelope } from '@/objects';

export class AppealListAPI extends APIMessage<ListEnvelope<AppealTicketView>> {
  readonly status?: string;
  readonly priority?: string;
  readonly tournamentId?: string;
  readonly stageId?: string;
  readonly tableId?: string;
  readonly openedBy?: string;
  readonly assigneeId?: string;
  readonly overdueOnly?: boolean;
  readonly dueBefore?: string;
  readonly dueAfter?: string;
  readonly asOf?: string;
  readonly limit?: number;
  readonly offset?: number;

  constructor(filters: AppealListQuery = {}) {
    super();
    Object.assign(this, filters);
  }
}
