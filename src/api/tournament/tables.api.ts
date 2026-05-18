import type {
  FileAppealPayload,
  ListEnvelope,
  ResetTablePayload,
  StartTablePayload,
  TableFilters,
  TablePaifuDetail,
  TournamentTableContract,
  UpdateOwnReadyStatePayload,
  UpdateSeatStatePayload,
} from '@/objects';
import { toQueryString } from '@/lib/query';
import { request, sendJson } from '../shared/http';
import { mapTableDetail, mapTournamentTable } from './mappers';
import {
  buildFileAppealRequest,
  buildStartTableRequest,
  buildUpdateOwnReadyStateRequest,
  buildUpdateSeatStateRequest,
} from './tables.transport';

export const tablesApi = {
  getTables(filters: TableFilters) {
    return request<ListEnvelope<TournamentTableContract>>(`/tables${toQueryString(filters)}`).then((envelope) => ({
      ...envelope,
      items: envelope.items.map(mapTournamentTable),
    }));
  },
  getTable(tableId: string) {
    return request<TournamentTableContract>(`/tables/${tableId}`).then(mapTableDetail);
  },
  getTablePaifus(tableId: string) {
    return request<ListEnvelope<TablePaifuDetail>>(`/paifus${toQueryString({ tableId })}`);
  },
  startTable(tableId: string, payload: StartTablePayload = {}) {
    return sendJson<unknown>(`/tables/${tableId}/start`, 'POST', buildStartTableRequest(payload));
  },
  resetTable(tableId: string, payload: ResetTablePayload) {
    return sendJson<unknown>(`/tables/${tableId}/reset`, 'POST', payload);
  },
  fileAppeal(tableId: string, payload: FileAppealPayload) {
    return sendJson<unknown>(`/tables/${tableId}/appeals`, 'POST', buildFileAppealRequest(payload));
  },
  updateSeatState(tableId: string, payload: UpdateSeatStatePayload) {
    return sendJson<unknown>(
      `/tables/${tableId}/seats/${payload.seat}/state`,
      'POST',
      buildUpdateSeatStateRequest(payload),
    );
  },
  updateOwnReadyState(tableId: string, payload: UpdateOwnReadyStatePayload) {
    return sendJson<TournamentTableContract>(
      `/tables/${tableId}/ready`,
      'POST',
      buildUpdateOwnReadyStateRequest(payload),
    ).then(mapTableDetail);
  },
  getTournamentTables(tournamentId: string, stageId: string, filters: TableFilters) {
    return request<ListEnvelope<TournamentTableContract>>(
      `/tournaments/${tournamentId}/stages/${stageId}/tables${toQueryString(filters)}`,
    ).then((envelope) => ({
      ...envelope,
      items: envelope.items.map(mapTournamentTable),
    }));
  },
  buildTournamentTablesPath(tournamentId: string, stageId: string, filters: TableFilters) {
    return `/tournaments/${tournamentId}/stages/${stageId}/tables${toQueryString(filters)}`;
  },
};
