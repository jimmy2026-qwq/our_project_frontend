import {
  expect,
  test,
  type APIRequestContext,
  type Page,
  type TestInfo,
} from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { PNG } from 'pngjs';

const apiBaseUrl =
  process.env.E2E_API_BASE_URL ?? 'http://127.0.0.1:8080/api';
const prefix = process.env.E2E_LARGE_PREFIX ?? 'e2e-large-regression';
const playerCount = Number(process.env.E2E_LARGE_PLAYER_COUNT ?? 64);
const clubCount = Number(process.env.E2E_LARGE_CLUB_COUNT ?? 8);
const tournamentName = `E2E Large Tournament ${prefix}`;
const tournamentOrganizer = 'E2E Large Regression';
const stageId = `stage-${prefix}`;
const stageName = '64 Player Swiss';
const initialPoints = 25000;
const ronPoints = 12000;
const roundCount = Number(process.env.E2E_LARGE_ROUND_COUNT ?? 4);
const tablesPerRound = playerCount / 4;
const superAdminPlayerId = 'player-661d4fcc';

test.describe.configure({ mode: 'serial' });

test('64 人 8 俱乐部完整瑞士赛可以打满 4 轮、归档牌谱，并刷新全员 ELO', async ({
  page,
  request,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop-chromium',
    '大赛事链路压测只在桌面项目跑一次，避免移动端重复造 64 人数据。',
  );
  test.skip(playerCount % 4 !== 0, 'E2E_LARGE_PLAYER_COUNT 必须是 4 的倍数。');
  test.skip(clubCount <= 0, 'E2E_LARGE_CLUB_COUNT 必须为正数。');
  test.skip(roundCount <= 0, 'E2E_LARGE_ROUND_COUNT 必须为正数。');
  test.setTimeout(360_000);

  cleanupLargeTournamentRows();

  const players = await createPlayers(request);
  const clubs = await createClubsAndMemberships(request, players);
  const tournament = await createLargeTournament(request, playerCount);
  const tournamentId = tournament.tournamentId;

  for (const player of players) {
    await postApi<TournamentSummaryView>(request, 'tournamentregisterplayerapi', {
      tournamentId,
      playerId: player.playerId,
      operatorId: null,
    });
  }

  await postApi(request, 'tournamentpublishapi', {
    tournamentId,
    operatorId: null,
  });
  await postApi<TournamentSummaryView>(request, 'tournamentstartapi', {
    tournamentId,
    operatorId: null,
  });
  await postApi(request, 'tournamentstagescheduletablesapi', {
    tournamentId,
    stageId,
    operatorId: null,
  });

  const beforeProfiles = await getPlayerProfiles(request, players);
  const beforeDashboards = await getPlayerDashboards(
    request,
    players.slice(0, Math.min(8, players.length)),
  );

  for (let roundNumber = 1; roundNumber <= roundCount; roundNumber += 1) {
    const roundTables = await waitForRoundTables(
      request,
      tournamentId,
      roundNumber,
    );
    assertRoundTables(roundTables, roundNumber);

    const startedTables: TournamentTableView[] = [];
    for (const table of roundTables) {
      const startedTable = await postApi<TournamentTableView>(
        request,
        'tournamenttablestartapi',
        {
          tableId: table.tableId,
          operatorId: null,
        },
      );

      expect(startedTable.status).toBe('InProgress');
      startedTables.push(startedTable);
    }

    for (const [index, table] of startedTables.entries()) {
      const globalTableIndex = (roundNumber - 1) * tablesPerRound + index;
      const paifu = buildRonPaifu(table, globalTableIndex);
      const scoringTable = await postApi<TournamentTableView>(
        request,
        'tournamenttableuploadpaifuapi',
        {
          tableId: table.tableId,
          request: {
            operatorId: null,
            paifu,
          },
        },
      );
      const archivedTable = await finalizeTournamentTable(
        request,
        scoringTable,
      );

      expect(scoringTable.status).toBe('Scoring');
      expect(scoringTable.matchRecordId).toEqual(expect.stringMatching(/^record-/));
      expect(scoringTable.paifuId).toEqual(expect.stringMatching(/^paifu-/));
      expect(archivedTable.status).toBe('Archived');
      expect(archivedTable.matchRecordId).toEqual(expect.stringMatching(/^record-/));
      expect(archivedTable.paifuId).toEqual(expect.stringMatching(/^paifu-/));
    }

    const archivedRoundTables = await waitForRoundArchived(
      request,
      tournamentId,
      roundNumber,
    );
    expect(archivedRoundTables.every((table) => table.matchRecordId && table.paifuId)).toBe(true);
  }

  const archivedPage = await getStageTables(request, tournamentId);
  expect(archivedPage.total).toBe(tablesPerRound * roundCount);
  expect(archivedPage.items.every((table) => table.status === 'Archived')).toBe(true);
  expect(archivedPage.items.every((table) => table.matchRecordId && table.paifuId)).toBe(true);

  const afterProfiles = await waitForEloSettlement(
    request,
    players,
    beforeProfiles,
  );
  const deltas = players.map(
    (player) =>
      afterProfiles[player.playerId].elo - beforeProfiles[player.playerId].elo,
  );

  expect(deltas.filter((delta) => delta !== 0).length).toBeGreaterThanOrEqual(
    Math.floor(playerCount * 0.75),
  );
  expect(deltas.reduce((sum, delta) => sum + delta, 0)).toBe(0);
  expect(Math.max(...deltas)).toBeGreaterThan(0);
  expect(Math.min(...deltas)).toBeLessThan(0);

  const afterDashboards = await waitForDashboardRefreshes(
    request,
    players.slice(0, Math.min(8, players.length)),
    beforeDashboards,
  );
  expect(afterDashboards.every((dashboard) => dashboard.sampleSize >= roundCount)).toBe(true);

  for (const club of clubs.slice(0, 2)) {
    const dashboard = await getClubDashboard(
      request,
      club.id,
      club.creatorPlayerId,
    );
    expect(dashboard.sampleSize).toBeGreaterThan(0);
  }

  await loginRegistered(page, 'larry1', '12345678');
  await page.goto(`/public/tournaments/${tournamentId}`);
  await expect(page.getByText(tournamentName).first()).toBeVisible({
    timeout: 15_000,
  });
  await page.getByRole('button', { name: /牌桌/ }).first().click();
  const paifuLinks = page.getByRole('link', { name: /查看牌谱/ });
  await expect(paifuLinks.first()).toBeVisible({ timeout: 15_000 });
  expect(await paifuLinks.count()).toBeGreaterThanOrEqual(1);
  await expectNoCriticalText(page);
  await expectNoHorizontalOverflow(page);
  await expectPagePainted(page, testInfo, 'large-tournament-public-tables');

  await paifuLinks.first().click();
  await expect(page).toHaveURL(/\/tables\/.+\/paifu$/);
  await expect(page.getByText(tournamentName).first()).toBeVisible({
    timeout: 15_000,
  });
  await expectTileImagesLoaded(page);
  await expectNoCriticalText(page);
  await expectNoHorizontalOverflow(page);
  await expectPagePainted(page, testInfo, 'large-tournament-paifu');
});

async function createPlayers(request: APIRequestContext) {
  return mapInBatches(
    Array.from({ length: playerCount }, (_, index) => index),
    8,
    async (index) =>
      postApi<PlayerProfileView>(request, 'createplayerapi', {
        request: {
          userId: `${prefix}-user-${String(index + 1).padStart(2, '0')}`,
          nickname: `Large Player ${String(index + 1).padStart(2, '0')}`,
          rankPlatform: 'MahjongSoul',
          tier: 'Novice',
          stars: null,
          initialElo: 1500,
        },
      }),
  );
}

async function createClubsAndMemberships(
  request: APIRequestContext,
  players: PlayerProfileView[],
) {
  const groups = Array.from({ length: clubCount }, (_, clubIndex) =>
    players.filter((_, playerIndex) => playerIndex % clubCount === clubIndex),
  ).filter((group) => group.length > 0);
  const clubs: ClubWithCreator[] = [];

  for (const [index, members] of groups.entries()) {
    const creator = members[0];
    const club = await postApi<ClubView>(request, 'createclubapi', {
      name: `E2E Large Club ${prefix} ${String(index + 1).padStart(2, '0')}`,
      creatorId: creator.playerId,
    });

    for (const member of members.slice(1)) {
      await postApi<ClubView>(request, 'addclubmemberapi', {
        clubId: club.id,
        playerId: member.playerId,
        operatorId: null,
      });
    }

    clubs.push({ ...club, creatorPlayerId: creator.playerId });
  }

  return clubs;
}

async function createLargeTournament(
  request: APIRequestContext,
  participantCount: number,
) {
  return postApi<TournamentSummaryView>(request, 'tournamentcreateapi', {
    request: {
      name: tournamentName,
      organizer: tournamentOrganizer,
      startsAt: '2026-06-06T00:00:00Z',
      endsAt: '2026-06-07T00:00:00Z',
      adminId: null,
      stages: [
        {
          id: stageId,
          name: stageName,
          format: 'Swiss',
          order: 1,
          roundCount,
          pairingMethod: 'balanced-elo',
          carryOverPoints: true,
          maxRounds: roundCount,
          schedulingPoolSize: participantCount,
          mahjongRuleset: {
            gameLength: 'Tonpu',
            initialPoints,
            targetPoints: 30000,
            akaDora: true,
            akaDoraCount: 3,
            openTanyao: true,
            doubleRon: true,
            tripleRonAbortiveDraw: false,
            nagashiMangan: true,
            allowMultipleYakuman: true,
            bankruptcyEnd: true,
            allLastDealerFinishAsTop: false,
            minHan: 1,
          },
        },
      ],
    },
  });
}

async function getStageTables(
  request: APIRequestContext,
  tournamentId: string,
) {
  return postApi<ListEnvelope<TournamentTableView>>(
    request,
    'tournamentstagetablesapi',
    {
      tournamentId,
      stageId,
      query: {
        limit: 100,
        offset: 0,
      },
    },
  );
}

async function finalizeTournamentTable(
  request: APIRequestContext,
  table: TournamentTableView,
) {
  return postApi<TournamentTableView>(
    request,
    'tournamenttablefinalizearchiveapi',
    {
      tableId: table.tableId,
      operatorId: superAdminPlayerId,
    },
  );
}

async function waitForRoundTables(
  request: APIRequestContext,
  tournamentId: string,
  roundNumber: number,
) {
  await expect
    .poll(
      async () => {
        const tables = await getStageTables(request, tournamentId);

        return tables.items.filter(
          (table) =>
            table.stageRoundNumber === roundNumber &&
            table.status === 'WaitingPreparation',
        ).length;
      },
      {
        message: `第 ${roundNumber} 轮应完成 ${tablesPerRound} 桌排桌`,
        timeout: 30_000,
      },
    )
    .toBe(tablesPerRound);

  const tables = await getStageTables(request, tournamentId);

  return tables.items
    .filter((table) => table.stageRoundNumber === roundNumber)
    .sort((left, right) => left.tableNo - right.tableNo);
}

async function waitForRoundArchived(
  request: APIRequestContext,
  tournamentId: string,
  roundNumber: number,
) {
  await expect
    .poll(
      async () => {
        const tables = await getStageTables(request, tournamentId);

        return tables.items.filter(
          (table) =>
            table.stageRoundNumber === roundNumber &&
            table.status === 'Archived',
        ).length;
      },
      {
        message: `第 ${roundNumber} 轮应全部归档`,
        timeout: 30_000,
      },
    )
    .toBe(tablesPerRound);

  const tables = await getStageTables(request, tournamentId);

  return tables.items
    .filter((table) => table.stageRoundNumber === roundNumber)
    .sort((left, right) => left.tableNo - right.tableNo);
}

function assertRoundTables(tables: TournamentTableView[], roundNumber: number) {
  expect(tables).toHaveLength(tablesPerRound);
  expect(tables.every((table) => table.stageRoundNumber === roundNumber)).toBe(true);
  expect(tables.every((table) => table.seats.length === 4)).toBe(true);
  expect(new Set(tables.flatMap((table) => table.seats.map((seat) => seat.playerId))).size).toBe(playerCount);
  expect(new Set(tables.flatMap((table) => table.seats.map((seat) => seat.clubId)).filter(Boolean)).size).toBeGreaterThan(1);
}

async function getPlayerProfiles(
  request: APIRequestContext,
  players: PlayerProfileView[],
) {
  const entries = await mapInBatches(players, 16, async (player) => [
    player.playerId,
    await getPlayerProfile(request, player.playerId),
  ] as const);

  return Object.fromEntries(entries) as Record<string, PlayerProfileView>;
}

async function getPlayerProfile(
  request: APIRequestContext,
  playerId: string,
) {
  return postApi<PlayerProfileView>(request, 'getplayerapi', { playerId });
}

async function getPlayerDashboards(
  request: APIRequestContext,
  players: PlayerProfileView[],
) {
  return mapInBatches(players, 8, (player) =>
    getPlayerDashboard(request, player.playerId, player.playerId),
  );
}

async function getPlayerDashboard(
  request: APIRequestContext,
  playerId: string,
  operatorId: string,
) {
  return postApi<DashboardView>(request, 'opsanalyticsplayerdashboardapi', {
    playerId,
    operatorId,
  });
}

async function getClubDashboard(
  request: APIRequestContext,
  clubId: string,
  operatorId: string,
) {
  return postApi<DashboardView>(request, 'opsanalyticsclubdashboardapi', {
    clubId,
    operatorId,
  });
}

async function waitForEloSettlement(
  request: APIRequestContext,
  players: PlayerProfileView[],
  beforeProfiles: Record<string, PlayerProfileView>,
) {
  await expect
    .poll(
      async () => {
        const afterProfiles = await getPlayerProfiles(request, players);
        const deltas = players.map(
          (player) =>
            afterProfiles[player.playerId].elo !==
            beforeProfiles[player.playerId].elo,
        );
        const numericDeltas = players.map(
          (player) =>
            afterProfiles[player.playerId].elo -
            beforeProfiles[player.playerId].elo,
        );

        return (
          deltas.filter(Boolean).length >= Math.floor(players.length * 0.75) &&
          numericDeltas.reduce((sum, delta) => sum + delta, 0) === 0 &&
          Math.max(...numericDeltas) > 0 &&
          Math.min(...numericDeltas) < 0
        );
      },
      {
        message: '64 人大赛归档后应完成 ELO 结算并保持总分守恒',
        timeout: 30_000,
      },
    )
    .toBe(true);

  return getPlayerProfiles(request, players);
}

async function waitForDashboardRefreshes(
  request: APIRequestContext,
  players: PlayerProfileView[],
  beforeDashboards: DashboardView[],
) {
  await expect
    .poll(
      async () => {
        const afterDashboards = await getPlayerDashboards(request, players);

        return afterDashboards.filter(
          (dashboard, index) =>
            dashboard.version > beforeDashboards[index].version &&
            dashboard.sampleSize >= 1,
        ).length;
      },
      {
        message: '样本选手看板应在大赛归档后刷新',
        timeout: 30_000,
      },
    )
    .toBe(players.length);

  return getPlayerDashboards(request, players);
}

function buildRonPaifu(table: TournamentTableView, tableIndex: number) {
  const sortedSeats = [...table.seats].sort(
    (left, right) => seatOrder(left.seat) - seatOrder(right.seat),
  );
  const winner = sortedSeats[tableIndex % sortedSeats.length];
  const target = sortedSeats[(tableIndex + 1) % sortedSeats.length];
  const winAction: PaifuAction = {
    sequenceNo: 1,
    actor: winner.playerId,
    actionType: 'Win',
    tile: '3m',
    fromPlayer: target.playerId,
    targetSequenceNo: null,
    shantenAfterAction: null,
    handTilesAfterAction: null,
    revealedTiles: [],
    note: 'large tournament uploaded paifu',
  };
  const scoreChanges = sortedSeats.map((seat) => ({
    playerId: seat.playerId,
    delta:
      seat.playerId === winner.playerId
        ? ronPoints
        : seat.playerId === target.playerId
          ? -ronPoints
          : 0,
  }));
  const placements = finalPlacementOrder(sortedSeats, winner, target);

  return {
    id: `paifu-${prefix}-${String(table.tableNo).padStart(2, '0')}`,
    metadata: {
      recordedAt: new Date(Date.UTC(2026, 5, 6, 8, tableIndex, 0)).toISOString(),
      source: 'e2e-large-tournament',
      tableId: table.tableId,
      tournamentId: table.tournamentId,
      stageId: table.stageId,
      seats: sortedSeats.map((seat) => ({
        seat: seat.seat,
        playerId: seat.playerId,
        initialPoints: seat.initialPoints,
        disconnected: seat.disconnected,
        ready: seat.ready,
        clubId: seat.clubId ?? null,
      })),
      matchRecordId: null,
    },
    rounds: [
      {
        descriptor: {
          roundWind: 'East',
          handNumber: 1,
          honba: 0,
        },
        players: sortedSeats.map((seat, index) => ({
          playerId: seat.playerId,
          seat: seat.seat,
          initialHand: {
            tiles: initialHandTiles(index),
          },
          track: {
            events: seat.playerId === winner.playerId ? [winAction] : [],
          },
        })),
        timeline: {
          events: [winAction],
        },
        result: {
          outcome: 'Ron',
          winner: winner.playerId,
          target: target.playerId,
          han: 1,
          fu: 30,
          yaku: [{ kind: 'Riichi', han: 1 }],
          points: ronPoints,
          scoreChanges,
          doraIndicators: null,
          uraDoraIndicators: null,
          uraDoraVisible: null,
          tenpaiPlayerIds: null,
          settlement: null,
          wins: [
            {
              winner: winner.playerId,
              target: target.playerId,
              han: 1,
              fu: 30,
              yaku: [{ kind: 'Riichi', han: 1 }],
              points: ronPoints,
              doraIndicators: null,
              uraDoraIndicators: null,
              uraDoraVisible: null,
            },
          ],
        },
      },
    ],
    finalStandings: placements.map((seat, index) => ({
      playerId: seat.playerId,
      seat: seat.seat,
      finalPoints:
        seat.initialPoints +
        scoreChanges.find((change) => change.playerId === seat.playerId)!.delta,
      placement: index + 1,
      uma: 0,
      oka: 0,
    })),
  };
}

function finalPlacementOrder(
  seats: TableSeat[],
  winner: TableSeat,
  target: TableSeat,
) {
  return [
    winner,
    ...seats.filter(
      (seat) =>
        seat.playerId !== winner.playerId && seat.playerId !== target.playerId,
    ),
    target,
  ];
}

function initialHandTiles(index: number) {
  const hands = [
    ['1m', '1m', '2m', '2m', '3m', '3m', '4m', '4m', '5m', '5m', '6m', '6m', '7m'],
    ['1p', '1p', '2p', '2p', '3p', '3p', '4p', '4p', '5p', '5p', '6p', '6p', '7p'],
    ['1s', '1s', '2s', '2s', '3s', '3s', '4s', '4s', '5s', '5s', '6s', '6s', '7s'],
    ['1z', '1z', '2z', '2z', '3z', '3z', '4z', '4z', '5z', '5z', '6z', '6z', '7z'],
  ];

  return hands[index % hands.length];
}

function seatOrder(seat: string) {
  const orders: Record<string, number> = {
    East: 0,
    South: 1,
    West: 2,
    North: 3,
  };

  return orders[seat] ?? 99;
}

async function loginRegistered(
  page: Page,
  username: string,
  password: string,
) {
  await page.goto('/login');
  await page.locator('#login-username').fill(username);
  await page.locator('#login-password').fill(password);
  await page.getByRole('button', { name: '登录' }).click();
  await page.waitForURL(/\/public$/);
  await expect(page.getByText(username, { exact: true }).first()).toBeVisible();
}

async function expectNoCriticalText(page: Page) {
  await expect(page.getByText('页面刚才崩了一下')).toHaveCount(0);
  await expect(page.getByText('路由加载失败')).toHaveCount(0);
  await expect(page.getByText('Unexpected Application Error')).toHaveCount(0);
  await expect(page.getByText('Failed to fetch dynamically imported module')).toHaveCount(0);

  const bodyText = await page.locator('body').innerText();
  expect(bodyText).not.toMatch(/\bRequest failed\b/);
  expect(bodyText).not.toMatch(/\bDismiss\b/);
  expect(bodyText).not.toMatch(/\bSamples\b/);
  expect(bodyText).not.toMatch(/\bWin rate\b/);
  expect(bodyText).not.toMatch(/\bAverage placement\b/);
  expect(bodyText).not.toMatch(/\bRiichi rate\b/);
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(3);
}

async function expectTileImagesLoaded(page: Page) {
  await page.waitForFunction(() => {
    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>(
        'img[src*="/mahjong-soul/tiles/individual/"]',
      ),
    );

    return (
      images.length > 0 &&
      images.every((image) => image.complete && image.naturalWidth > 0)
    );
  });
}

async function expectPagePainted(
  page: Page,
  testInfo: TestInfo,
  screenshotName: string,
) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(250);
  const rootBox = await page.locator('#root').boundingBox();

  expect(rootBox).not.toBeNull();
  expect(rootBox?.width ?? 0).toBeGreaterThan(200);
  expect(rootBox?.height ?? 0).toBeGreaterThan(200);

  const screenshotPath = testInfo.outputPath(`${screenshotName}.png`);
  const screenshot = await page.screenshot({
    fullPage: true,
    path: screenshotPath,
  });

  expect(screenshot.length).toBeGreaterThan(20_000);
  expectPngHasVisualContent(screenshot);

  await testInfo.attach(`${screenshotName}.png`, {
    path: screenshotPath,
    contentType: 'image/png',
  });
}

function expectPngHasVisualContent(buffer: Buffer) {
  const image = PNG.sync.read(buffer);
  const stepX = Math.max(1, Math.floor(image.width / 90));
  const stepY = Math.max(1, Math.floor(image.height / 90));
  const sampledColors = new Set<string>();
  let nonTransparentPixels = 0;

  for (let y = 0; y < image.height; y += stepY) {
    for (let x = 0; x < image.width; x += stepX) {
      const offset = (image.width * y + x) * 4;
      const alpha = image.data[offset + 3];

      if (alpha === 0) {
        continue;
      }

      nonTransparentPixels += 1;
      sampledColors.add(
        [
          image.data[offset] >> 4,
          image.data[offset + 1] >> 4,
          image.data[offset + 2] >> 4,
        ].join(':'),
      );
    }
  }

  expect(nonTransparentPixels).toBeGreaterThan(100);
  expect(sampledColors.size).toBeGreaterThan(12);
}

async function postApi<T>(
  request: APIRequestContext,
  name: string,
  data: unknown,
) {
  const response = await request.post(`${apiBaseUrl}/${name}`, {
    data,
    timeout: 60_000,
  });

  if (!response.ok()) {
    throw new Error(`${name} ${response.status()}: ${await response.text()}`);
  }

  return (await response.json()) as T;
}

async function mapInBatches<T, R>(
  items: T[],
  batchSize: number,
  fn: (item: T, index: number) => Promise<R>,
) {
  const results: R[] = [];

  for (let start = 0; start < items.length; start += batchSize) {
    const batch = items.slice(start, start + batchSize);
    results.push(
      ...(await Promise.all(
        batch.map((item, index) => fn(item, start + index)),
      )),
    );
  }

  return results;
}

function cleanupLargeTournamentRows() {
  if (process.env.E2E_SKIP_DB_CLEANUP === '1') {
    return;
  }

  const safePrefix = sqlString(prefix);
  const safeTournamentName = sqlString(tournamentName);
  const safeOrganizer = sqlString(tournamentOrganizer);
  const sql = `
create temp table e2e_large_players as
  select id from players where user_id like '${safePrefix}-user-%';
create temp table e2e_large_clubs as
  select id from clubs where name like 'E2E Large Club ${safePrefix} %';
create temp table e2e_large_tournaments as
  select id from tournaments
  where name = '${safeTournamentName}' and organizer = '${safeOrganizer}';
create temp table e2e_large_tables as
  select id from tables
  where tournament_id in (select id from e2e_large_tournaments);

delete from mahjong_table_states
where table_id in (select id from e2e_large_tables);
delete from match_records
where tournament_id in (select id from e2e_large_tournaments);
delete from paifus
where tournament_id in (select id from e2e_large_tournaments);
delete from tournament_settlements
where tournament_id in (select id from e2e_large_tournaments);
delete from tables
where id in (select id from e2e_large_tables);
delete from notifications
where recipient_player_id in (select id from e2e_large_players)
   or source_id in (select id from e2e_large_tournaments)
   or source_id in (select id from e2e_large_clubs);
delete from advanced_stats_recompute_tasks
where owner_key in (select 'player:' || id from e2e_large_players)
   or owner_key in (select 'club:' || id from e2e_large_clubs);
delete from advanced_stats_boards
where owner_key in (select 'player:' || id from e2e_large_players)
   or owner_key in (select 'club:' || id from e2e_large_clubs);
delete from dashboards
where owner_key in (select 'player:' || id from e2e_large_players)
   or owner_key in (select 'club:' || id from e2e_large_clubs);
delete from tournaments
where id in (select id from e2e_large_tournaments);
delete from clubs
where id in (select id from e2e_large_clubs);
delete from players
where id in (select id from e2e_large_players);
`;

  execFileSync(
    'docker',
    [
      'exec',
      'riichi-nexus-postgres-dev',
      'psql',
      '-U',
      'db',
      '-d',
      'our_project',
      '-v',
      'ON_ERROR_STOP=1',
      '-c',
      sql,
    ],
    { stdio: 'pipe' },
  );
}

function sqlString(value: string) {
  return value.replaceAll("'", "''");
}

interface PlayerProfileView {
  playerId: string;
  userId: string;
  nickname: string;
  elo: number;
  clubId: string | null;
  affiliatedClubIds: string[];
}

interface ClubView {
  id: string;
  name: string;
  members: string[];
  admins: string[];
}

type ClubWithCreator = ClubView & {
  creatorPlayerId: string;
};

interface TournamentSummaryView {
  tournamentId: string;
  name: string;
  status: string;
  participatingPlayerIds: string[];
  stages: Array<{
    stageId: string;
    status: string;
  }>;
}

interface TournamentTableView {
  tableId: string;
  tableNo: number;
  tournamentId: string;
  stageId: string;
  seats: TableSeat[];
  stageRoundNumber: number;
  status: string;
  paifuId: string | null;
  matchRecordId: string | null;
}

interface TableSeat {
  seat: string;
  playerId: string;
  initialPoints: number;
  disconnected: boolean;
  ready: boolean;
  clubId: string | null;
}

interface PaifuAction {
  sequenceNo: number;
  actor: string | null;
  actionType: string;
  tile: string | null;
  fromPlayer: string | null;
  targetSequenceNo: number | null;
  shantenAfterAction: number | null;
  handTilesAfterAction: string[] | null;
  revealedTiles: string[];
  note: string | null;
}

interface DashboardView {
  sampleSize: number;
  version: number;
}

interface ListEnvelope<T> {
  items: T[];
  total: number;
}
