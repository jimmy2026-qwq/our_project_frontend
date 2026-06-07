import { describe, expect, it } from 'vitest';

import { AuthCheckPermissionAPI } from '@/api/auth/AuthCheckPermissionAPI';
import { BootstrapSuperAdminAuthAPI } from '@/api/auth/BootstrapSuperAdminAuthAPI';
import { CreateGuestSessionAuthAPI } from '@/api/auth/CreateGuestSessionAuthAPI';
import { CurrentSessionAuthAPI } from '@/api/auth/CurrentSessionAuthAPI';
import { GetGuestSessionAuthAPI } from '@/api/auth/GetGuestSessionAuthAPI';
import { ListGuestSessionsAuthAPI } from '@/api/auth/ListGuestSessionsAuthAPI';
import { LoginAuthAPI } from '@/api/auth/LoginAuthAPI';
import { RegisterAuthAPI } from '@/api/auth/RegisterAuthAPI';
import { RevokeGuestSessionAuthAPI } from '@/api/auth/RevokeGuestSessionAuthAPI';
import { UpgradeGuestSessionAuthAPI } from '@/api/auth/UpgradeGuestSessionAuthAPI';
import { GetUnreadNotificationCountAPI } from '@/api/notification/GetUnreadNotificationCountAPI';
import { ListNotificationsAPI } from '@/api/notification/ListNotificationsAPI';
import { MarkAllNotificationsReadAPI } from '@/api/notification/MarkAllNotificationsReadAPI';
import { MarkNotificationReadAPI } from '@/api/notification/MarkNotificationReadAPI';
import { OpsAnalyticsAdvancedStatsSummaryAPI } from '@/api/opsanalytics/OpsAnalyticsAdvancedStatsSummaryAPI';
import { OpsAnalyticsClubAdvancedStatsAPI } from '@/api/opsanalytics/OpsAnalyticsClubAdvancedStatsAPI';
import { OpsAnalyticsClubDashboardAPI } from '@/api/opsanalytics/OpsAnalyticsClubDashboardAPI';
import { OpsAnalyticsListAdvancedStatsTasksAPI } from '@/api/opsanalytics/OpsAnalyticsListAdvancedStatsTasksAPI';
import { OpsAnalyticsPlayerAdvancedStatsAPI } from '@/api/opsanalytics/OpsAnalyticsPlayerAdvancedStatsAPI';
import { OpsAnalyticsPlayerDashboardAPI } from '@/api/opsanalytics/OpsAnalyticsPlayerDashboardAPI';
import { OpsAnalyticsProcessAdvancedStatsAPI } from '@/api/opsanalytics/OpsAnalyticsProcessAdvancedStatsAPI';
import { OpsAnalyticsRecomputeAdvancedStatsAPI } from '@/api/opsanalytics/OpsAnalyticsRecomputeAdvancedStatsAPI';
import { PlatformAdminBanPlayerAPI } from '@/api/platformadmin/PlatformAdminBanPlayerAPI';
import { PlatformAdminDissolveClubAPI } from '@/api/platformadmin/PlatformAdminDissolveClubAPI';
import { PlatformAdminGrantSuperAdminAPI } from '@/api/platformadmin/PlatformAdminGrantSuperAdminAPI';
import { CreatePlayerAPI } from '@/api/player/CreatePlayerAPI';
import { GetCurrentPlayerAPI } from '@/api/player/GetCurrentPlayerAPI';
import { GetPlayerAPI } from '@/api/player/GetPlayerAPI';
import { ListPlayersAPI } from '@/api/player/ListPlayersAPI';
import { PublicPlayerLeaderboardAPI } from '@/api/player/PublicPlayerLeaderboardAPI';
import { GetPublicTournamentAPI } from '@/api/tournament/GetPublicTournamentAPI';
import { ListPublicSchedulesAPI } from '@/api/tournament/ListPublicSchedulesAPI';
import { ListPublicTournamentsAPI } from '@/api/tournament/ListPublicTournamentsAPI';
import { TournamentAssignAdminAPI } from '@/api/tournament/TournamentAssignAdminAPI';
import { TournamentCreateAPI } from '@/api/tournament/TournamentCreateAPI';
import { TournamentGetAPI } from '@/api/tournament/TournamentGetAPI';
import { TournamentListAPI } from '@/api/tournament/TournamentListAPI';
import { TournamentPaifuGetAPI } from '@/api/tournament/TournamentPaifuGetAPI';
import { TournamentPaifuListAPI } from '@/api/tournament/TournamentPaifuListAPI';
import { TournamentPublishAPI } from '@/api/tournament/TournamentPublishAPI';
import { TournamentRecordGetAPI } from '@/api/tournament/TournamentRecordGetAPI';
import { TournamentRecordGetByTableAPI } from '@/api/tournament/TournamentRecordGetByTableAPI';
import { TournamentRecordListAPI } from '@/api/tournament/TournamentRecordListAPI';
import { TournamentRegisterClubAPI } from '@/api/tournament/TournamentRegisterClubAPI';
import { TournamentRegisterPlayerAPI } from '@/api/tournament/TournamentRegisterPlayerAPI';
import { TournamentRemoveClubParticipationAPI } from '@/api/tournament/TournamentRemoveClubParticipationAPI';
import { TournamentRevokeAdminAPI } from '@/api/tournament/TournamentRevokeAdminAPI';
import { TournamentSettleAPI } from '@/api/tournament/TournamentSettleAPI';
import { TournamentSettlementFinalizeAPI } from '@/api/tournament/TournamentSettlementFinalizeAPI';
import { TournamentSettlementGetAPI } from '@/api/tournament/TournamentSettlementGetAPI';
import { TournamentSettlementListAPI } from '@/api/tournament/TournamentSettlementListAPI';
import { TournamentStageAdvanceAPI } from '@/api/tournament/TournamentStageAdvanceAPI';
import { TournamentStageAdvancementPreviewAPI } from '@/api/tournament/TournamentStageAdvancementPreviewAPI';
import { TournamentStageCompleteAPI } from '@/api/tournament/TournamentStageCompleteAPI';
import { TournamentStageConfigureRulesAPI } from '@/api/tournament/TournamentStageConfigureRulesAPI';
import { TournamentStageCreateAPI } from '@/api/tournament/TournamentStageCreateAPI';
import { TournamentStageDirectoryAPI } from '@/api/tournament/TournamentStageDirectoryAPI';
import { TournamentStageKnockoutBracketAPI } from '@/api/tournament/TournamentStageKnockoutBracketAPI';
import { TournamentStageScheduleTablesAPI } from '@/api/tournament/TournamentStageScheduleTablesAPI';
import { TournamentStageStandingsAPI } from '@/api/tournament/TournamentStageStandingsAPI';
import { TournamentStageSubmitLineupAPI } from '@/api/tournament/TournamentStageSubmitLineupAPI';
import { TournamentStageTablesAPI } from '@/api/tournament/TournamentStageTablesAPI';
import { TournamentStartAPI } from '@/api/tournament/TournamentStartAPI';
import { TournamentTableFinalizeArchiveAPI } from '@/api/tournament/TournamentTableFinalizeArchiveAPI';
import { TournamentTableGetAPI } from '@/api/tournament/TournamentTableGetAPI';
import { TournamentTableListAPI } from '@/api/tournament/TournamentTableListAPI';
import { TournamentTableResetAPI } from '@/api/tournament/TournamentTableResetAPI';
import { TournamentTableStartAPI } from '@/api/tournament/TournamentTableStartAPI';
import { TournamentTableUpdateOwnReadyAPI } from '@/api/tournament/TournamentTableUpdateOwnReadyAPI';
import { TournamentTableUpdateSeatStateAPI } from '@/api/tournament/TournamentTableUpdateSeatStateAPI';
import { TournamentTableUploadPaifuAPI } from '@/api/tournament/TournamentTableUploadPaifuAPI';
import { TournamentWhitelistClubAPI } from '@/api/tournament/TournamentWhitelistClubAPI';
import { TournamentWhitelistListAPI } from '@/api/tournament/TournamentWhitelistListAPI';
import { TournamentWhitelistPlayerAPI } from '@/api/tournament/TournamentWhitelistPlayerAPI';
import { AppealAdjudicateAPI } from '@/api/tournament/appeal/AppealAdjudicateAPI';
import { AppealFileAPI } from '@/api/tournament/appeal/AppealFileAPI';
import { AppealGetAPI } from '@/api/tournament/appeal/AppealGetAPI';
import { AppealListAPI } from '@/api/tournament/appeal/AppealListAPI';
import { AppealReopenAPI } from '@/api/tournament/appeal/AppealReopenAPI';
import { AppealResolveAPI } from '@/api/tournament/appeal/AppealResolveAPI';
import { AppealUpdateWorkflowAPI } from '@/api/tournament/appeal/AppealUpdateWorkflowAPI';
import { MahjongCoreAdvanceRoundAPI } from '@/api/tournament/mahjongcore/MahjongCoreAdvanceRoundAPI';
import { MahjongCoreArchiveTableAPI } from '@/api/tournament/mahjongcore/MahjongCoreArchiveTableAPI';
import { MahjongCoreGetTableAPI } from '@/api/tournament/mahjongcore/MahjongCoreGetTableAPI';
import { MahjongCoreResetTableAPI } from '@/api/tournament/mahjongcore/MahjongCoreResetTableAPI';
import { MahjongCoreStartTableAPI } from '@/api/tournament/mahjongcore/MahjongCoreStartTableAPI';
import { MahjongCoreSubmitActionAPI } from '@/api/tournament/mahjongcore/MahjongCoreSubmitActionAPI';
import type { APIMessage } from '@/system/api';
import { apiNameOf } from '@/system/api/apiNameOf';

describe('API message contracts', () => {
  it('encodes auth, player, notification, analytics and platform admin messages', () => {
    const bootstrap = BootstrapSuperAdminAuthAPI.fromRequest({
      bootstrapKey: 'key',
      username: 'root',
      password: 'password123',
      displayName: 'Root',
    });
    const login = LoginAuthAPI.fromRequest({
      username: 'player',
      password: 'password123',
    });
    const register = RegisterAuthAPI.fromRequest({
      username: 'new-player',
      password: 'password123',
      displayName: 'New Player',
    });

    expectMessage(bootstrap, 'bootstrapsuperadminauthapi', {
      bootstrapKey: 'key',
      username: 'root',
      password: 'password123',
      displayName: 'Root',
    });
    expectMessage(login, 'loginauthapi', {
      username: 'player',
      password: 'password123',
    });
    expectMessage(register, 'registerauthapi', {
      username: 'new-player',
      password: 'password123',
      displayName: 'New Player',
    });

    const cases: MessageCase[] = [
      [
        new AuthCheckPermissionAPI({
          operatorId: 'player-admin',
          permission: 'ManageTournamentStages',
          clubId: 'club-a',
          tournamentId: 'tournament-a',
          subjectPlayerId: 'player-target',
        }),
        'authcheckpermissionapi',
        {
          operatorId: 'player-admin',
          permission: 'ManageTournamentStages',
          clubId: ['club-a'],
          tournamentId: ['tournament-a'],
          subjectPlayerId: ['player-target'],
        },
      ],
      [
        new CreateGuestSessionAuthAPI({ displayName: 'Guest' }),
        'createguestsessionauthapi',
        { displayName: ['Guest'], ttlHours: [], deviceFingerprint: [] },
      ],
      [
        new CurrentSessionAuthAPI({
          operatorId: 'player-a',
          guestSessionId: 'guest-a',
        }),
        'currentsessionauthapi',
        { operatorId: ['player-a'], guestSessionId: ['guest-a'] },
      ],
      [
        new GetGuestSessionAuthAPI('guest-a'),
        'getguestsessionauthapi',
        { sessionId: 'guest-a' },
      ],
      [
        new ListGuestSessionsAuthAPI({
          activeOnly: true,
          limit: 20,
          offset: 5,
        }),
        'listguestsessionsauthapi',
        { activeOnly: [true], limit: [20], offset: [5] },
      ],
      [
        new RevokeGuestSessionAuthAPI('guest-a', 'expired'),
        'revokeguestsessionauthapi',
        { sessionId: 'guest-a', reason: ['expired'] },
      ],
      [
        new UpgradeGuestSessionAuthAPI('guest-a', 'player-a'),
        'upgradeguestsessionauthapi',
        { sessionId: 'guest-a', playerId: 'player-a' },
      ],
      [
        new CreatePlayerAPI({
          userId: 'user-a',
          nickname: 'Alpha',
          rankPlatform: 'MahjongSoul',
          tier: 'Novice',
          stars: null,
        }),
        'createplayerapi',
        { request: { userId: 'user-a', nickname: 'Alpha', initialElo: 1500 } },
      ],
      [
        CreatePlayerAPI.fromRequest({
          userId: 'user-b',
          nickname: 'Beta',
          rankPlatform: 'MahjongSoul',
          tier: 'Novice',
          stars: 1,
          initialElo: 1510,
        }),
        'createplayerapi',
        { request: { userId: 'user-b', initialElo: 1510 } },
      ],
      [
        new GetCurrentPlayerAPI('player-a'),
        'getcurrentplayerapi',
        { operatorId: 'player-a' },
      ],
      [new GetPlayerAPI('player-a'), 'getplayerapi', { playerId: 'player-a' }],
      [
        new ListPlayersAPI({
          clubId: 'club-a',
          status: 'Active',
          nickname: 'Alpha',
          limit: 50,
          offset: 10,
        }),
        'listplayersapi',
        {
          clubId: ['club-a'],
          status: ['Active'],
          nickname: ['Alpha'],
          limit: [50],
          offset: [10],
        },
      ],
      [
        new PublicPlayerLeaderboardAPI({
          clubId: 'club-a',
          status: 'Active',
          limit: 30,
          offset: 0,
        }),
        'publicplayerleaderboardapi',
        { clubId: ['club-a'], status: ['Active'], limit: [30], offset: [0] },
      ],
      [
        new GetUnreadNotificationCountAPI('player-a'),
        'getunreadnotificationcountapi',
        { operatorId: 'player-a' },
      ],
      [
        new ListNotificationsAPI('player-a', {
          limit: 10,
          offset: 2,
          unreadOnly: true,
        }),
        'listnotificationsapi',
        { operatorId: 'player-a', query: { limit: 10, offset: 2 } },
      ],
      [
        new MarkAllNotificationsReadAPI('player-a'),
        'markallnotificationsreadapi',
        { operatorId: 'player-a' },
      ],
      [
        new MarkNotificationReadAPI('notification-a', 'player-a'),
        'marknotificationreadapi',
        { notificationId: 'notification-a', operatorId: 'player-a' },
      ],
      [
        new OpsAnalyticsAdvancedStatsSummaryAPI({
          operatorId: 'player-admin',
          asOf: '2026-06-06T00:00:00Z',
        }),
        'opsanalyticsadvancedstatssummaryapi',
        { operatorId: 'player-admin', asOf: ['2026-06-06T00:00:00Z'] },
      ],
      [
        new OpsAnalyticsClubAdvancedStatsAPI({
          clubId: 'club-a',
          operatorId: 'player-admin',
        }),
        'opsanalyticsclubadvancedstatsapi',
        { clubId: 'club-a', operatorId: 'player-admin' },
      ],
      [
        new OpsAnalyticsClubDashboardAPI({
          clubId: 'club-a',
          operatorId: 'player-admin',
        }),
        'opsanalyticsclubdashboardapi',
        { clubId: 'club-a', operatorId: 'player-admin' },
      ],
      [
        new OpsAnalyticsListAdvancedStatsTasksAPI({
          operatorId: 'player-admin',
          status: 'Queued',
          limit: 5,
          offset: 1,
        }),
        'opsanalyticslistadvancedstatstasksapi',
        { operatorId: 'player-admin', status: ['Queued'], limit: [5], offset: [1] },
      ],
      [
        new OpsAnalyticsPlayerAdvancedStatsAPI({
          playerId: 'player-a',
          operatorId: 'player-admin',
        }),
        'opsanalyticsplayeradvancedstatsapi',
        { playerId: 'player-a', operatorId: 'player-admin' },
      ],
      [
        new OpsAnalyticsPlayerDashboardAPI({
          playerId: 'player-a',
          operatorId: 'player-admin',
        }),
        'opsanalyticsplayerdashboardapi',
        { playerId: 'player-a', operatorId: 'player-admin' },
      ],
      [
        new OpsAnalyticsProcessAdvancedStatsAPI({ operatorId: 'player-admin' }),
        'opsanalyticsprocessadvancedstatsapi',
        { operatorId: 'player-admin', limit: 50 },
      ],
      [
        new OpsAnalyticsRecomputeAdvancedStatsAPI({
          operatorId: 'player-admin',
          requestedBy: 'player-admin',
        } as never),
        'opsanalyticsrecomputeadvancedstatsapi',
        { request: { mode: 'Full', limit: 500 } },
      ],
      [
        new PlatformAdminBanPlayerAPI('player-a', {
          operatorId: 'player-super',
          reason: 'test',
        }),
        'platformadminbanplayerapi',
        { playerId: 'player-a', operatorId: 'player-super', reason: 'test' },
      ],
      [
        new PlatformAdminDissolveClubAPI('club-a', {
          operatorId: 'player-super',
        }),
        'platformadmindissolveclubapi',
        { clubId: 'club-a', operatorId: 'player-super' },
      ],
      [
        new PlatformAdminGrantSuperAdminAPI('player-a', {
          operatorId: 'player-super',
        }),
        'platformadmingrantsuperadminapi',
        { playerId: 'player-a', operatorId: 'player-super' },
      ],
    ];

    for (const [message, apiName, shape] of cases) {
      expectMessage(message, apiName, shape);
    }
  });

  it('encodes tournament list, lookup, registration, settlement and table APIs', () => {
    const payload = { operatorId: 'player-admin' } as never;
    const cases: MessageCase[] = [
      [
        new GetPublicTournamentAPI('tournament-a'),
        'getpublictournamentapi',
        { tournamentId: 'tournament-a' },
      ],
      [
        new ListPublicSchedulesAPI({
          tournamentStatus: 'Published',
          stageStatus: 'Active',
          limit: 12,
          offset: 3,
        }),
        'listpublicschedulesapi',
        {
          tournamentStatus: ['Published'],
          stageStatus: ['Active'],
          limit: [12],
          offset: [3],
        },
      ],
      [
        new ListPublicTournamentsAPI({
          status: 'Published',
          organizer: 'Org',
          limit: 12,
          offset: 3,
        }),
        'listpublictournamentsapi',
        { status: ['Published'], organizer: ['Org'], limit: [12], offset: [3] },
      ],
      [
        new TournamentAssignAdminAPI('tournament-a', payload),
        'tournamentassignadminapi',
        { tournamentId: 'tournament-a', request: payload },
      ],
      [
        new TournamentCreateAPI({ name: 'Tournament' } as never),
        'tournamentcreateapi',
        { request: { name: 'Tournament' } },
      ],
      [
        new TournamentGetAPI('tournament-a'),
        'tournamentgetapi',
        { tournamentId: 'tournament-a' },
      ],
      [
        new TournamentListAPI({
          status: 'Published',
          adminId: 'player-admin',
          organizer: 'Org',
          limit: 20,
          offset: 5,
        }),
        'tournamentlistapi',
        { status: 'Published', adminId: 'player-admin', organizer: 'Org' },
      ],
      [
        new TournamentPaifuGetAPI('paifu-a'),
        'tournamentpaifugetapi',
        { paifuId: 'paifu-a' },
      ],
      [
        new TournamentPaifuListAPI({ tableId: 'table-a' }),
        'tournamentpaifulistapi',
        { query: { tableId: 'table-a' } },
      ],
      [
        new TournamentPublishAPI('tournament-a', 'player-admin'),
        'tournamentpublishapi',
        { tournamentId: 'tournament-a', operatorId: 'player-admin' },
      ],
      [
        new TournamentRecordGetAPI('record-a'),
        'tournamentrecordgetapi',
        { recordId: 'record-a' },
      ],
      [
        new TournamentRecordGetByTableAPI('table-a'),
        'tournamentrecordgetbytableapi',
        { tableId: 'table-a' },
      ],
      [
        new TournamentRecordListAPI({ tournamentId: 'tournament-a' }),
        'tournamentrecordlistapi',
        { query: { tournamentId: 'tournament-a' } },
      ],
      [
        new TournamentRegisterClubAPI('tournament-a', 'club-a', 'player-admin'),
        'tournamentregisterclubapi',
        { tournamentId: 'tournament-a', clubId: 'club-a', operatorId: 'player-admin' },
      ],
      [
        new TournamentRegisterPlayerAPI('tournament-a', 'player-a', 'player-admin'),
        'tournamentregisterplayerapi',
        { tournamentId: 'tournament-a', playerId: 'player-a', operatorId: 'player-admin' },
      ],
      [
        new TournamentRemoveClubParticipationAPI(
          'tournament-a',
          'club-a',
          'player-admin',
        ),
        'tournamentremoveclubparticipationapi',
        { tournamentId: 'tournament-a', clubId: 'club-a', operatorId: 'player-admin' },
      ],
      [
        new TournamentRevokeAdminAPI('tournament-a', 'player-a', 'player-admin'),
        'tournamentrevokeadminapi',
        { tournamentId: 'tournament-a', playerId: 'player-a', operatorId: 'player-admin' },
      ],
      [
        new TournamentSettleAPI('tournament-a', payload),
        'tournamentsettleapi',
        { tournamentId: 'tournament-a', request: payload },
      ],
      [
        new TournamentSettlementFinalizeAPI('tournament-a', 'settlement-a', payload),
        'tournamentsettlementfinalizeapi',
        { tournamentId: 'tournament-a', settlementId: 'settlement-a', request: payload },
      ],
      [
        new TournamentSettlementGetAPI('tournament-a', 'stage-a'),
        'tournamentsettlementgetapi',
        { tournamentId: 'tournament-a', stageId: 'stage-a' },
      ],
      [
        new TournamentSettlementListAPI('tournament-a', { stageId: 'stage-a' }),
        'tournamentsettlementlistapi',
        { tournamentId: 'tournament-a', query: { stageId: 'stage-a' } },
      ],
      [
        new TournamentStageAdvanceAPI('tournament-a', 'stage-a', 'player-admin'),
        'tournamentstageadvanceapi',
        { tournamentId: 'tournament-a', stageId: 'stage-a', operatorId: 'player-admin' },
      ],
      [
        new TournamentStageAdvancementPreviewAPI('tournament-a', 'stage-a'),
        'tournamentstageadvancementpreviewapi',
        { tournamentId: 'tournament-a', stageId: 'stage-a' },
      ],
      [
        new TournamentStageCompleteAPI('tournament-a', 'stage-a', 'player-admin'),
        'tournamentstagecompleteapi',
        { tournamentId: 'tournament-a', stageId: 'stage-a', operatorId: 'player-admin' },
      ],
      [
        new TournamentStageDirectoryAPI('tournament-a'),
        'tournamentstagedirectoryapi',
        { tournamentId: 'tournament-a' },
      ],
      [
        new TournamentStageKnockoutBracketAPI('tournament-a', 'stage-a'),
        'tournamentstageknockoutbracketapi',
        { tournamentId: 'tournament-a', stageId: 'stage-a' },
      ],
      [
        new TournamentStageScheduleTablesAPI(
          'tournament-a',
          'stage-a',
          'player-admin',
        ),
        'tournamentstagescheduletablesapi',
        { tournamentId: 'tournament-a', stageId: 'stage-a', operatorId: 'player-admin' },
      ],
      [
        new TournamentStageStandingsAPI('tournament-a', 'stage-a'),
        'tournamentstagestandingsapi',
        { tournamentId: 'tournament-a', stageId: 'stage-a' },
      ],
      [
        new TournamentStageTablesAPI('tournament-a', 'stage-a', {
          status: 'Scoring',
        }),
        'tournamentstagetablesapi',
        { tournamentId: 'tournament-a', stageId: 'stage-a', query: { status: 'Scoring' } },
      ],
      [
        new TournamentStartAPI('tournament-a', 'player-admin'),
        'tournamentstartapi',
        { tournamentId: 'tournament-a', operatorId: 'player-admin' },
      ],
      [
        new TournamentTableFinalizeArchiveAPI('table-a', 'player-admin'),
        'tournamenttablefinalizearchiveapi',
        { tableId: 'table-a', operatorId: 'player-admin' },
      ],
      [
        new TournamentTableGetAPI('table-a'),
        'tournamenttablegetapi',
        { tableId: 'table-a' },
      ],
      [
        new TournamentTableListAPI({ status: 'Archived' }),
        'tournamenttablelistapi',
        { query: { status: 'Archived' } },
      ],
      [
        new TournamentTableResetAPI('table-a', payload),
        'tournamenttableresetapi',
        { tableId: 'table-a', request: payload },
      ],
      [
        new TournamentTableStartAPI('table-a', 'player-admin'),
        'tournamenttablestartapi',
        { tableId: 'table-a', operatorId: 'player-admin' },
      ],
      [
        new TournamentTableUpdateOwnReadyAPI('table-a', payload),
        'tournamenttableupdateownreadyapi',
        { tableId: 'table-a', request: payload },
      ],
      [
        new TournamentTableUpdateSeatStateAPI('table-a', {
          seat: 'East',
          operatorId: 'player-admin',
          ready: true,
          disconnected: false,
          note: 'seat update',
        }),
        'tournamenttableupdateseatstateapi',
        {
          tableId: 'table-a',
          seat: 'East',
          request: {
            operatorId: 'player-admin',
            ready: true,
            disconnected: false,
            note: 'seat update',
          },
        },
      ],
      [
        new TournamentTableUploadPaifuAPI('table-a', payload),
        'tournamenttableuploadpaifuapi',
        { tableId: 'table-a', request: payload },
      ],
      [
        new TournamentWhitelistClubAPI('tournament-a', 'club-a', 'player-admin'),
        'tournamentwhitelistclubapi',
        { tournamentId: 'tournament-a', clubId: 'club-a', operatorId: 'player-admin' },
      ],
      [
        new TournamentWhitelistListAPI('tournament-a', { clubId: 'club-a' }),
        'tournamentwhitelistlistapi',
        { tournamentId: 'tournament-a', query: { clubId: 'club-a' } },
      ],
      [
        new TournamentWhitelistPlayerAPI('tournament-a', 'player-a', 'player-admin'),
        'tournamentwhitelistplayerapi',
        { tournamentId: 'tournament-a', playerId: 'player-a', operatorId: 'player-admin' },
      ],
    ];

    for (const [message, apiName, shape] of cases) {
      expectMessage(message, apiName, shape);
    }
  });

  it('encodes stage rule payloads with backend Option arrays', () => {
    const create = new TournamentStageCreateAPI('tournament-a', {
      id: 'stage-a',
      name: 'Stage A',
      format: 'Swiss',
      order: 2,
      roundCount: 4,
      operatorId: 'player-admin',
      ruleTemplateKey: 'standard',
      advancementRuleType: 'TopN',
      cutSize: 16,
      thresholdScore: 120,
      targetTableCount: 8,
      note: 'create stage',
      pairingMethod: 'balanced-elo',
      carryOverPoints: true,
      maxRounds: 4,
      bracketSize: 16,
      thirdPlaceMatch: true,
      repechageEnabled: false,
      seedingPolicy: 'Rating',
      mahjongRuleset: { gameLength: 'Tonpu' },
      schedulingPoolSize: 64,
    } as never);
    const configure = new TournamentStageConfigureRulesAPI(
      'tournament-a',
      'stage-a',
      {
        operatorId: 'player-admin',
        format: 'Knockout',
        roundCount: 2,
        advancementRuleType: 'ThresholdScore',
        cutSize: 8,
        thresholdScore: 80,
        targetTableCount: 4,
        schedulingPoolSize: 32,
        ruleTemplateKey: 'knockout',
        pairingMethod: 'snake',
        carryOverPoints: false,
        maxRounds: 2,
        bracketSize: 8,
        thirdPlaceMatch: false,
        repechageEnabled: true,
        seedingPolicy: 'Standing',
        mahjongRuleset: { gameLength: 'Hanchan' },
        note: 'configure stage',
      } as never,
    );
    const lineup = new TournamentStageSubmitLineupAPI(
      'tournament-a',
      'stage-a',
      {
        clubId: 'club-a',
        operatorId: 'player-admin',
        seats: [
          { playerId: 'player-east', preferredWind: 'East' },
          { playerId: 'player-reserve', reserve: true },
        ],
        note: 'lineup note',
      } as never,
    );

    expectMessage(create, 'tournamentstagecreateapi', {
      tournamentId: 'tournament-a',
      request: {
        id: ['stage-a'],
        operatorId: ['player-admin'],
        cutSize: [16],
        carryOverPoints: [true],
        repechageEnabled: [false],
        mahjongRuleset: [{ gameLength: 'Tonpu' }],
      },
    });
    expectMessage(configure, 'tournamentstageconfigurerulesapi', {
      tournamentId: 'tournament-a',
      stageId: 'stage-a',
      request: {
        operatorId: 'player-admin',
        format: ['Knockout'],
        carryOverPoints: [false],
        repechageEnabled: [true],
        mahjongRuleset: [{ gameLength: 'Hanchan' }],
      },
    });
    expectMessage(lineup, 'tournamentstagesubmitlineupapi', {
      tournamentId: 'tournament-a',
      stageId: 'stage-a',
      request: {
        clubId: 'club-a',
        operatorId: 'player-admin',
        seats: [
          { playerId: 'player-east', preferredWind: ['East'], reserve: false },
          { playerId: 'player-reserve', preferredWind: [], reserve: true },
        ],
        note: ['lineup note'],
      },
    });
  });

  it('encodes appeal and mahjong-core API messages', () => {
    const payload = { operatorId: 'player-admin', note: 'note' } as never;
    const cases: MessageCase[] = [
      [
        new AppealAdjudicateAPI('appeal-a', payload),
        'appealadjudicateapi',
        { appealId: 'appeal-a', request: payload },
      ],
      [
        new AppealFileAPI('table-a', {
          operatorId: 'player-a',
          reason: 'wrong score',
        } as never),
        'appealfileapi',
        {
          tableId: 'table-a',
          request: {
            operatorId: 'player-a',
            reason: 'wrong score',
            attachments: [],
          },
        },
      ],
      [
        new AppealGetAPI('appeal-a'),
        'appealgetapi',
        { appealId: 'appeal-a' },
      ],
      [
        new AppealListAPI({ tableId: 'table-a', status: 'Open' } as never),
        'appeallistapi',
        { query: { tableId: 'table-a', status: 'Open' } },
      ],
      [
        new AppealReopenAPI('appeal-a', 'player-admin', 'new evidence', 'note'),
        'appealreopenapi',
        {
          appealId: 'appeal-a',
          operatorId: 'player-admin',
          reason: 'new evidence',
          note: 'note',
        },
      ],
      [
        new AppealResolveAPI('appeal-a', 'player-admin', 'Rejected', 'note'),
        'appealresolveapi',
        {
          appealId: 'appeal-a',
          operatorId: 'player-admin',
          verdict: 'Rejected',
          note: 'note',
        },
      ],
      [
        new AppealUpdateWorkflowAPI('appeal-a', {
          operatorId: 'player-admin',
          clearAssignee: true,
        } as never),
        'appealupdateworkflowapi',
        {
          appealId: 'appeal-a',
          request: {
            operatorId: 'player-admin',
            clearAssignee: true,
            clearDueAt: false,
          },
        },
      ],
      [
        new MahjongCoreAdvanceRoundAPI('table-a'),
        'mahjongcoreadvanceroundapi',
        { tableId: 'table-a', request: [] },
      ],
      [
        new MahjongCoreAdvanceRoundAPI('table-a', {
          playerId: 'player-east',
          showcaseMode: false,
        }),
        'mahjongcoreadvanceroundapi',
        {
          tableId: 'table-a',
          request: [
            {
              playerId: ['player-east'],
              showcaseMode: [false],
            },
          ],
        },
      ],
      [
        new MahjongCoreArchiveTableAPI('table-a', payload),
        'mahjongcorearchivetableapi',
        { tableId: 'table-a', request: payload },
      ],
      [
        new MahjongCoreGetTableAPI('table-a', {
          operatorId: 'player-a',
          includeLegalActions: true,
        }),
        'mahjongcoregettableapi',
        { tableId: 'table-a', query: { operatorId: 'player-a' } },
      ],
      [
        new MahjongCoreResetTableAPI('table-a', payload),
        'mahjongcoreresettableapi',
        { tableId: 'table-a', request: payload },
      ],
      [
        new MahjongCoreStartTableAPI('table-a', payload),
        'mahjongcorestarttableapi',
        { tableId: 'table-a', request: payload },
      ],
      [
        new MahjongCoreSubmitActionAPI('table-a', payload),
        'mahjongcoresubmitactionapi',
        { tableId: 'table-a', request: payload },
      ],
    ];

    for (const [message, apiName, shape] of cases) {
      expectMessage(message, apiName, shape);
    }
  });
});

type MessageCase = [
  APIMessage<unknown>,
  string,
  Record<string, unknown>,
];

function expectMessage(
  message: APIMessage<unknown>,
  apiName: string,
  shape: Record<string, unknown>,
) {
  expect(apiNameOf(message)).toBe(apiName);
  expect(message).toMatchObject(shape);
}
