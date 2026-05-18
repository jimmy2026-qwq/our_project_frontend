import type {
  ListEnvelope,
  SeatWind,
  TablePaifuDetail,
  TableStatus,
} from '@/objects';
import { toQueryString } from '@/lib/query';
import type { TournamentTableContract } from './responses/tournament.responses';
import { request, sendJson } from '../shared/http';
import { mapTableDetail, mapTournamentTable } from './mappers';
import {
  buildFileAppealRequest,
  buildStartTableRequest,
  buildUpdateOwnReadyStateRequest,
  buildUpdateSeatStateRequest,
} from './tables.transport';

export interface TableFilters {
  status?: TableStatus;
  playerId?: string;
  limit?: number;
  offset?: number;
}

export interface StartTablePayload {
  operatorId?: string;
}

export interface ResetTablePayload {
  operatorId: string;
  note: string;
}

export interface FileAppealPayload {
  playerId: string;
  description: string;
}

export interface UpdateSeatStatePayload {
  operatorId: string;
  seat: SeatWind;
  ready?: boolean;
  disconnected?: boolean;
  note?: string;
}

export interface UpdateOwnReadyStatePayload {
  operatorId: string;
  ready?: boolean;
  note?: string;
}

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
