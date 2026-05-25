import { APIMessage } from '@/system/api';
import type { AppealListQuery, AppealTicketView, ListEnvelope } from '@/objects';
import type { AppealPriority, AppealStatus } from '@/objects/tournament/appeal';

export class AppealListAPI extends APIMessage<ListEnvelope<AppealTicketView>> {
  readonly status?: AppealStatus;
  readonly priority?: AppealPriority;
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
