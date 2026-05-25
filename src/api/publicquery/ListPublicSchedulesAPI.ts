import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { ListEnvelope, PublicScheduleView, ScheduleQuery } from '@/objects';
import type { StageStatus, TournamentStatus } from '@/objects/tournament';
import type { BackendOption } from '@/system/api/backend-option.transport';

export class ListPublicSchedulesAPI extends APIMessage<ListEnvelope<PublicScheduleView>> {
  readonly tournamentStatus: BackendOption<TournamentStatus>;
  readonly stageStatus: BackendOption<StageStatus>;
  readonly limit: number[];
  readonly offset: number[];

  constructor(filters: ScheduleQuery = {}) {
    super();
    this.tournamentStatus = encodeBackendOption(filters.tournamentStatus);
    this.stageStatus = encodeBackendOption(filters.stageStatus);
    this.limit = encodeBackendOption(filters.limit);
    this.offset = encodeBackendOption(filters.offset);
  }
}
