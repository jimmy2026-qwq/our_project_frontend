import { appealsApi } from './appeal';
import { recordsApi } from './records.api';
import { tablesApi } from './tables.api';
import { tournamentsApi } from './tournaments.api';

export type {
  AdjudicateAppealPayload,
  AppealFilters,
  UpdateAppealWorkflowPayload,
} from './appeal';
export type { RecordFilters } from './records.api';
export type {
  FileAppealPayload,
  ResetTablePayload,
  StartTablePayload,
  TableFilters,
  UpdateOwnReadyStatePayload,
  UpdateSeatStatePayload,
} from './tables.api';
export type {
  TournamentFilters,
} from './tournaments.api';
export type { TournamentStageDirectoryEntryContract } from './responses/tournament.responses';

export const tournamentApi = {
  ...tournamentsApi,
  ...tablesApi,
  ...recordsApi,
  ...appealsApi,
};
