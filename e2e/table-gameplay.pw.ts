import {
  expect,
  test,
  type APIRequestContext,
  type Browser,
  type Page,
  type TestInfo,
} from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { PNG } from 'pngjs';

const apiBaseUrl =
  process.env.E2E_API_BASE_URL ?? 'http://127.0.0.1:8080/api';
const tableId = process.env.E2E_TABLE_ID ?? 'table-be548ec5';
const tournamentId = process.env.E2E_TOURNAMENT_ID ?? 'tournament-3c30af19';
const stageId = process.env.E2E_STAGE_ID ?? 'stage-3b6fc7a8';
const larryClubId = process.env.E2E_CLUB_ID ?? 'club-6f2ba885';
const superAdminPlayerId = 'player-661d4fcc';

const players = [
  {
    username: 'larry1',
    password: '12345678',
    playerId: 'player-4e213d37',
  },
  {
    username: 'larry2',
    password: '12345678',
    playerId: 'player-1fdbf5db',
  },
  {
    username: 'larry3',
    password: '12345678',
    playerId: 'player-4e9c1c26',
  },
  {
    username: 'larry4',
    password: '12345678',
    playerId: 'player-b25d2cdf',
  },
] as const;

const playerById = Object.fromEntries(
  players.map((player) => [player.playerId, player]),
);

const tonpuRuleset = {
  gameLength: 'Tonpu',
  initialPoints: 25000,
  targetPoints: 30000,
  akaDora: true,
  akaDoraCount: 3,
  openTanyao: true,
  doubleRon: true,
  tripleRonAbortiveDraw: false,
  nagashiMangan: true,
  allowMultipleYakuman: true,
  bankruptcyEnd: true,
  minHan: 1,
};
const oneKyokuRuleset = {
  ...tonpuRuleset,
  gameLength: 'OneKyoku',
};

test.describe.configure({ mode: 'serial' });

test('四个账号可以在浏览器牌桌打一局到荣和结算并进入下一局', async ({
  baseURL,
  browser,
  request,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop-chromium',
    '多人牌局浏览器测试只在桌面项目跑一次，移动端由 UI smoke 覆盖。',
  );
  test.setTimeout(180_000);

  const errors: string[] = [];
  const pages = await openLoggedInTablePages(browser, baseURL, errors);

  try {
    clearArchivedTableRows();
    await resetTable(request);
    await startTable(request, 'e2e-browser-gameplay-2');

    for (const page of Object.values(pages)) {
      await page.goto(appUrl(baseURL, `/tables/${tableId}`));
      await expect(page.locator('#root')).toBeVisible();
      await waitForMahjongVersion(page, 1);
    }

    await expectTablePagePainted(
      pages['player-4e213d37'],
      testInfo,
      'gameplay-initial-table',
    );

    const playedActions: string[] = [];
    let resultState: MahjongTableView | null = null;

    for (let step = 0; step < 80; step += 1) {
      const state = await getTableView(request, players[0].playerId);

      if (state.currentRound?.result || isEndedStatus(state.status)) {
        resultState = state;
        break;
      }

      const actionTarget = await chooseNextAction(request, state);
      const page = pages[actionTarget.playerId];
      const beforeVersion = state.version;

      playedActions.push(
        `${playerById[actionTarget.playerId]?.username ?? actionTarget.playerId} ${actionTarget.action.commandType} ${actionTarget.action.tile ?? ''}`.trim(),
      );
      await submitMahjongActionAndWait({
        request,
        page,
        baseURL,
        beforeVersion,
        action: actionTarget.action,
        stepNumber: step + 1,
      });
    }

    resultState ??= await getTableView(request, players[0].playerId);
    const result = resultState.currentRound?.result;
    expect(
      result,
      `应完成结算，已执行动作：\n${playedActions.join('\n')}`,
    ).not.toBeNull();
    expect(result?.outcome).toBe('Ron');
    expect(result?.winner).toBe('player-b25d2cdf');
    expect(players.map((player) => player.playerId)).toContain(result?.target);
    expect(result?.target).not.toBe(result?.winner);
    expect(result?.wins ?? []).toHaveLength(1);

    const firstWin = result?.wins?.[0] as
      | { winner?: string | null; target?: string | null }
      | undefined;
    const scoreByPlayer = Object.fromEntries(
      (result?.scoreChanges ?? []).map((change) => [
        change.playerId,
        change.delta,
      ]),
    );

    expect(firstWin?.winner).toBe(result?.winner);
    expect(firstWin?.target).toBe(result?.target);
    const winnerDelta = scoreByPlayer[result?.winner ?? ''];
    const targetDelta = scoreByPlayer[result?.target ?? ''];

    expect(winnerDelta).toBeGreaterThan(0);
    expect(targetDelta).toBeLessThan(0);

    const eastPage = pages[getEastPlayerId(resultState)];
    await eastPage.goto(appUrl(baseURL, `/tables/${tableId}`));
    await waitForMahjongVersion(eastPage, resultState.version);
    await expect(
      eastPage.getByText('和').or(eastPage.getByText('点数结算')).first(),
    ).toBeVisible({ timeout: 20_000 });

    const winnerPage = pages['player-b25d2cdf'];
    const targetUsername = playerById[result?.target ?? '']?.username;

    expect(targetUsername).toBeTruthy();
    const nextRoundState = await waitForNextRound(request, resultState.version);
    expect(nextRoundState.status).toBe('WaitingPlayerAction');
    expect(nextRoundState.currentRound?.descriptor).toEqual({
      roundWind: 'East',
      handNumber: 2,
      honba: 0,
    });
    expect(nextRoundState.currentRound?.result ?? null).toBeNull();

    for (const page of Object.values(pages)) {
      await waitForMahjongVersion(page, nextRoundState.version);
      await expect(page.getByRole('button', { name: /点数结算/ })).toHaveCount(0);
    }
    await expectTablePagePainted(
      winnerPage,
      testInfo,
      'gameplay-next-round',
    );
  } finally {
    for (const page of Object.values(pages)) {
      await page.context().close();
    }
  }

  expect(errors, errors.join('\n')).toEqual([]);
});

test('一局战点完结算会归档牌桌，并刷新个人和俱乐部看板', async ({
  baseURL,
  browser,
  request,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop-chromium',
    '多人牌局浏览器测试只在桌面项目跑一次，移动端由 UI smoke 覆盖。',
  );
  test.setTimeout(180_000);

  const errors: string[] = [];
  const pages = await openLoggedInTablePages(browser, baseURL, errors);
  const adminPlayerId = 'player-4e213d37';

  try {
    const beforePlayerProfiles = await getPlayerProfiles(request);
    const beforePlayerDashboard = await getPlayerDashboard(
      request,
      adminPlayerId,
      adminPlayerId,
    );
    const beforeClubDashboard = await getClubDashboard(
      request,
      larryClubId,
      adminPlayerId,
    );

    clearArchivedTableRows();
    forceTournamentScheduledForRegression();
    await resetTable(request);
    await startTable(request, 'e2e-browser-gameplay-2', oneKyokuRuleset);

    for (const page of Object.values(pages)) {
      await page.goto(appUrl(baseURL, `/tables/${tableId}`));
      await expect(page.locator('#root')).toBeVisible();
      await waitForMahjongVersion(page, 1);
    }

    const playedActions: string[] = [];
    let resultState: MahjongTableView | null = null;

    for (let step = 0; step < 80; step += 1) {
      const state = await getTableView(request, players[0].playerId);

      if (state.currentRound?.result || isEndedStatus(state.status)) {
        resultState = state;
        break;
      }

      const actionTarget = await chooseNextAction(request, state);
      const page = pages[actionTarget.playerId];
      const beforeVersion = state.version;

      playedActions.push(
        `${playerById[actionTarget.playerId]?.username ?? actionTarget.playerId} ${actionTarget.action.commandType} ${actionTarget.action.tile ?? ''}`.trim(),
      );
      await submitMahjongActionAndWait({
        request,
        page,
        baseURL,
        beforeVersion,
        action: actionTarget.action,
        stepNumber: step + 1,
      });
    }

    resultState ??= await getTableView(request, players[0].playerId);
    expect(
      resultState.currentRound?.result,
      `应完成结算，已执行动作：\n${playedActions.join('\n')}`,
    ).toBeTruthy();
    expect(resultState.currentRound?.result?.outcome).toBe('Ron');

    const eastPage = pages[getEastPlayerId(resultState)];
    await eastPage.goto(appUrl(baseURL, `/tables/${tableId}`));
    await waitForMahjongVersion(eastPage, resultState.version);
    await expect(
      eastPage.getByText('和').or(eastPage.getByText('点数结算')).first(),
    ).toBeVisible({ timeout: 20_000 });
    await expect(eastPage.getByText('本局总点数').first()).toBeVisible({
      timeout: 20_000,
    });
    await expect(eastPage.getByText('完成牌桌').first()).toBeVisible();
    await expectTablePagePainted(
      eastPage,
      testInfo,
      'gameplay-one-kyoku-score-settlement',
    );

    const archivedState = await waitForArchivedTable(request, resultState.version);
    expect(archivedState.status).toBe('Archived');
    await expectArchivedViewsForAllPlayers(request);
    const scoringTable = await getTournamentTable(request);

    expect(scoringTable.status).toBe('Scoring');
    expect(scoringTable.matchRecordId).toEqual(expect.stringMatching(/^record-/));
    expect(scoringTable.paifuId).toEqual(expect.stringMatching(/^paifu-/));

    const archivedTable = await finalizeTournamentTable(request);
    const archivedMatchRecordId = archivedTable.matchRecordId;
    const archivedPaifuId = archivedTable.paifuId;

    expect(archivedTable.status).toBe('Archived');
    expect(archivedMatchRecordId).toEqual(expect.stringMatching(/^record-/));
    expect(archivedPaifuId).toEqual(expect.stringMatching(/^paifu-/));

    if (!archivedMatchRecordId || !archivedPaifuId) {
      throw new Error('归档牌桌应同时写入 MatchRecord 和 Paifu。');
    }

    const tablePaifus = await getTablePaifuList(request);
    const archivedPaifu = tablePaifus.items.find(
      (item) => item.paifuId === archivedPaifuId,
    );
    expect(archivedPaifu).toBeTruthy();
    expect(archivedPaifu?.matchRecordId).toBe(archivedMatchRecordId);
    expect(archivedPaifu?.totalHands).toBeGreaterThanOrEqual(1);

    const tournamentAfterArchive = await waitForTournamentNotScheduled(request);
    expect(tournamentAfterArchive.status).not.toBe('Scheduled');
    expect(
      tournamentAfterArchive.stages.find((stage) => stage.stageId === stageId)
        ?.status,
    ).toBe('Active');

    const afterPlayerDashboard = await waitForPlayerDashboardVersion(
      request,
      adminPlayerId,
      adminPlayerId,
      beforePlayerDashboard.version,
    );
    const afterClubDashboard = await waitForClubDashboardVersion(
      request,
      larryClubId,
      adminPlayerId,
      beforeClubDashboard.version,
    );
    const afterPlayerProfiles = await waitForPlayerEloChanges(
      request,
      beforePlayerProfiles,
    );
    const winnerId = resultState.currentRound?.result?.winner;
    const targetId = resultState.currentRound?.result?.target;
    const eloDeltaSum = players.reduce(
      (sum, player) =>
        sum +
        afterPlayerProfiles[player.playerId].elo -
        beforePlayerProfiles[player.playerId].elo,
      0,
    );

    expect(eloDeltaSum).toBe(0);
    expect(winnerId).toBeTruthy();
    expect(afterPlayerProfiles[winnerId!].elo).toBeGreaterThan(
      beforePlayerProfiles[winnerId!].elo,
    );
    expect(targetId).toBeTruthy();
    expect(afterPlayerProfiles[targetId!].elo).toBeLessThan(
      beforePlayerProfiles[targetId!].elo,
    );

    const adminPage = pages[adminPlayerId];
    await adminPage.goto(appUrl(baseURL, '/me'));
    await expect(adminPage.getByText('个人数据看板').first()).toBeVisible();
    await expect(adminPage.getByText('样本数').first()).toBeVisible();
    await expect(
      adminPage.getByText(String(afterPlayerDashboard.sampleSize)).first(),
    ).toBeVisible();
    await expect(
      adminPage.getByText(String(afterPlayerProfiles[adminPlayerId].elo)).first(),
    ).toBeVisible();
    await expectNoDashboardRegressionText(adminPage);
    await adminPage.reload({ waitUntil: 'domcontentloaded' });
    await expect(adminPage.getByText('个人数据看板').first()).toBeVisible();
    await expect(
      adminPage.getByText(String(afterPlayerDashboard.sampleSize)).first(),
    ).toBeVisible();
    await expectTablePagePainted(
      adminPage,
      testInfo,
      'gameplay-player-dashboard-after-refresh',
    );

    await adminPage.getByRole('button', { name: '历史牌谱' }).click();
    const historyRow = adminPage
      .locator('article')
      .filter({
        has: adminPage.locator(`a[href="/tables/${tableId}/paifu"]`),
      })
      .first();
    await expect(historyRow).toBeVisible();
    await historyRow.getByRole('button', { name: '查看摘要' }).click();
    await expect(
      adminPage.getByRole('heading', { name: '牌谱摘要' }),
    ).toBeVisible();
    await expect(adminPage.getByText(archivedMatchRecordId)).toBeVisible();
    await adminPage.getByRole('button', { name: '关闭' }).click();

    const historyPaifuLink = historyRow.getByRole('link', { name: '查看牌谱' });
    await expect(historyPaifuLink).toBeVisible();
    await historyPaifuLink.click();
    await expect(adminPage).toHaveURL(new RegExp(`/tables/${tableId}/paifu$`));
    await expect(adminPage.getByText('家庭纪念日大赛').first()).toBeVisible({
      timeout: 15_000,
    });
    await expectTileImagesLoaded(adminPage);
    await expectRealPaifuReplayWorks(adminPage);
    await expectNoDashboardRegressionText(adminPage);
    await expectTablePagePainted(
      adminPage,
      testInfo,
      'gameplay-history-paifu-link',
    );

    await adminPage.goto(appUrl(baseURL, '/member-hub'));
    await expect(
      adminPage.getByRole('heading', { name: '会员工作台' }),
    ).toBeVisible();
    await expect(adminPage.getByText('个人数据看板').first()).toBeVisible();
    await expect(adminPage.getByText('俱乐部数据看板').first()).toBeVisible();
    await expect(
      adminPage.getByText(String(afterClubDashboard.sampleSize)).first(),
    ).toBeVisible();
    await expectNoDashboardRegressionText(adminPage);

    const refreshButton = adminPage.getByRole('button', { name: '刷新' });
    await expect(refreshButton).toBeVisible();
    await refreshButton.click();
    await expect(adminPage.getByText('俱乐部数据看板').first()).toBeVisible();
    await expect(
      adminPage.getByText(String(afterClubDashboard.sampleSize)).first(),
    ).toBeVisible();
    await expectNoDashboardRegressionText(adminPage);
    await expectTablePagePainted(
      adminPage,
      testInfo,
      'gameplay-member-hub-dashboard-refresh',
    );

    await adminPage.goto(appUrl(baseURL, `/public/tournaments/${tournamentId}`));
    await expect(adminPage.getByText('家庭纪念日大赛').first()).toBeVisible();
    await expect(adminPage.getByText('已排期').first()).toHaveCount(0);
    await expect(adminPage.getByText('进行中').first()).toBeVisible();
    await adminPage.getByRole('button', { name: '牌桌' }).click();
    const paifuLink = adminPage.getByRole('link', { name: '查看牌谱' }).first();
    await expect(paifuLink).toBeVisible();
    await paifuLink.click();
    await expect(adminPage).toHaveURL(new RegExp(`/tables/${tableId}/paifu$`));
    await expect(adminPage.getByText('家庭纪念日大赛').first()).toBeVisible({
      timeout: 15_000,
    });
    await expectTileImagesLoaded(adminPage);
    await expectRealPaifuReplayWorks(adminPage);
    await expectNoDashboardRegressionText(adminPage);
    await expectTablePagePainted(
      adminPage,
      testInfo,
      'gameplay-paifu-after-archive',
    );

    await adminPage.reload({ waitUntil: 'domcontentloaded' });
    await expect(adminPage.getByText('家庭纪念日大赛').first()).toBeVisible({
      timeout: 15_000,
    });
    await expectTileImagesLoaded(adminPage);
    await expectNoDashboardRegressionText(adminPage);

    await adminPage.goto(appUrl(baseURL, `/tables/${tableId}`));
    await expect(adminPage.getByText('已归档').first()).toBeVisible({
      timeout: 15_000,
    });
    await expect(adminPage.getByText('点数结算').first()).toBeVisible({
      timeout: 20_000,
    });
    await expect(adminPage.getByText('关闭结算').first()).toBeVisible();
    await expect(adminPage.getByText('完成牌桌')).toHaveCount(0);
    await expect(adminPage.getByText('最终排名').first()).toBeVisible({
      timeout: 20_000,
    });
    await expect(adminPage.getByText('牌桌结算').first()).toBeVisible();
    await expect(adminPage.getByText('牌局状态读取失败')).toHaveCount(0);
    await expect(adminPage.getByText('完成牌桌')).toHaveCount(0);
    await expectNoDashboardRegressionText(adminPage);
    await expectTablePagePainted(
      adminPage,
      testInfo,
      'gameplay-archived-table-reopen',
    );
  } finally {
    for (const page of Object.values(pages)) {
      await page.context().close();
    }
  }

  expect(errors, errors.join('\n')).toEqual([]);
});

async function openLoggedInTablePages(
  browser: Browser,
  baseURL: string | undefined,
  errors: string[],
) {
  const entries = await Promise.all(
    players.map(async (player) => {
      const context = await browser.newContext({
        viewport: { width: 1365, height: 768 },
      });
      const page = await context.newPage();

      collectBrowserErrors(page, player.username, errors);
      await loginRegistered(page, baseURL, player.username, player.password);

      return [player.playerId, page] as const;
    }),
  );

  return Object.fromEntries(entries) as Record<string, Page>;
}

async function loginRegistered(
  page: Page,
  baseURL: string | undefined,
  username: string,
  password: string,
) {
  await page.goto(appUrl(baseURL, '/login'));
  await page.locator('#login-username').fill(username);
  await page.locator('#login-password').fill(password);
  await page.getByRole('button', { name: '登录' }).click();
  await page.waitForURL(/\/public$/);
  await expect(page.getByText(username, { exact: true }).first()).toBeVisible();
}

async function resetTable(request: APIRequestContext) {
  await postApi(request, 'mahjongcoreresettableapi', {
    tableId,
    request: {
      operatorId: players[0].playerId,
      note: 'playwright browser gameplay reset',
    },
  });
}

function clearArchivedTableRows() {
  if (process.env.E2E_SKIP_DB_CLEANUP === '1') {
    return;
  }

  const safeTableId = tableId.replaceAll("'", "''");
  const sql = `
delete from match_records where table_id = '${safeTableId}';
delete from paifus where table_id = '${safeTableId}';
update tables
set status = 'InProgress',
    payload = jsonb_set(
      jsonb_set(
        jsonb_set(payload, '{status}', '"InProgress"'::jsonb, true),
        '{matchRecordId}', 'null'::jsonb, true
      ),
      '{paifuId}', 'null'::jsonb, true
    )
where id = '${safeTableId}';
update mahjong_table_states
set archived_paifu_id = null,
    archived_match_record_id = null
where table_id = '${safeTableId}';
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

function forceTournamentScheduledForRegression() {
  if (process.env.E2E_SKIP_DB_CLEANUP === '1') {
    return;
  }

  const safeTournamentId = tournamentId.replaceAll("'", "''");
  const sql = `
update tournaments
set status = 'Scheduled',
    payload = jsonb_set(payload, '{status}', '"Scheduled"'::jsonb, true)
where id = '${safeTournamentId}';
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

async function startTable(
  request: APIRequestContext,
  seed: string,
  ruleset: typeof tonpuRuleset = tonpuRuleset,
) {
  await postApi(request, 'mahjongcorestarttableapi', {
    tableId,
    request: {
      operatorId: players[0].playerId,
      ruleset,
      seed,
    },
  });
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

async function getPlayerProfile(
  request: APIRequestContext,
  playerId: string,
) {
  return postApi<PlayerProfileView>(request, 'getplayerapi', {
    playerId,
  });
}

async function getPlayerProfiles(request: APIRequestContext) {
  const entries = await Promise.all(
    players.map(async (player) => [
      player.playerId,
      await getPlayerProfile(request, player.playerId),
    ] as const),
  );

  return Object.fromEntries(entries) as Record<string, PlayerProfileView>;
}

async function waitForPlayerEloChanges(
  request: APIRequestContext,
  beforeProfiles: Record<string, PlayerProfileView>,
) {
  await expect
    .poll(
      async () => {
        const afterProfiles = await getPlayerProfiles(request);

        return players.filter(
          (player) =>
            afterProfiles[player.playerId].elo !==
            beforeProfiles[player.playerId].elo,
        ).length;
      },
      {
        message: '玩家 ELO 应在牌桌归档后刷新',
        timeout: 20_000,
      },
    )
    .toBeGreaterThan(0);

  return getPlayerProfiles(request);
}

async function getPublicTournament(request: APIRequestContext) {
  return postApi<PublicTournamentView>(request, 'getpublictournamentapi', {
    tournamentId,
  });
}

async function getTournamentTable(request: APIRequestContext) {
  return postApi<TournamentTableView>(request, 'tournamenttablegetapi', {
    tableId,
  });
}

async function finalizeTournamentTable(request: APIRequestContext) {
  return postApi<TournamentTableView>(
    request,
    'tournamenttablefinalizearchiveapi',
    {
      tableId,
      operatorId: superAdminPlayerId,
    },
  );
}

async function getTablePaifuList(request: APIRequestContext) {
  return postApi<ListEnvelope<PaifuSummary>>(request, 'tournamentpaifulistapi', {
    query: {
      tableId,
    },
  });
}

async function getTableView(
  request: APIRequestContext,
  viewerPlayerId: string,
) {
  return postApi<MahjongTableView>(request, 'mahjongcoregettableapi', {
    tableId,
    query: {
      includeLegalActions: true,
      operatorId: viewerPlayerId,
      viewerPlayerId,
    },
  });
}

async function chooseNextAction(
  request: APIRequestContext,
  state: MahjongTableView,
) {
  if (state.currentRound?.phase === 'PlayerTurn') {
    const playerId = state.currentRound.turnPlayerId;

    if (!playerId) {
      throw new Error('PlayerTurn phase has no turnPlayerId.');
    }

    const view = await getTableView(request, playerId);
    const action =
      view.legalActions.find((candidate) => candidate.commandType === 'Tsumo') ??
      view.legalActions.find((candidate) => candidate.commandType === 'Riichi') ??
      view.legalActions
        .filter((candidate) => candidate.commandType === 'Discard')
        .sort((left, right) =>
          discardSortKey(left.tile).localeCompare(discardSortKey(right.tile)),
        )[0];

    if (!action) {
      throw new Error(`No legal player-turn action for ${playerId}.`);
    }

    return { playerId, action };
  }

  if (state.currentRound?.phase === 'CallDecision') {
    for (const player of players) {
      const view = await getTableView(request, player.playerId);

      if (view.legalActions.length === 0) {
        continue;
      }

      return {
        playerId: player.playerId,
        action:
          view.legalActions.find(
            (candidate) => candidate.commandType === 'Ron',
          ) ??
          view.legalActions.find(
            (candidate) => candidate.commandType === 'Pass',
          ) ??
          view.legalActions[0],
      };
    }

    throw new Error('CallDecision phase has no visible candidate action.');
  }

  throw new Error(
    `Unsupported mahjong state ${state.status}/${state.currentRound?.phase ?? 'none'}.`,
  );
}

async function waitForMahjongVersion(page: Page, version: number) {
  const versionBadge = page.locator(`[aria-label="牌桌版本 v${version}"]`);

  await expect(page.locator('#root')).toBeVisible();

  try {
    await expect(versionBadge).toBeVisible({
      timeout: 12_000,
    });
  } catch {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#root')).toBeVisible();
    await expect(versionBadge).toBeVisible({
      timeout: 12_000,
    });
  }
}

async function waitForMahjongVersionAdvance(
  request: APIRequestContext,
  beforeVersion: number,
  stepNumber: number,
  options: { throwOnTimeout?: boolean; timeout?: number } = {},
) {
  try {
    await expect
      .poll(
        async () => (await getTableView(request, players[0].playerId)).version,
        {
          message: `牌局版本应在第 ${stepNumber} 步后推进`,
          timeout: options.timeout ?? 15_000,
        },
      )
      .toBeGreaterThan(beforeVersion);

    return true;
  } catch (error) {
    if (options.throwOnTimeout === false) {
      return false;
    }

    throw error;
  }
}

async function submitMahjongActionAndWait({
  action,
  baseURL,
  beforeVersion,
  page,
  request,
  stepNumber,
}: {
  action: MahjongLegalAction;
  baseURL: string | undefined;
  beforeVersion: number;
  page: Page;
  request: APIRequestContext;
  stepNumber: number;
}) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const state = await getTableView(request, players[0].playerId);

    if (state.version > beforeVersion) {
      return;
    }

    await page.goto(appUrl(baseURL, `/tables/${tableId}`));
    await waitForMahjongVersion(page, beforeVersion);
    await clickMahjongAction(page, action);

    const didAdvance = await waitForMahjongVersionAdvance(
      request,
      beforeVersion,
      stepNumber,
      {
        throwOnTimeout: false,
        timeout: attempt === 3 ? 15_000 : 5_000,
      },
    );

    if (didAdvance) {
      return;
    }
  }

  const state = await getTableView(request, players[0].playerId);

  throw new Error(
    `牌局版本应在第 ${stepNumber} 步后推进，已重试 3 次；当前版本 ${state.version}，状态 ${state.status}/${state.currentRound?.phase ?? 'none'}。`,
  );
}

async function waitForNextRound(
  request: APIRequestContext,
  resultVersion: number,
) {
  await expect
    .poll(
      async () => {
        const state = await getTableView(request, players[0].playerId);

        return `${state.status}:${state.currentRound?.descriptor?.roundWind ?? ''}:${state.currentRound?.descriptor?.handNumber ?? ''}:${state.version}`;
      },
      {
        message: '结算确认后应进入东二局',
        timeout: 45_000,
      },
    )
    .toMatch(/^WaitingPlayerAction:East:2:/);

  const state = await getTableView(request, players[0].playerId);
  expect(state.version).toBeGreaterThan(resultVersion);

  return state;
}

async function waitForArchivedTable(
  request: APIRequestContext,
  resultVersion: number,
) {
  await expect
    .poll(
      async () => {
        const state = await getTableView(request, players[0].playerId);

        return `${state.status}:${state.version}`;
      },
      {
        message: '完成牌桌后应自动归档实时牌桌',
        timeout: 20_000,
      },
    )
    .toMatch(/^Archived:/);

  const state = await getTableView(request, players[0].playerId);
  expect(state.version).toBeGreaterThan(resultVersion);

  return state;
}

async function waitForTournamentNotScheduled(request: APIRequestContext) {
  await expect
    .poll(
      async () => (await getPublicTournament(request)).status,
      {
        message: '牌桌归档后赛事状态不应继续卡在已排期',
        timeout: 20_000,
      },
    )
    .not.toBe('Scheduled');

  return getPublicTournament(request);
}

async function expectArchivedViewsForAllPlayers(request: APIRequestContext) {
  const views = await Promise.all(
    players.map((player) => getTableView(request, player.playerId)),
  );

  for (const view of views) {
    expect(view.status).toBe('Archived');
    expect(view.legalActions).toEqual([]);
    expect(view.currentRound?.result?.outcome).toBe('Ron');
  }
}

async function waitForPlayerDashboardVersion(
  request: APIRequestContext,
  playerId: string,
  operatorId: string,
  previousVersion: number,
) {
  await expect
    .poll(
      async () =>
        (await getPlayerDashboard(request, playerId, operatorId)).version,
      {
        message: '个人看板版本应在牌桌归档后刷新',
        timeout: 20_000,
      },
    )
    .toBeGreaterThan(previousVersion);

  return getPlayerDashboard(request, playerId, operatorId);
}

async function waitForClubDashboardVersion(
  request: APIRequestContext,
  clubId: string,
  operatorId: string,
  previousVersion: number,
) {
  await expect
    .poll(
      async () => (await getClubDashboard(request, clubId, operatorId)).version,
      {
        message: '俱乐部看板版本应在牌桌归档后刷新',
        timeout: 20_000,
      },
    )
    .toBeGreaterThan(previousVersion);

  return getClubDashboard(request, clubId, operatorId);
}

async function clickMahjongAction(page: Page, action: MahjongLegalAction) {
  if (action.commandType === 'Discard') {
    const discardButton = page
      .getByRole('button', { name: `打出 ${tileText(action.tile)}` })
      .first();

    await expect(discardButton).toBeEnabled({ timeout: 15_000 });
    await discardButton.click();
    return;
  }

  const label = getActionLabel(action);
  const actionButton = page.getByRole('button', { exact: true, name: label });

  await expect(actionButton).toBeEnabled({ timeout: 15_000 });
  await actionButton.click();

  if (action.commandType === 'Riichi') {
    const riichiDiscardButton = page
      .getByRole('button', { name: `打出 ${tileText(action.tile)}` })
      .first();

    await expect(riichiDiscardButton).toBeEnabled({ timeout: 15_000 });
    await riichiDiscardButton.click();
  }
}

function getActionLabel(action: MahjongLegalAction) {
  const labels: Record<string, string> = {
    AbortiveDraw: '流局',
    AddedKan: '杠',
    Chi: '吃',
    ClosedKan: '杠',
    OpenKan: '杠',
    Pass: '跳过',
    Pon: '碰',
    Riichi: '立直',
    Ron: '荣和',
    Tsumo: '自摸',
  };

  return labels[action.commandType] ?? action.commandType;
}

async function postApi<T>(
  request: APIRequestContext,
  name: string,
  data: unknown,
) {
  const response = await request.post(`${apiBaseUrl}/${name}`, { data });

  if (!response.ok()) {
    throw new Error(`${name} ${response.status()}: ${await response.text()}`);
  }

  return (await response.json()) as T;
}

function appUrl(baseURL: string | undefined, path: string) {
  return new URL(path, baseURL ?? 'http://127.0.0.1:5173').toString();
}

function collectBrowserErrors(page: Page, label: string, errors: string[]) {
  page.on('pageerror', (error) => {
    errors.push(`${label}: ${error.message}`);
  });
  page.on('console', (message) => {
    if (message.type() !== 'error') {
      return;
    }

    const text = message.text();

    if (text.includes('Failed to load resource')) {
      return;
    }

    errors.push(`${label}: ${text}`);
  });
}

async function expectTablePagePainted(
  page: Page,
  testInfo: TestInfo,
  screenshotName: string,
) {
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

async function expectRealPaifuReplayWorks(page: Page) {
  const perspectiveButton = page.getByRole('button', { name: /视角：/ });
  const initialPerspective = await perspectiveButton.innerText();

  await expect(perspectiveButton).toBeVisible();
  await page.getByRole('button', { name: /东\d局\d本场/ }).first().click();
  expect(
    await page.getByRole('button', { name: /东\d局\d本场/ }).count(),
  ).toBeGreaterThanOrEqual(1);
  await page.getByRole('button', { name: /东\d局\d本场/ }).last().click();

  await perspectiveButton.click();
  await expect
    .poll(() => perspectiveButton.innerText(), {
      message: '牌谱视角按钮应能切换到下一家',
      timeout: 5_000,
    })
    .not.toBe(initialPerspective);

  await page.getByRole('button', { name: '只亮自家' }).click();
  await expect(page.getByRole('button', { name: '亮四家' })).toBeVisible();
  await page.getByRole('button', { name: '亮四家' }).click();
  await expect(page.getByRole('button', { name: '只亮自家' })).toBeVisible();

  const backwardButton = page.getByRole('button', { name: '回退一步' });
  const forwardButton = page.getByRole('button', { name: '向前一步' });

  await expect(backwardButton).toBeDisabled();
  await forwardButton.click();
  await expect(backwardButton).toBeEnabled();
  await backwardButton.click();
  await expect(backwardButton).toBeDisabled();

  for (let index = 0; index < 200; index += 1) {
    const resultOverlay = page
      .getByRole('button', { name: /荣和|自摸|流局满贯|点数结算/ })
      .first();

    if ((await resultOverlay.count()) > 0 && await resultOverlay.isVisible()) {
      break;
    }

    if (await forwardButton.isDisabled()) {
      break;
    }

    await forwardButton.click();
    await page.waitForTimeout(80);
  }

  const resultOverlay = page
    .getByRole('button', { name: /荣和|自摸|流局满贯|点数结算/ })
    .first();
  await expect(resultOverlay).toBeVisible({ timeout: 10_000 });

  const continueButton = page.getByRole('button', { name: '继续' }).first();
  if ((await continueButton.count()) > 0 && await continueButton.isVisible()) {
    await continueButton.click();
    await expect(
      page.getByRole('button', { name: /点数结算/ }),
    ).toBeVisible();
  }
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

async function expectNoDashboardRegressionText(page: Page) {
  await expect(page.getByText('Unexpected Application Error')).toHaveCount(0);
  await expect(page.getByText('Failed to fetch dynamically imported module')).toHaveCount(0);
  const bodyText = await page.locator('body').innerText();

  expect(bodyText).not.toMatch(/\bRequest failed\b/);
  expect(bodyText).not.toMatch(/\bDismiss\b/);
  expect(bodyText).not.toMatch(/\bReload\b/);
  expect(bodyText).not.toMatch(/\bPlayer Dashboard\b/);
  expect(bodyText).not.toMatch(/\bClub Dashboard\b/);
  expect(bodyText).not.toMatch(/\bSamples\b/);
  expect(bodyText).not.toMatch(/\bWin rate\b/);
  expect(bodyText).not.toMatch(/\bAverage placement\b/);
  expect(bodyText).not.toMatch(/\bRiichi rate\b/);
}

function tileText(tile: string | null) {
  return tile ?? '';
}

function discardSortKey(tile: string | null) {
  const value = tileText(tile);

  return /^0[mps]$/.test(value) ? `5${value[1]}-red` : value;
}

function getEastPlayerId(state: MahjongTableView) {
  const eastPlayerId = state.seats.find((seat) => seat.seat === 'East')?.playerId;

  if (!eastPlayerId) {
    throw new Error('当前牌桌没有东家。');
  }

  return eastPlayerId;
}

function isEndedStatus(status: string) {
  return status === 'RoundEnded' || status === 'Finished';
}

interface MahjongTableView {
  status: string;
  seats: MahjongSeatView[];
  currentRound: MahjongRoundView | null;
  legalActions: MahjongLegalAction[];
  version: number;
}

interface MahjongSeatView {
  seat: string;
  playerId: string;
}

interface MahjongRoundView {
  phase: string;
  turnPlayerId: string | null;
  descriptor: KyokuDescriptor | null;
  result: AgariResult | null;
}

interface KyokuDescriptor {
  roundWind: string;
  handNumber: number;
  honba: number;
}

interface MahjongLegalAction {
  commandType: string;
  tile: string | null;
  tiles: string[];
  targetSequenceNo: number | null;
}

interface AgariResult {
  outcome: string;
  winner: string | null;
  target: string | null;
  scoreChanges: ScoreChange[];
  wins?: unknown[];
}

interface ScoreChange {
  playerId: string;
  delta: number;
}

interface DashboardView {
  owner: string;
  sampleSize: number;
  version: number;
}

interface PlayerProfileView {
  playerId: string;
  nickname: string;
  elo: number;
}

interface PublicTournamentView {
  status: string;
  stages: PublicTournamentStageView[];
}

interface PublicTournamentStageView {
  stageId: string;
  status: string;
}

interface TournamentTableView {
  tableId: string;
  status: string;
  paifuId: string | null;
  matchRecordId: string | null;
}

interface ListEnvelope<T> {
  items: T[];
  total: number;
}

interface PaifuSummary {
  paifuId: string;
  matchRecordId: string | null;
  totalHands: number;
}
