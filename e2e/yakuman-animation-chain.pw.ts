import { expect, test, type Page, type Route } from '@playwright/test';

const tableId = 'table-yakuman-chain';
const tournamentId = 'tournament-yakuman-chain';
const stageId = 'stage-yakuman-chain';
const eastPlayerId = 'player-east-yakuman';
const southPlayerId = 'player-south-yakuman';
const westPlayerId = 'player-west-yakuman';
const northPlayerId = 'player-north-yakuman';
const playerIds = [eastPlayerId, southPlayerId, westPlayerId, northPlayerId];

test.describe('役满动画链路', () => {
  test('赛事牌桌役满非终局会连续播到点数动画后再由东家推进新局', async ({
    page,
  }) => {
    test.setTimeout(45_000);
    const harness = await installLiveTableHarness(page, {
      terminalAfterAdvance: false,
    });

    await page.goto(`/tables/${tableId}`);
    await expect(page.locator('[aria-label="牌桌版本 v10"]')).toBeVisible({
      timeout: 10_000,
    });

    await expect(page.getByText('纯正九莲宝灯').first()).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText('荣和').first()).toBeVisible({
      timeout: 12_000,
    });
    await expect(page.getByText('点数结算').first()).toBeVisible({
      timeout: 12_000,
    });
    await expect(page.getByText('本局总点数').first()).toBeVisible();

    await expect(page.locator('[aria-label="牌桌版本 v11"]')).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText('东2局').first()).toBeVisible();
    expect(harness.advanceRequestCount()).toBe(1);
  });

  test('赛事牌桌役满终局会连续播到点数动画后显示终局结算', async ({
    page,
  }) => {
    test.setTimeout(45_000);
    const harness = await installLiveTableHarness(page, {
      terminalAfterAdvance: true,
    });

    await page.goto(`/tables/${tableId}`);
    await expect(page.locator('[aria-label="牌桌版本 v10"]')).toBeVisible({
      timeout: 10_000,
    });

    await expect(page.getByText('纯正九莲宝灯').first()).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText('荣和').first()).toBeVisible({
      timeout: 12_000,
    });
    await expect(page.getByText('点数结算').first()).toBeVisible({
      timeout: 12_000,
    });
    await expect(page.getByText('本局总点数').first()).toBeVisible();

    await expect(page.getByText('最终排名').first()).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText('牌桌结算').first()).toBeVisible();
    expect(harness.advanceRequestCount()).toBe(1);
  });

  test('牌谱页役满只在和牌弹窗前播放飞牌动画', async ({ page }) => {
    test.setTimeout(30_000);

    await page.goto(`/demo/tables/${tableId}/paifu`);
    await page.getByText(/东1局/).first().click();
    await page.getByRole('button', { name: '东1局2本场' }).click();

    await advanceReplayUntilYakumanResult(page);

    await expect(page.getByText('纯正九莲宝灯').first()).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText('荣和').first()).toBeVisible({
      timeout: 12_000,
    });
    await expect(page.getByText('最终排名')).toHaveCount(0);
  });
});

async function advanceReplayUntilYakumanResult(page: Page) {
  const yakumanText = page.getByText('纯正九莲宝灯').first();
  const forwardButton = page.getByRole('button', { name: '向前一步' });

  for (let step = 0; step < 20; step += 1) {
    if ((await yakumanText.count()) > 0 && await yakumanText.isVisible()) {
      return;
    }

    if (await forwardButton.isDisabled()) {
      return;
    }

    await forwardButton.click();
    await page.waitForTimeout(120);
  }
}

async function installLiveTableHarness(
  page: Page,
  {
    terminalAfterAdvance,
  }: {
    terminalAfterAdvance: boolean;
  },
) {
  let mahjongTable = createYakumanResultTable('RoundEnded', 10);
  let advanceRequests = 0;

  await page.addInitScript(
    ({ eastId }) => {
      window.localStorage.setItem(
        'riichi-nexus.auth.session',
        JSON.stringify({
          token: 'mock-yakuman-token',
          user: {
            userId: 'user-east-yakuman',
            username: 'east-yakuman',
            displayName: '东家测试',
            operatorId: eastId,
            roles: {
              isGuest: false,
              isRegisteredPlayer: true,
              isClubAdmin: false,
              isTournamentAdmin: false,
              isSuperAdmin: false,
            },
          },
        }),
      );
    },
    { eastId: eastPlayerId },
  );

  await page.route('**/api/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname;

    if (!/^\/api\/[^/]+api$/.test(pathname)) {
      await route.fallback();
      return;
    }

    const apiName = pathname.split('/').pop();

    switch (apiName) {
      case 'restoreauthsessionapi':
        await fulfillJson(route, createAuthSession());
        return;
      case 'getcurrentplayerapi':
        await fulfillJson(route, createPlayerProfile(eastPlayerId));
        return;
      case 'getplayerapi':
        await fulfillJson(route, createPlayerProfile(getRequestedPlayerId(route)));
        return;
      case 'listnotificationsapi':
        await fulfillJson(route, []);
        return;
      case 'getunreadnotificationcountapi':
        await fulfillJson(route, { unreadCount: 0 });
        return;
      case 'tournamenttablegetapi':
        await fulfillJson(route, createTournamentTableView());
        return;
      case 'mahjongcoregettableapi':
        await fulfillJson(route, mahjongTable);
        return;
      case 'mahjongcoreadvanceroundapi':
        advanceRequests += 1;
        mahjongTable = terminalAfterAdvance
          ? createYakumanResultTable('Finished', 11)
          : createNextRoundTable();
        await fulfillJson(route, mahjongTable);
        return;
      case 'mahjongcorearchivetableapi':
        mahjongTable = { ...mahjongTable, status: 'Archived', version: 12 };
        await fulfillJson(route, { table: mahjongTable, acceptedEvent: null });
        return;
      default:
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: `Unhandled mocked API ${apiName}` }),
        });
    }
  });

  return {
    advanceRequestCount: () => advanceRequests,
  };
}

function createAuthSession() {
  return {
    userId: 'user-east-yakuman',
    username: 'east-yakuman',
    displayName: '东家测试',
    authenticated: true,
    roles: {
      isGuest: false,
      isRegisteredPlayer: true,
      isClubAdmin: false,
      isTournamentAdmin: false,
      isSuperAdmin: false,
    },
  };
}

function createPlayerProfile(playerId: string) {
  return {
    playerId,
    userId: `user-${playerId}`,
    nickname: playerName(playerId),
    registeredAt: '2026-01-01T00:00:00.000Z',
    currentRank: {
      platform: 'MahjongSoul',
      rank: '雀士',
      rating: 1000,
      verifiedAt: null,
    },
    status: 'Active',
    elo: 1500,
    clubId: null,
    affiliatedClubIds: [],
    roles: {
      isGuest: false,
      isRegisteredPlayer: true,
      isClubAdmin: false,
      isTournamentAdmin: false,
      isSuperAdmin: false,
    },
    bannedReason: null,
  };
}

function createTournamentTableView() {
  return {
    tableId,
    tournamentId,
    stageId,
    tableNo: 1,
    seats: playerIds.map((playerId, index) => ({
      seat: ['East', 'South', 'West', 'North'][index],
      playerId,
      initialPoints: 25000,
      disconnected: false,
      ready: true,
      clubId: null,
    })),
    stageRoundNumber: 1,
    bracketMatchId: null,
    bracketRoundNumber: null,
    status: 'InProgress',
    startedAt: '2026-01-01T00:00:00.000Z',
    scoringStartedAt: null,
    endedAt: null,
    paifuId: null,
    matchRecordId: null,
    appealTicketIds: [],
    resetCount: 0,
  };
}

function createYakumanResultTable(status: string, version: number) {
  return {
    tableId,
    status,
    ruleset: createRuleset(status === 'Finished' ? 'OneKyoku' : 'Tonpu'),
    seats: [
      createSeat('East', eastPlayerId, 89600, ['2m', '4m', '6m', '8m', '2s', '4s', '6s', '8s', '1z', '2z', '3z', '4z', '5z'], [
        createDiscard(1, eastPlayerId, '0p'),
      ]),
      createSeat('South', southPlayerId, 24000, ['1p', '1p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '9p', '9p'], []),
      createSeat('West', westPlayerId, 24000, ['1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '1m', '2m', '3m', '4m'], []),
      createSeat('North', northPlayerId, -37600, ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '5z', '6z', '7z', '2z'], []),
    ],
    currentRound: {
      descriptor: {
        roundWind: 'East',
        handNumber: 1,
        honba: 0,
      },
      phase: 'Finished',
      turnPlayerId: null,
      wallTileCount: 68,
      sticks: {
        riichi: 0,
        honba: 0,
      },
      doraIndicators: ['4z'],
      doraIndicatorVisibleCount: 1,
      pendingCall: null,
      result: {
        outcome: 'Ron',
        winner: southPlayerId,
        target: eastPlayerId,
        han: 26,
        fu: 0,
        yaku: [{ kind: 'PureChuurenPoutou', han: 26 }],
        doraIndicators: ['4z'],
        uraDoraIndicators: [],
        uraDoraVisible: false,
        points: 64000,
        scoreChanges: [
          { playerId: southPlayerId, delta: 64000 },
          { playerId: eastPlayerId, delta: -64000 },
        ],
        settlement: null,
        wins: [
          {
            winner: southPlayerId,
            target: eastPlayerId,
            han: 26,
            fu: 0,
            yaku: [{ kind: 'PureChuurenPoutou', han: 26 }],
            doraIndicators: ['4z'],
            uraDoraIndicators: [],
            uraDoraVisible: false,
            points: 64000,
          },
        ],
      },
    },
    legalActions: [],
    finishedRoundCount: 1,
    lastEventSequenceNo: 9,
    lastEvent: {
      sequenceNo: 9,
      actor: southPlayerId,
      actionType: 'Win',
      tile: '0p',
      tiles: [],
      note: null,
    },
    version,
  };
}

function createNextRoundTable() {
  return {
    tableId,
    status: 'InProgress',
    ruleset: createRuleset('Tonpu'),
    seats: [
      createSeat('East', eastPlayerId, 89600, ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '1p', '2p', '3p', '4p'], []),
      createSeat('South', southPlayerId, 24000, ['1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '5z', '6z', '7z', '2z'], []),
      createSeat('West', westPlayerId, 24000, ['1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '1z', '2z', '3z', '4z'], []),
      createSeat('North', northPlayerId, -37600, ['1m', '1m', '2m', '2m', '3m', '3m', '4m', '4m', '5m', '5m', '6m', '6m', '7m'], []),
    ],
    currentRound: {
      descriptor: {
        roundWind: 'East',
        handNumber: 2,
        honba: 0,
      },
      phase: 'PlayerTurn',
      turnPlayerId: eastPlayerId,
      wallTileCount: 69,
      sticks: {
        riichi: 0,
        honba: 0,
      },
      doraIndicators: ['3m'],
      doraIndicatorVisibleCount: 1,
      pendingCall: null,
      result: null,
    },
    legalActions: [],
    finishedRoundCount: 1,
    lastEventSequenceNo: 10,
    lastEvent: null,
    version: 11,
  };
}

function createSeat(
  seat: string,
  playerId: string,
  points: number,
  handTiles: string[],
  river: Array<ReturnType<typeof createDiscard>>,
) {
  return {
    seat,
    playerId,
    points,
    isDealer: seat === 'East',
    handTiles,
    drawTile: null,
    handTileCount: handTiles.length,
    melds: [],
    river,
    riichi: false,
    ippatsu: false,
    furiten: false,
    tenpai: null,
  };
}

function createDiscard(sequenceNo: number, playerId: string, tile: string) {
  return {
    sequenceNo,
    playerId,
    tile,
    tsumogiri: false,
    riichiDeclared: false,
    calledBy: southPlayerId,
  };
}

function createRuleset(gameLength: string) {
  return {
    gameLength,
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
}

function getRequestedPlayerId(route: Route) {
  const body = route.request().postDataJSON() as { playerId?: string; operatorId?: string };

  return body.playerId ?? body.operatorId ?? eastPlayerId;
}

async function fulfillJson(route: Route, body: unknown) {
  await route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

function playerName(playerId: string) {
  const names: Record<string, string> = {
    [eastPlayerId]: '东家测试',
    [southPlayerId]: '南家役满',
    [westPlayerId]: '西家测试',
    [northPlayerId]: '北家测试',
  };

  return names[playerId] ?? playerId;
}
