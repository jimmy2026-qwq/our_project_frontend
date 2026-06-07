import {
  expect,
  test,
  type APIRequestContext,
  type Browser,
  type Page,
} from '@playwright/test';
import { execFileSync } from 'node:child_process';

const apiBaseUrl =
  process.env.E2E_API_BASE_URL ?? 'http://127.0.0.1:8080/api';
const tableId = process.env.E2E_TABLE_ID ?? 'table-be548ec5';
const tournamentId = process.env.E2E_TOURNAMENT_ID ?? 'tournament-3c30af19';

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
) as Record<string, (typeof players)[number]>;

const terminalRuleset = {
  gameLength: 'OneKyoku',
  initialPoints: 25000,
  targetPoints: 30000,
  akaDora: true,
  akaDoraCount: 3,
  openTanyao: true,
  doubleRon: true,
  tripleRonAbortiveDraw: false,
  nagashiMangan: true,
  allowMultipleYakuman: true,
  bankruptcyEnd: false,
  minHan: 1,
};

test.describe.configure({ mode: 'serial' });

test('终局会按单局结算、点数动画、终局结算确认跳赛事详情', async ({
  baseURL,
  browser,
  request,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop-chromium',
    '终局结算链路只在桌面项目跑一次。',
  );
  test.setTimeout(240_000);

  clearArchivedTableRows();
  await resetTable(request);
  await startTable(request);

  const finalResultState = await autoPlayUntilTerminalResult(request);
  const eastPlayerId = getEastPlayerId(finalResultState);
  const eastPlayer = playerById[eastPlayerId];

  if (!eastPlayer) {
    throw new Error(`无法找到东家账号 ${eastPlayerId}。`);
  }

  expect(finalResultState.currentRound?.result?.outcome).toBeTruthy();

  const errors: string[] = [];
  const page = await openLoggedInPage(browser, baseURL, eastPlayer, errors);

  try {
    await page.goto(appUrl(baseURL, `/tables/${tableId}`));
    await waitForMahjongVersion(page, finalResultState.version);

    await expect(page.getByText(/东\d局/).first()).toBeVisible({
      timeout: 10_000,
    });

    await expect(page.getByText('点数结算').first()).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText('本局总点数').first()).toBeVisible({
      timeout: 20_000,
    });

    await expect(page.getByText('本局总点数').first()).toHaveCount(0, {
      timeout: 10_000,
    });
    await expect(page.getByText('最终排名').first()).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText('牌桌结算').first()).toBeVisible();

    await page.getByRole('button', { name: '确认' }).click();
    await expect(page).toHaveURL(
      new RegExp(`/public/tournaments/${tournamentId}$`),
      {
        timeout: 15_000,
      },
    );
    await expect(page.getByText('家庭纪念日大赛').first()).toBeVisible({
      timeout: 15_000,
    });
  } finally {
    await page.context().close();
  }

  expect(errors, errors.join('\n')).toEqual([]);
});

async function autoPlayUntilTerminalResult(
  request: APIRequestContext,
) {
  const playedActions: string[] = [];
  const resultState = await autoPlayCurrentRoundToResult(
    request,
    playedActions,
  );

  if (!resultState.currentRound?.result) {
    throw new Error('自动打牌结束后应处于有结果的小局。');
  }

  return resultState;
}

async function autoPlayCurrentRoundToResult(
  request: APIRequestContext,
  playedActions: string[],
) {
  for (let step = 1; step <= 180; step += 1) {
    const state = await getTableView(request, players[0].playerId);

    if (state.currentRound?.result) {
      return state;
    }

    const actionTarget = await chooseNextAction(request, state);
    const response = await postApi<MahjongActionResponse>(
      request,
      'mahjongcoresubmitactionapi',
      {
        tableId,
        request: {
          commandType: actionTarget.action.commandType,
          idempotencyKey: `terminal-${Date.now()}-${step}-${Math.random()
            .toString(36)
            .slice(2)}`,
          playerId: actionTarget.playerId,
          targetSequenceNo: actionTarget.action.targetSequenceNo,
          tile: actionTarget.action.tile,
          tiles: actionTarget.action.tiles,
        },
      },
    );

    playedActions.push(
      `${playerById[actionTarget.playerId]?.username ?? actionTarget.playerId} ${actionTarget.action.commandType} ${actionTarget.action.tile ?? ''}`.trim(),
    );

    if (response.table.currentRound?.result) {
      return response.table;
    }
  }

  const state = await getTableView(request, players[0].playerId);

  throw new Error(
    `当前小局未能在 180 步内结算，状态 ${state.status}/${state.currentRound?.phase ?? 'none'}。`,
  );
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
      view.legalActions
        .filter((candidate) => candidate.commandType === 'Discard')
        .sort((left, right) =>
          tileText(left.tile).localeCompare(tileText(right.tile)),
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

function getEastPlayerId(state: MahjongTableView) {
  const eastPlayerId = state.seats.find((seat) => seat.seat === 'East')?.playerId;

  if (!eastPlayerId) {
    throw new Error('当前牌桌没有东家。');
  }

  return eastPlayerId;
}

async function openLoggedInPage(
  browser: Browser,
  baseURL: string | undefined,
  player: (typeof players)[number],
  errors: string[],
) {
  const context = await browser.newContext({
    viewport: { width: 1365, height: 768 },
  });
  const page = await context.newPage();

  collectBrowserErrors(page, player.username, errors);
  await loginRegistered(page, baseURL, player.username, player.password);

  return page;
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
      note: 'playwright terminal final settlement reset',
    },
  });
}

async function startTable(request: APIRequestContext) {
  await postApi(request, 'mahjongcorestarttableapi', {
    tableId,
    request: {
      operatorId: players[0].playerId,
      ruleset: terminalRuleset,
      seed: 'e2e-terminal-final-settlement',
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

async function waitForMahjongVersion(page: Page, version: number) {
  await expect(page.locator('#root')).toBeVisible();
  await expect(page.locator(`[aria-label="牌桌版本 v${version}"]`)).toBeVisible({
    timeout: 15_000,
  });
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

function tileText(tile: string | null) {
  return tile ?? '';
}

interface MahjongActionResponse {
  table: MahjongTableView;
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
  tiles?: string[];
  targetSequenceNo: number | null;
}

interface AgariResult {
  outcome: string;
  winner: string | null;
}
