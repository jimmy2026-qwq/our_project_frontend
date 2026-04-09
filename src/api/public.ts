import type {
  ListEnvelope,
  StageStatus,
  TournamentStatus,
} from '@/domain';
import { toQueryString } from '@/lib/query';
import type {
  DashboardContract,
  PlayerLeaderboardEntryContract,
  PublicClubDetailContract,
  PublicClubDirectoryEntryContract,
  PublicScheduleContract,
  PublicTournamentDetailContract,
} from './contracts/public';
import {
  mapDashboard,
  mapPublicClub,
  mapPublicClubDetail,
  mapPublicSchedule,
  mapPublicTournamentDetail,
} from './public.mappers';
import { mapEnvelope, request } from './http';

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

export const publicApi = {
  getPublicSchedules(filters: ScheduleFilters) {
    return request<ListEnvelope<PublicScheduleContract>>(
      `/public/schedules${toQueryString(filters)}`,
    ).then((envelope) => mapEnvelope(envelope, mapPublicSchedule));
  },
  getPublicPlayerLeaderboard(filters: PlayerLeaderboardFilters) {
    return request<ListEnvelope<PlayerLeaderboardEntryContract>>(
      `/public/leaderboards/players${toQueryString(filters)}`,
    );
  },
  getPublicClubs() {
    return request<ListEnvelope<PublicClubDirectoryEntryContract>>('/public/clubs').then((envelope) =>
      mapEnvelope(envelope, mapPublicClub),
    );
  },
  getPublicTournamentProfile(tournamentId: string) {
    return request<PublicTournamentDetailContract>(`/public/tournaments/${tournamentId}`).then(
      mapPublicTournamentDetail,
    );
  },
  getPublicClubProfile(clubId: string) {
    return request<PublicClubDetailContract>(`/public/clubs/${clubId}`).then(mapPublicClubDetail);
  },
  getPlayerDashboard(playerId: string, operatorId: string) {
    return request<DashboardContract>(
      `/dashboards/players/${playerId}${toQueryString({ operatorId })}`,
    ).then(mapDashboard);
  },
  getClubDashboard(clubId: string, operatorId: string) {
    return request<DashboardContract>(
      `/dashboards/clubs/${clubId}${toQueryString({ operatorId })}`,
    ).then(mapDashboard);
  },
};
