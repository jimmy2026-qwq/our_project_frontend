import { appealsApi } from './appeals';
import { recordsApi } from './records';
import { tablesApi } from './tables';
import { tournamentsApi } from './tournaments';

export type {
  AdjudicateAppealPayload,
  AppealFilters,
  UpdateAppealWorkflowPayload,
} from './appeals';
export type { RecordFilters } from './records';
export type {
  FileAppealPayload,
  ResetTablePayload,
  StartTablePayload,
  TableFilters,
  UpdateOwnReadyStatePayload,
  UpdateSeatStatePayload,
} from './tables';
export type {
  TournamentFilters,
} from './tournaments';
export type { TournamentStageDirectoryEntryContract } from './contracts/operations';

export const operationsApi = {
  ...tournamentsApi,
  ...tablesApi,
  ...recordsApi,
  ...appealsApi,
};
