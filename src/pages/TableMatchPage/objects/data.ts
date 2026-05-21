import {
  AppealFileAPI,
  TournamentTableGetAPI,
  TournamentTableUpdateOwnReadyAPI,
} from '@/api/tournament';
import type {
  TournamentTableView,
  UpdateOwnTableReadyStateRequest,
} from '@/objects';
import type { FileAppealRequest } from '@/objects/tournament/appeal';
import { mapTableDetail } from '@/pages/objects/tournament';
import { sendAPI } from '@/system/api';

export function getTable(tableId: string) {
  return sendAPI<TournamentTableView>(new TournamentTableGetAPI(tableId)).then(
    mapTableDetail,
  );
}

export function fileAppeal(tableId: string, payload: FileAppealRequest) {
  return sendAPI(new AppealFileAPI(tableId, payload));
}

export function updateOwnReadyState(
  tableId: string,
  payload: UpdateOwnTableReadyStateRequest,
) {
  return sendAPI<TournamentTableView>(
    new TournamentTableUpdateOwnReadyAPI(tableId, payload),
  ).then(mapTableDetail);
}
