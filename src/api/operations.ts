import type {
  AppealSummary,
  ListEnvelope,
  MatchRecordSummary,
  TableStatus,
  TournamentTableSummary,
} from '../domain/models';
import { toQueryString } from '../lib/query';
import { encodeBackendOption, request, sendJson } from './http';

export interface RecordFilters {
  tournamentId?: string;
  stageId?: string;
  playerId?: string;
  limit?: number;
  offset?: number;
}

export interface AppealFilters {
  tournamentId?: string;
  status?: 'Open' | 'Resolved' | 'Rejected' | 'Escalated';
  tableId?: string;
  limit?: number;
  offset?: number;
}

export interface TableFilters {
  status?: TableStatus;
  playerId?: string;
  limit?: number;
  offset?: number;
}

export interface TournamentFilters {
  status?: string;
  adminId?: string;
  organizer?: string;
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

export type SeatWind = 'East' | 'South' | 'West' | 'North';

interface RawTableSeat {
  seat: SeatWind;
  playerId: string;
  disconnected?: boolean;
  ready?: boolean;
}

interface RawTournamentTable {
  id: string;
  stageId: string;
  tableNo: number;
  status: TableStatus;
  seats?: RawTableSeat[];
}

export interface TableSeatState {
  seat: SeatWind;
  playerId: string;
  disconnected: boolean;
  ready: boolean;
}

export interface TableDetail {
  id: string;
  stageId: string;
  tableNo: number;
  status: TableStatus;
  seats: TableSeatState[];
}

export interface PaifuFinalStanding {
  playerId: string;
  seat: SeatWind;
  finalPoints: number;
  placement: number;
  uma?: number;
  oka?: number;
}

export interface PaifuRoundSummary {
  descriptor: {
    roundWind: SeatWind;
    handNumber: number;
    honba: number;
  };
  actions: Array<{
    sequenceNo: number;
    actor?: string;
    actionType: string;
    tile?: string;
  }>;
  result: {
    outcome: string;
    winner?: string;
    target?: string;
    han?: number;
    fu?: number;
    points: number;
  };
}

export interface TablePaifuDetail {
  id: string;
  metadata: {
    tableId: string;
    tournamentId: string;
    stageId: string;
    recordedAt: string;
  };
  rounds: PaifuRoundSummary[];
  finalStandings: PaifuFinalStanding[];
}

interface RawTournamentDirectoryEntry {
  id: string;
  name: string;
}

interface RawStageLineupSeat {
  playerId: string;
  preferredWind?: string | null;
  reserve?: boolean;
}

interface RawStageLineupSubmission {
  id: string;
  clubId: string;
  submittedBy: string;
  submittedAt: string;
  seats: RawStageLineupSeat[];
  note?: string | null;
}

export interface TournamentStageDirectoryEntry {
  stageId: string;
  name: string;
  format: string;
  order: number;
  status: string;
  currentRound: number;
  roundCount: number;
  schedulingPoolSize: number;
  pendingTablePlanCount: number;
  scheduledTableCount: number;
}

export interface RawTournamentDetail {
  id: string;
  name: string;
  organizer: string;
  status: string;
  startsAt: string;
  endsAt: string;
  participatingClubs?: string[];
  participatingPlayers?: string[];
  whitelist?: unknown[];
  stages?: Array<{
    id: string;
    name: string;
    status: string;
    roundCount?: number;
    pendingTablePlans?: unknown[];
    lineupSubmissions?: RawStageLineupSubmission[];
  }>;
}

export interface UpdateSeatStatePayload {
  operatorId: string;
  seat: SeatWind;
  ready?: boolean;
  disconnected?: boolean;
  note?: string;
}

export type TournamentFormat = 'Swiss' | 'Knockout';

export interface CreateTournamentPayload {
  name: string;
  organizer: string;
  startsAt: string;
  endsAt: string;
  adminId?: string;
  stage: {
    name: string;
    format: TournamentFormat;
    order?: number;
    roundCount: number;
    schedulingPoolSize?: number;
  };
}

export interface SubmitStageLineupPayload {
  clubId: string;
  operatorId: string;
  playerIds: string[];
  note?: string;
}

export interface CreatedTournament {
  id: string;
  name: string;
  organizer: string;
  status?: string;
}

function mapTournamentTable(item: RawTournamentTable): TournamentTableSummary {
  const playerIds = item.seats?.map((seat) => seat.playerId) ?? [];

  return {
    id: item.id,
    stageId: item.stageId,
    tableCode: `Table ${String(item.tableNo).padStart(2, '0')}`,
    status: item.status,
    playerIds,
    seatCount: playerIds.length || 4,
  };
}

function mapTableDetail(item: RawTournamentTable): TableDetail {
  return {
    id: item.id,
    stageId: item.stageId,
    tableNo: item.tableNo,
    status: item.status,
    seats:
      item.seats?.map((seat) => ({
        seat: seat.seat,
        playerId: seat.playerId,
        disconnected: seat.disconnected ?? false,
        ready: seat.ready ?? false,
      })) ?? [],
  };
}

export const operationsApi = {
  getTournaments(filters: TournamentFilters = {}) {
    return request<ListEnvelope<RawTournamentDirectoryEntry>>(`/tournaments${toQueryString(filters)}`);
  },
  getTournamentStages(tournamentId: string) {
    return request<TournamentStageDirectoryEntry[]>(`/tournaments/${tournamentId}/stages`);
  },
  getTournament(tournamentId: string) {
    return request<RawTournamentDetail>(`/tournaments/${tournamentId}`);
  },
  publishTournament(tournamentId: string, operatorId?: string) {
    return sendJson<RawTournamentDetail>(`/tournaments/${tournamentId}/publish`, 'POST', {
      operatorId: encodeBackendOption(operatorId),
    });
  },
  scheduleTournamentStage(tournamentId: string, stageId: string, operatorId?: string) {
    return sendJson<RawTournamentDetail>(`/tournaments/${tournamentId}/stages/${stageId}/schedule`, 'POST', {
      operatorId: encodeBackendOption(operatorId),
    });
  },
  registerTournamentClub(tournamentId: string, clubId: string, operatorId?: string) {
    return sendJson<RawTournamentDetail>(`/tournaments/${tournamentId}/clubs/${clubId}`, 'POST', {
      operatorId: encodeBackendOption(operatorId),
    });
  },
  submitStageLineup(tournamentId: string, stageId: string, payload: SubmitStageLineupPayload) {
    return sendJson<RawTournamentDetail>(`/tournaments/${tournamentId}/stages/${stageId}/lineups`, 'POST', {
      clubId: payload.clubId,
      operatorId: payload.operatorId,
      seats: payload.playerIds.map((playerId) => ({
        playerId,
        preferredWind: [],
        reserve: false,
      })),
      note: payload.note ? [payload.note] : [],
    });
  },
  createTournament(payload: CreateTournamentPayload) {
    return sendJson<CreatedTournament>('/tournaments', 'POST', {
      name: payload.name,
      organizer: payload.organizer,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      adminId: payload.adminId ? [payload.adminId] : [],
      stages: [
        {
          id: [],
          name: payload.stage.name,
          format: payload.stage.format,
          order: payload.stage.order ?? 1,
          roundCount: payload.stage.roundCount,
          operatorId: [],
          ruleTemplateKey: [],
          advancementRuleType: [],
          cutSize: [],
          thresholdScore: [],
          targetTableCount: [],
          schedulingPoolSize: [payload.stage.schedulingPoolSize ?? 4],
        },
      ],
    });
  },
  getTable(tableId: string) {
    return request<RawTournamentTable>(`/tables/${tableId}`).then(mapTableDetail);
  },
  getTablePaifus(tableId: string) {
    return request<ListEnvelope<TablePaifuDetail>>(`/paifus${toQueryString({ tableId })}`);
  },
  startTable(tableId: string, payload: StartTablePayload = {}) {
    return sendJson<unknown>(`/tables/${tableId}/start`, 'POST', {
      operatorId: payload.operatorId ? [payload.operatorId] : [],
    });
  },
  resetTable(tableId: string, payload: ResetTablePayload) {
    return sendJson<unknown>(`/tables/${tableId}/reset`, 'POST', payload);
  },
  fileAppeal(tableId: string, payload: FileAppealPayload) {
    return sendJson<unknown>(`/tables/${tableId}/appeals`, 'POST', {
      playerId: payload.playerId,
      description: payload.description,
      attachments: [],
      priority: [],
      dueAt: [],
    });
  },
  updateSeatState(tableId: string, payload: UpdateSeatStatePayload) {
    return sendJson<unknown>(`/tables/${tableId}/seats/${payload.seat}/state`, 'POST', {
      operatorId: payload.operatorId,
      ...(payload.ready === undefined ? {} : { ready: payload.ready }),
      ...(payload.disconnected === undefined ? {} : { disconnected: payload.disconnected }),
      note: payload.note ? [payload.note] : [],
    });
  },
  getTournamentTables(tournamentId: string, stageId: string, filters: TableFilters) {
    return request<ListEnvelope<RawTournamentTable>>(
      `/tournaments/${tournamentId}/stages/${stageId}/tables${toQueryString(filters)}`,
    ).then((envelope) => ({
      ...envelope,
      items: envelope.items.map(mapTournamentTable),
    }));
  },
  getRecords(filters: RecordFilters) {
    return request<ListEnvelope<MatchRecordSummary>>(`/records${toQueryString(filters)}`);
  },
  getAppeals(filters: AppealFilters) {
    return request<ListEnvelope<AppealSummary>>(`/appeals${toQueryString(filters)}`);
  },
  buildTournamentTablesPath(tournamentId: string, stageId: string, filters: TableFilters) {
    return `/tournaments/${tournamentId}/stages/${stageId}/tables${toQueryString(filters)}`;
  },
  buildRecordsPath(filters: RecordFilters) {
    return `/records${toQueryString(filters)}`;
  },
  buildAppealsPath(filters: AppealFilters) {
    return `/appeals${toQueryString(filters)}`;
  },
  buildDictionaryEntryPath(key: string) {
    return `/dictionary/${key}`;
  },
  buildDictionaryListPath(prefix: string, limit = 20, offset = 0) {
    return `/dictionary${toQueryString({ prefix, limit, offset })}`;
  },
  buildDictionaryAuditPath(key: string, operatorId: string, eventType?: string, limit = 20) {
    return `/audits/dictionary/${key}${toQueryString({ operatorId, eventType, limit })}`;
  },
};
