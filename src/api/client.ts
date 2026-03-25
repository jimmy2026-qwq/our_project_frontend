import { toQueryString } from '../lib/query';
import type {
  ClubSummary,
  DashboardSummary,
  ListEnvelope,
  PlayerLeaderboardEntry,
  PublicSchedule,
  StageStatus,
  TableStatus,
  TournamentStatus,
} from '../domain/models';

const API_BASE_URL = 'http://localhost:8080';

async function request<T>(path: string) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export interface ScheduleFilters {
  tournamentStatus?: TournamentStatus;
  stageStatus?: StageStatus;
  limit?: number;
  offset?: number;
}

export interface PlayerLeaderboardFilters {
  clubId?: string;
  status?: 'Active' | 'Inactive' | 'Banned';
  limit?: number;
  offset?: number;
}

export interface ClubFilters {
  activeOnly?: boolean;
  memberId?: string;
  limit?: number;
  offset?: number;
}

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

export const apiClient = {
  getPublicSchedules(filters: ScheduleFilters) {
    return request<ListEnvelope<PublicSchedule>>(
      `/public/schedules${toQueryString(filters)}`,
    );
  },
  getPublicPlayerLeaderboard(filters: PlayerLeaderboardFilters) {
    return request<ListEnvelope<PlayerLeaderboardEntry>>(
      `/public/leaderboards/players${toQueryString(filters)}`,
    );
  },
  getClubs(filters: ClubFilters) {
    return request<ListEnvelope<ClubSummary>>(`/clubs${toQueryString(filters)}`);
  },
  getPlayerDashboard(playerId: string, operatorId: string) {
    return request<DashboardSummary>(
      `/dashboards/players/${playerId}${toQueryString({ operatorId })}`,
    );
  },
  getClubDashboard(clubId: string, operatorId: string) {
    return request<DashboardSummary>(
      `/dashboards/clubs/${clubId}${toQueryString({ operatorId })}`,
    );
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

