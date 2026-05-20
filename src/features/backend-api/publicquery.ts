import type {
  ClubLeaderboardEntry,
  ListEnvelope,
  PlayerLeaderboardEntry,
  PlayerLeaderboardQuery,
  PublicClubDetailView,
  PublicClubQuery,
  PublicClubLeaderboardQuery,
  PublicTournamentDetailView,
  PublicTournamentQuery,
  PublicTournamentSummaryView,
  ScheduleQuery,
} from '@/objects';
import {
  mapPublicClub,
  mapPublicClubDetail,
  mapPublicSchedule,
  mapPublicTournamentDetail,
} from '@/features/public-hall/objects';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import { GetPublicClubAPI } from '@/api/publicquery/GetPublicClubAPI';
import { GetPublicTournamentAPI } from '@/api/publicquery/GetPublicTournamentAPI';
import { ListPublicClubsAPI } from '@/api/publicquery/ListPublicClubsAPI';
import { ListPublicSchedulesAPI } from '@/api/publicquery/ListPublicSchedulesAPI';
import { ListPublicTournamentsAPI } from '@/api/publicquery/ListPublicTournamentsAPI';
import { PublicClubLeaderboardAPI } from '@/api/publicquery/PublicClubLeaderboardAPI';
import { PublicPlayerLeaderboardAPI } from '@/api/publicquery/PublicPlayerLeaderboardAPI';


export const publicApi = {
  getPublicSchedules(filters: ScheduleQuery) {
    return sendAPI(new ListPublicSchedulesAPI(filters)).then((envelope) =>
      mapEnvelope(envelope, mapPublicSchedule),
    );
  },
  getPublicPlayerLeaderboard(filters: PlayerLeaderboardQuery) {
    return sendAPI<ListEnvelope<PlayerLeaderboardEntry>>(
      new PublicPlayerLeaderboardAPI(filters),
    );
  },
  getPublicClubLeaderboard(filters: PublicClubLeaderboardQuery = {}) {
    return sendAPI<ListEnvelope<ClubLeaderboardEntry>>(
      new PublicClubLeaderboardAPI(filters),
    );
  },
  getPublicClubs(filters: PublicClubQuery = {}) {
    return sendAPI(new ListPublicClubsAPI(filters)).then((envelope) =>
      mapEnvelope(envelope, mapPublicClub),
    );
  },
  getPublicClubProfile(clubId: string) {
    return sendAPI<PublicClubDetailView>(new GetPublicClubAPI(clubId)).then(
      mapPublicClubDetail,
    );
  },
  getPublicTournaments(filters: PublicTournamentQuery = {}) {
    return sendAPI<ListEnvelope<PublicTournamentSummaryView>>(
      new ListPublicTournamentsAPI(filters),
    );
  },
  getPublicTournamentProfile(tournamentId: string) {
    return sendAPI<PublicTournamentDetailView>(
      new GetPublicTournamentAPI(tournamentId),
    ).then(mapPublicTournamentDetail);
  },
};
