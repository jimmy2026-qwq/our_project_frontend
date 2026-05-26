import {
  AcceptClubTournamentAPI,
  AdjustClubMemberContributionAPI,
  AssignClubAdminAPI,
  AssignClubTitleAPI,
  ClearClubTitleAPI,
  CreateClubAPI,
  DeclineClubTournamentAPI,
  GetClubAPI,
  ListClubContributionAuditsAPI,
  ListClubMemberPrivilegesAPI,
  ListClubApplicationsAPI,
  ListClubMembersAPI,
  ListClubsAPI,
  ListClubTournamentsAPI,
  RemoveClubMemberAPI,
  ReviewClubApplicationAPI,
  UpdateClubRankTreeAPI,
} from '@/api/club';
import {
  AuthCheckPermissionAPI,
} from '@/api/auth';
import {
  PlatformAdminBanPlayerAPI,
  PlatformAdminGrantSuperAdminAPI,
} from '@/api/platformadmin';
import { GetCurrentPlayerAPI, GetPlayerAPI, ListPlayersAPI } from '@/api/player';
import {
  GetPublicClubAPI,
  GetPublicTournamentAPI,
  ListPublicClubsAPI,
  ListPublicSchedulesAPI,
  PublicPlayerLeaderboardAPI,
} from '@/api/publicquery';
import {
  AppealAdjudicateAPI,
  AppealListAPI,
  AppealUpdateWorkflowAPI,
  TournamentCreateAPI,
  TournamentGetAPI,
  TournamentListAPI,
  TournamentPublishAPI,
  TournamentRegisterClubAPI,
  TournamentRegisterPlayerAPI,
  TournamentSettleAPI,
  TournamentStageCompleteAPI,
  TournamentStageDirectoryAPI,
  TournamentStageConfigureRulesAPI,
  TournamentStageCreateAPI,
  TournamentStageScheduleTablesAPI,
  TournamentStageSubmitLineupAPI,
  TournamentStageTablesAPI,
  TournamentTableGetAPI,
  TournamentTableStartAPI,
  TournamentTableUpdateOwnReadyAPI,
  TournamentTableUploadPaifuAPI,
  TournamentWhitelistListAPI,
} from '@/api/tournament';
import type {
  AdjustClubMemberContributionRequest,
  AdjudicateAppealRequest,
  AppealListQuery,
  AppealTicketView,
  AssignClubAdminRequest,
  AssignClubTitleRequest,
  BanPlayerRequest,
  ClearClubTitleRequest,
  CompleteStageRequest,
  ClubView,
  ClubContributionAuditEntry,
  ClubApplicationListQuery,
  ClubListQuery,
  ClubMemberListQuery,
  ClubMemberPrivilegeListQuery,
  ClubMemberPrivilegeSnapshotView,
  ClubMembershipApplicationView,
  ClubTournamentParticipationView,
  ClubTournamentQuery,
  ConfigureStageRulesRequest,
  CreateClubRequest,
  CreateTournamentStageRequest,
  CreateTournamentRequest,
  GrantSuperAdminRequest,
  ListEnvelope,
  PlayerLeaderboardEntry,
  PlayerLeaderboardQuery,
  PublicClubDetailView,
  PublicClubQuery,
  PublicTournamentDetailView,
  RemoveClubMemberRequest,
  ReviewClubApplicationRequest,
  ScheduleQuery,
  SettleTournamentRequest,
  StartTableRequest,
  StageAdvancementSnapshot,
  SubmitStageLineupRequest,
  TableListQuery,
  TournamentDetailView,
  TournamentListQuery,
  TournamentMutationView,
  TournamentSettlementView,
  TournamentWhitelistEntryView,
  TournamentWhitelistQuery,
  TournamentStageDirectoryEntry,
  TournamentSummaryView,
  TournamentTableView,
  UpdateClubRankTreeRequest,
  UpdateOwnTableReadyStateRequest,
} from '@/objects';
import type {
  PlatformAdminPlayerView,
} from '@/objects/platformadmin';
import type { UpdateAppealWorkflowRequest } from '@/objects/tournament/appeal';
import type { PlayerProfileView } from '@/objects/player';
import type { PlayerListQuery } from '@/objects/player';
import {
  mapClub,
  mapClubApplicationView,
  mapClubMember,
} from '@/pages/objects/club';
import { mapPlayerProfile } from '@/pages/objects/player';
import {
  mapTableDetail,
  mapTournamentDirectoryEntry,
  mapTournamentTable,
} from '@/pages/objects/tournament';
import type {
  AppealSummary,
} from '@/pages/objects/tournament';
import {
  mapPublicClub,
  mapPublicClubDetail,
  mapPublicSchedule,
  mapPublicTournamentDetail,
} from '@/pages/PublicShared/objects';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';
import type { Permission } from '@/objects/auth';
import type { TablePaifuDetail } from '@/pages/TablePaifuPage/types';

export interface CreatedTournamentView {
  id: string;
  name: string;
  organizer: string;
  status?: string;
}

function mapAppeal(ticket: AppealTicketView): AppealSummary {
  const lastLog = ticket.logs[ticket.logs.length - 1];

  return {
    id: ticket.appealId,
    tournamentId: ticket.tournamentId,
    stageId: ticket.stageId,
    tableId: ticket.tableId,
    status: ticket.status,
    openedBy: ticket.openedBy,
    createdBy: ticket.openedBy,
    description: ticket.description,
    attachments: ticket.attachments.map((attachment) => attachment.uri),
    priority: ticket.priority,
    assigneeId: ticket.assigneeId,
    dueAt: ticket.dueAt,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    resolution: ticket.resolution,
    verdict: lastLog?.note ?? null,
    reopenCount: ticket.reopenCount,
  };
}

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
  getPublicTournamentProfile(tournamentId: string) {
    return sendAPI<PublicTournamentDetailView>(
      new GetPublicTournamentAPI(tournamentId),
    ).then(mapPublicTournamentDetail);
  },
};

export const authApi = {
  checkPermission(payload: {
    operatorId: string;
    permission: Permission;
    clubId?: string;
    tournamentId?: string;
    subjectPlayerId?: string;
  }) {
    return sendAPI<boolean>(new AuthCheckPermissionAPI(payload));
  },
};

export const clubsApi = {
  getClub(clubId: string) {
    return sendAPI<ClubView>(new GetClubAPI(clubId));
  },
  createClub(payload: CreateClubRequest) {
    return sendAPI<ClubView>(new CreateClubAPI(payload)).then(mapClub);
  },
  getClubs(filters: ClubListQuery) {
    return sendAPI(new ListClubsAPI(filters)).then((envelope) =>
      mapEnvelope(envelope, mapClub),
    );
  },
  assignClubAdmin(clubId: string, payload: AssignClubAdminRequest) {
    return sendAPI<ClubView>(new AssignClubAdminAPI(clubId, payload));
  },
  assignClubTitle(clubId: string, payload: AssignClubTitleRequest) {
    return sendAPI<ClubView>(new AssignClubTitleAPI(clubId, payload)).then(
      mapClub,
    );
  },
  clearClubTitle(
    clubId: string,
    playerId: string,
    payload: ClearClubTitleRequest,
  ) {
    return sendAPI<ClubView>(
      new ClearClubTitleAPI(clubId, playerId, payload),
    ).then(mapClub);
  },
  getClubMembers(clubId: string, filters: ClubMemberListQuery = {}) {
    return sendAPI(new ListClubMembersAPI(clubId, filters)).then((envelope) =>
      mapEnvelope(envelope, mapClubMember),
    );
  },
  getClubMemberPrivileges(
    clubId: string,
    filters: ClubMemberPrivilegeListQuery = {},
  ) {
    return sendAPI<ListEnvelope<ClubMemberPrivilegeSnapshotView>>(
      new ListClubMemberPrivilegesAPI(clubId, filters),
    );
  },
  adjustClubMemberContribution(
    clubId: string,
    payload: AdjustClubMemberContributionRequest,
  ) {
    return sendAPI<ClubView>(
      new AdjustClubMemberContributionAPI(clubId, payload),
    ).then(mapClub);
  },
  updateClubRankTree(clubId: string, payload: UpdateClubRankTreeRequest) {
    return sendAPI<ClubView>(new UpdateClubRankTreeAPI(clubId, payload)).then(
      mapClub,
    );
  },
  getClubContributionAudits({
    clubId,
    operatorId,
    limit = 100,
    offset = 0,
  }: {
    clubId: string;
    operatorId: string;
    limit?: number;
    offset?: number;
  }) {
    return sendAPI<ListEnvelope<ClubContributionAuditEntry>>(
      new ListClubContributionAuditsAPI(clubId, {
        operatorId,
        limit,
        offset,
      }),
    );
  },
  removeClubMember(
    clubId: string,
    playerId: string,
    payload: RemoveClubMemberRequest,
  ) {
    return sendAPI<ClubView>(
      new RemoveClubMemberAPI(clubId, playerId, payload),
    ).then(mapClub);
  },
  getClubTournaments(clubId: string, filters: ClubTournamentQuery = {}) {
    return sendAPI<ListEnvelope<ClubTournamentParticipationView>>(
      new ListClubTournamentsAPI(clubId, filters),
    );
  },
  getClubApplications(clubId: string, filters: ClubApplicationListQuery) {
    return sendAPI(new ListClubApplicationsAPI(clubId, filters)).then(
      (envelope) => mapEnvelope(envelope, mapClubApplicationView),
    );
  },
  reviewClubApplication(
    clubId: string,
    membershipId: string,
    payload: ReviewClubApplicationRequest,
  ) {
    return sendAPI<ClubMembershipApplicationView>(
      new ReviewClubApplicationAPI(clubId, membershipId, payload),
    ).then(mapClubApplicationView);
  },
  acceptClubTournament(clubId: string, tournamentId: string, operatorId: string) {
    return sendAPI<TournamentMutationView>(
      new AcceptClubTournamentAPI(clubId, tournamentId, operatorId),
    );
  },
  declineClubTournament(clubId: string, tournamentId: string, operatorId: string) {
    return sendAPI<TournamentMutationView>(
      new DeclineClubTournamentAPI(clubId, tournamentId, operatorId),
    );
  },
};

export const tournamentApi = {
  getTournaments(filters: TournamentListQuery = {}) {
    return sendAPI<ListEnvelope<TournamentSummaryView>>(
      new TournamentListAPI(filters),
    ).then((envelope) => ({
      ...envelope,
      items: envelope.items.map(mapTournamentDirectoryEntry),
    }));
  },
  getTournamentStages(tournamentId: string) {
    return sendAPI<TournamentStageDirectoryEntry[]>(
      new TournamentStageDirectoryAPI(tournamentId),
    );
  },
  getTournament(tournamentId: string) {
    return sendAPI<TournamentDetailView>(new TournamentGetAPI(tournamentId));
  },
  publishTournament(tournamentId: string, operatorId?: string) {
    return sendAPI<TournamentMutationView>(
      new TournamentPublishAPI(tournamentId, operatorId),
    );
  },
  scheduleTournamentStage(
    tournamentId: string,
    stageId: string,
    operatorId?: string,
  ) {
    return sendAPI<TournamentMutationView>(
      new TournamentStageScheduleTablesAPI(tournamentId, stageId, operatorId),
    );
  },
  completeTournamentStage(
    tournamentId: string,
    stageId: string,
    payload: CompleteStageRequest,
  ) {
    return sendAPI<StageAdvancementSnapshot>(
      new TournamentStageCompleteAPI(tournamentId, stageId, payload),
    );
  },
  settleTournament(
    tournamentId: string,
    payload: SettleTournamentRequest,
  ) {
    return sendAPI<TournamentSettlementView>(
      new TournamentSettleAPI(tournamentId, payload),
    );
  },
  createTournamentStage(
    tournamentId: string,
    payload: CreateTournamentStageRequest,
  ) {
    return sendAPI<TournamentSummaryView>(
      new TournamentStageCreateAPI(tournamentId, payload),
    );
  },
  configureTournamentStageRules(
    tournamentId: string,
    stageId: string,
    payload: ConfigureStageRulesRequest,
  ) {
    return sendAPI<TournamentSummaryView>(
      new TournamentStageConfigureRulesAPI(tournamentId, stageId, payload),
    );
  },
  registerTournamentClub(
    tournamentId: string,
    clubId: string,
    operatorId?: string,
  ) {
    return sendAPI<TournamentMutationView>(
      new TournamentRegisterClubAPI(tournamentId, clubId, operatorId),
    );
  },
  registerTournamentPlayer(
    tournamentId: string,
    playerId: string,
    operatorId?: string,
  ) {
    return sendAPI<TournamentSummaryView>(
      new TournamentRegisterPlayerAPI(tournamentId, playerId, operatorId),
    );
  },
  getTournamentWhitelist(
    tournamentId: string,
    filters: TournamentWhitelistQuery = {},
  ) {
    return sendAPI<ListEnvelope<TournamentWhitelistEntryView>>(
      new TournamentWhitelistListAPI(tournamentId, filters),
    );
  },
  submitStageLineup(
    tournamentId: string,
    stageId: string,
    payload: SubmitStageLineupRequest,
  ) {
    return sendAPI<TournamentMutationView>(
      new TournamentStageSubmitLineupAPI(tournamentId, stageId, payload),
    );
  },
  createTournament(payload: CreateTournamentRequest) {
    return sendAPI<TournamentSummaryView>(new TournamentCreateAPI(payload)).then(
      (tournament) =>
        ({
          id: tournament.tournamentId,
          name: tournament.name,
          organizer: tournament.organizer,
          status: tournament.status,
        }) satisfies CreatedTournamentView,
    );
  },
  getTournamentTables(
    tournamentId: string,
    stageId: string,
    filters: TableListQuery,
  ) {
    return sendAPI<ListEnvelope<TournamentTableView>>(
      new TournamentStageTablesAPI(tournamentId, stageId, filters),
    ).then((envelope) => ({
      ...envelope,
      items: envelope.items.map(mapTournamentTable),
    }));
  },
  getTable(tableId: string) {
    return sendAPI<TournamentTableView>(new TournamentTableGetAPI(tableId)).then(
      mapTableDetail,
    );
  },
  startTable(tableId: string, payload: StartTableRequest = {}) {
    return sendAPI(new TournamentTableStartAPI(tableId, payload));
  },
  updateOwnReadyState(
    tableId: string,
    payload: UpdateOwnTableReadyStateRequest,
  ) {
    return sendAPI<TournamentTableView>(
      new TournamentTableUpdateOwnReadyAPI(tableId, payload),
    ).then(mapTableDetail);
  },
  uploadPaifu(
    tableId: string,
    payload: {
      operatorId?: string;
      paifu: TablePaifuDetail;
    },
  ) {
    return sendAPI<TournamentTableView>(
      new TournamentTableUploadPaifuAPI(tableId, payload),
    ).then(mapTableDetail);
  },
  getAppeals(filters: AppealListQuery) {
    return sendAPI(new AppealListAPI(filters)).then((envelope) => ({
      ...envelope,
      items: envelope.items.map(mapAppeal),
    }));
  },
  updateAppealWorkflow(
    appealId: string,
    payload: UpdateAppealWorkflowRequest,
  ) {
    return sendAPI(new AppealUpdateWorkflowAPI(appealId, payload)).then(
      mapAppeal,
    );
  },
  adjudicateAppeal(appealId: string, payload: AdjudicateAppealRequest) {
    return sendAPI(new AppealAdjudicateAPI(appealId, payload)).then(mapAppeal);
  },
};

export const playerApi = {
  getPlayers(filters: PlayerListQuery = {}) {
    return sendAPI(new ListPlayersAPI(filters)).then((envelope) =>
      mapEnvelope(envelope, mapPlayerProfile),
    );
  },
  getCurrentPlayer(operatorId: string) {
    return sendAPI<PlayerProfileView>(new GetCurrentPlayerAPI(operatorId)).then(
      mapPlayerProfile,
    );
  },
  getPlayer(playerId: string) {
    return sendAPI<PlayerProfileView>(new GetPlayerAPI(playerId)).then(
      mapPlayerProfile,
    );
  },
};

export const platformAdminApi = {
  banPlayer(playerId: string, payload: BanPlayerRequest) {
    return sendAPI<PlatformAdminPlayerView>(
      new PlatformAdminBanPlayerAPI(playerId, payload),
    );
  },
  grantSuperAdmin(playerId: string, payload: GrantSuperAdminRequest) {
    return sendAPI<PlatformAdminPlayerView>(
      new PlatformAdminGrantSuperAdminAPI(playerId, payload),
    );
  },
};
