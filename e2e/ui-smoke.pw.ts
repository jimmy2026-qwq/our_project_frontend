import {
  expect,
  test as base,
  type APIRequestContext,
  type Locator,
  type Page,
  type TestInfo,
} from '@playwright/test';
import { PNG } from 'pngjs';

const apiBaseUrl =
  process.env.E2E_API_BASE_URL ?? 'http://127.0.0.1:8080/api';
const clubId = process.env.E2E_CLUB_ID ?? 'club-6f2ba885';
const tournamentId =
  process.env.E2E_TOURNAMENT_ID ?? 'tournament-3c30af19';
const stageId = process.env.E2E_STAGE_ID ?? 'stage-3b6fc7a8';
const tableId = process.env.E2E_TABLE_ID ?? 'table-be548ec5';
const larryPlayerId = 'player-4e213d37';
const superAdminPlayerId = 'player-661d4fcc';

const test = base.extend<{ guardedPage: Page }>({
  guardedPage: async ({ page }, use) => {
    const browserErrors: string[] = [];

    page.on('pageerror', (error) => {
      browserErrors.push(error.message);
    });
    page.on('console', (message) => {
      if (message.type() !== 'error') {
        return;
      }

      const text = message.text();

      if (text.includes('Failed to load resource')) {
        return;
      }

      browserErrors.push(text);
    });

    await use(page);

    expect(browserErrors, browserErrors.join('\n')).toEqual([]);
  },
});

test.describe('RiichiNexus browser UI smoke checks', () => {
  test('公共大厅可以游客进入、刷新，并保持中文 UI', async ({
    guardedPage: page,
  }, testInfo) => {
    await enterGuest(page);

    await expect(page.getByText('赛事大厅')).toBeVisible();
    await expect(page.getByText('俱乐部名录')).toBeVisible();
    await page.getByRole('button', { name: /俱乐部名录/ }).click();
    await expect(page.getByText("larry's club")).toBeVisible();
    await expectNoCriticalText(page);
    await expectNoHorizontalOverflow(page);

    await page.getByRole('button', { name: '刷新' }).first().click();
    await expect(page.getByText('公共大厅已刷新')).toBeVisible();
    await expectNoCriticalText(page);

    await expectPagePainted(page, testInfo, 'public-hall');
  });

  test('登录后系统消息弹层不会白屏，刷新后仍保持登录', async ({
    guardedPage: page,
  }, testInfo) => {
    await loginRegistered(page, 'larry1', '12345678');

    await page.getByRole('button', { name: '系统消息' }).click();
    await expect(page.locator('#notification-center')).toBeVisible();
    await expect(page.getByText('暂无系统消息').or(page.getByText('系统消息'))).toBeVisible();
    await expectNoCriticalText(page);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByLabel('进入个人主页')).toBeVisible();
    await page.getByLabel('进入个人主页').click();

    await expect(page).toHaveURL(/\/me$/);
    await expect(page.getByRole('heading', { name: '个人数据看板' })).toBeVisible();
    await expect(page.getByText('样本数')).toBeVisible();
    await expect(page.getByText('胜率')).toBeVisible();
    await expect(page.getByText('平均顺位')).toBeVisible();
    await expect(page.getByText('立直率')).toBeVisible();
    await expectNoCriticalText(page);
    await expectNoHorizontalOverflow(page);

    await expectPagePainted(page, testInfo, 'player-dashboard');
  });

  test('俱乐部详情成员状态和系统消息按钮不会重叠', async ({
    guardedPage: page,
  }, testInfo) => {
    await loginRegistered(page, 'larry1', '12345678');
    await page.goto(`/public/clubs/${clubId}`);

    await expect(page.getByText("larry's club")).toBeVisible();
    const memberBadge = page.getByText('已是俱乐部成员').first();
    await expect(memberBadge).toBeVisible();
    await expectNoOverlap(memberBadge, page.getByRole('button', { name: '系统消息' }));

    await page.getByRole('button', { name: '系统消息' }).click();
    await expect(page.locator('#notification-center')).toBeVisible();
    await expectNoCriticalText(page);
    await expectNoHorizontalOverflow(page);

    await expectPagePainted(page, testInfo, 'club-detail-member');
  });

  test('俱乐部管理员可以在浏览器提交关系调整申请但不会直接改关系', async ({
    guardedPage: page,
    request,
  }, testInfo) => {
    const targetClub = await ensureRelationTargetClub(request);
    const requestNote = `playwright relation request ${Date.now()}`;

    await setClubRelationByApi(request, targetClub.id, 'Neutral');
    await loginRegistered(page, 'larry1', '12345678');
    await page.goto(`/public/clubs/${clubId}`);
    await expect(page.getByText("larry's club")).toBeVisible();
    await expect(page.getByRole('button', { name: '管理关系' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: '申请关系调整' })).toBeVisible({
      timeout: 15_000,
    });
    await expectDirectRelationUpdateDenied(request, targetClub.id);

    try {
      await submitClubRelationRequestInBrowser(
        page,
        targetClub.name,
        '联盟',
        requestNote,
      );
      await expectClubRelation(request, targetClub.id, null);
      await expectRelationRequestNotification(
        request,
        targetClub.id,
        'Alliance',
        requestNote,
      );
      await expectNoCriticalText(page);
      await expectNoHorizontalOverflow(page);

      await expectPagePainted(page, testInfo, 'club-relation-request');
    } finally {
      await setClubRelationByApi(request, targetClub.id, 'Neutral');
    }
  });

  test('平台超管可以在浏览器直接管理俱乐部关系', async ({
    guardedPage: page,
    request,
  }, testInfo) => {
    const targetClub = await ensureRelationTargetClub(request);

    await setClubRelationByApi(request, targetClub.id, 'Neutral');
    await loginRegistered(page, 'qingyu', '12345678');
    await page.goto(`/public/clubs/${clubId}`);
    await expect(page.getByText("larry's club")).toBeVisible();
    await expect(page.getByRole('button', { name: '申请关系调整' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: '管理关系' })).toBeVisible({
      timeout: 15_000,
    });

    try {
      await updateClubRelationInBrowser(page, targetClub.name, '对抗');
      await expectClubRelation(request, targetClub.id, 'Rivalry');
      await expectNoCriticalText(page);
      await expectNoHorizontalOverflow(page);

      await expectPagePainted(page, testInfo, 'club-relation-superadmin');
    } finally {
      await setClubRelationByApi(request, targetClub.id, 'Neutral');
    }
  });

  test('赛事详情显示规则、牌桌入口和中文规则项', async ({
    guardedPage: page,
  }, testInfo) => {
    await enterGuest(page);
    await page.goto(`/public/tournaments/${tournamentId}`);

    await expect(page.getByText('家庭纪念日大赛')).toBeVisible();
    await page.getByRole('button', { name: '规则说明' }).click();
    await expect(page.getByText('当前阶段规则')).toBeVisible();
    await expect(page.getByText(/牌局长度：/)).toBeVisible();
    await expect(page.getByText(/初始点数：/)).toBeVisible();
    await expect(page.getByText(/返还点\/目标点：/)).toBeVisible();
    await expect(page.getByText(/赤宝牌：/)).toBeVisible();
    await expect(page.getByText(/食断：/)).toBeVisible();
    await expect(page.getByText(/双响：/)).toBeVisible();

    await page.getByRole('button', { name: '牌桌' }).click();
    await expect(page.getByRole('link', { name: /进入牌桌|查看牌谱/ }).first()).toBeVisible();
    await expectNoCriticalText(page);
    await expectNoHorizontalOverflow(page);

    await expectPagePainted(page, testInfo, 'tournament-detail');
  });

  test('演示牌谱页面能显示牌图，截图不是空白', async ({
    guardedPage: page,
  }, testInfo) => {
    await page.goto(`/demo/tables/${tableId}/paifu`);

    await expect(page.locator('img[src*="/mahjong-soul/tiles/individual/"]').first()).toBeVisible();
    await expectTileImagesLoaded(page);
    await expectNoCriticalText(page);
    await expectNoHorizontalOverflow(page);

    await expectPagePainted(page, testInfo, 'demo-paifu');
  });

  test('真实牌桌页登录后可以打开且不出现路由白屏', async ({
    guardedPage: page,
  }, testInfo) => {
    await loginRegistered(page, 'larry1', '12345678');
    await page.goto(`/tables/${tableId}`);

    await expect(page.locator('#root')).toBeVisible();
    await expectNoCriticalText(page);
    await expectNoHorizontalOverflow(page);

    const tileImages = page.locator('img[src*="/mahjong-soul/tiles/individual/"]');
    if ((await tileImages.count()) > 0) {
      await expectTileImagesLoaded(page);
    }

    await expectPagePainted(page, testInfo, 'live-table');
  });

  test('常用按钮巡检：消息、刷新、标签页、规则弹层和牌谱回放', async ({
    guardedPage: page,
  }, testInfo) => {
    await loginRegistered(page, 'larry1', '12345678');

    const notificationButton = page.getByRole('button', { name: '系统消息' });
    await notificationButton.click();
    await expect(page.locator('#notification-center')).toBeVisible();
    await expect(page.getByRole('button', { name: '全部已读' })).toBeVisible();
    await notificationButton.click();
    await expect(page.locator('#notification-center')).toHaveCount(0);

    await page.goto('/public');
    await page.getByRole('button', { name: /俱乐部名录/ }).click();
    await expect(page.getByText("larry's club")).toBeVisible();
    await page.getByRole('button', { name: /赛事大厅/ }).click();
    await expect(page.getByRole('heading', { name: '公开赛程' })).toBeVisible();
    await expect(page.getByLabel('赛事状态')).toBeVisible();
    await expect(page.getByLabel('赛事阶段')).toBeVisible();
    await expectNoCriticalText(page);
    await page.getByRole('button', { name: '刷新' }).first().click();
    await expect(page.getByText('公共大厅已刷新')).toBeVisible();

    await page.goto('/member-hub');
    await expect(page.getByRole('heading', { name: '会员工作台' })).toBeVisible();
    await page.getByRole('button', { name: '刷新' }).first().click();
    await expect(page.getByText('工作台范围')).toBeVisible();
    await expect(page.getByText('个人数据看板').first()).toBeVisible();

    await page.goto(`/public/tournaments/${tournamentId}`);
    await expect(page.getByText('家庭纪念日大赛').first()).toBeVisible();
    for (const tabName of ['赛事概览', '规则说明', '参赛名单', '赛事牌桌']) {
      await page.getByRole('button', { name: tabName }).click();
      await expectNoCriticalText(page);
      await expectNoHorizontalOverflow(page);
    }

    await page.getByRole('button', { name: '规则说明' }).click();
    const editRulesButton = page
      .getByRole('button', { name: /修改规则|创建规则/ })
      .first();
    if ((await editRulesButton.count()) > 0) {
      await editRulesButton.click();
      await expect(
        page.getByRole('dialog').getByText(/修改当前阶段规则|创建当前阶段规则/),
      ).toBeVisible();
      await expect(page.getByRole('button', { name: '一局战' })).toBeVisible();
      await expect(page.getByRole('button', { name: '东风战' })).toBeVisible();
      await expect(page.getByRole('button', { name: '半庄战' })).toBeVisible();
      await page.getByRole('button', { name: '取消' }).click();
      await expect(page.getByRole('dialog')).toHaveCount(0);
    }

    await page.goto(`/demo/tables/${tableId}/paifu`);
    await expectTileImagesLoaded(page);
    const roundButton = page.getByRole('button', { name: /东\d局\d本场/ }).first();
    await expect(roundButton).toBeVisible();
    await roundButton.click();
    await expect(page.getByRole('button', { name: /东\d局\d本场/ })).toHaveCount(
      await page.getByRole('button', { name: /东\d局\d本场/ }).count(),
    );
    await page.getByRole('button', { name: '向前一步' }).click();
    await expect(page.getByRole('button', { name: '回退一步' })).toBeEnabled();
    await page.getByRole('button', { name: '回退一步' }).click();
    await expect(page.getByRole('button', { name: '回退一步' })).toBeDisabled();
    await page.getByLabel('返回上一页').click();
    await expect(page.locator('#root')).toBeVisible();

    await expectNoCriticalText(page);
    await expectNoHorizontalOverflow(page);
    await expectPagePainted(page, testInfo, 'button-tour');
  });

  test('多实体读链路：公开俱乐部、赛事、赛程、牌桌、牌谱和多入口页面保持一致', async ({
    guardedPage: page,
    request,
  }, testInfo) => {
    await loginRegistered(page, 'larry1', '12345678');

    const clubs = await postApi<ListEnvelope<PublicClubEntry>>(
      request,
      'listpublicclubsapi',
      { limit: 20, offset: 0 },
    );
    const firstClubPage = await postApi<ListEnvelope<PublicClubEntry>>(
      request,
      'listpublicclubsapi',
      { limit: 1, offset: 0 },
    );
    const tournaments = await postApi<ListEnvelope<PublicTournamentSummary>>(
      request,
      'listpublictournamentsapi',
      { limit: 20, offset: 0 },
    );
    const schedules = await postApi<ListEnvelope<PublicScheduleEntry>>(
      request,
      'listpublicschedulesapi',
      { limit: 20, offset: 0 },
    );
    const stageTables = await postApi<ListEnvelope<TournamentTableEntry>>(
      request,
      'tournamentstagetablesapi',
      {
        query: { limit: 20, offset: 0 },
        stageId,
        tournamentId,
      },
    );
    const playerTables = await postApi<ListEnvelope<TournamentTableEntry>>(
      request,
      'tournamentstagetablesapi',
      {
        query: { limit: 20, offset: 0, playerId: larryPlayerId },
        stageId,
        tournamentId,
      },
    );
    const tablePaifus = await postApi<ListEnvelope<PaifuSummaryEntry>>(
      request,
      'tournamentpaifulistapi',
      {
        query: { limit: 20, offset: 0, stageId, tournamentId },
      },
    );

    expect(clubs.total).toBeGreaterThanOrEqual(1);
    expect(firstClubPage.items).toHaveLength(Math.min(1, firstClubPage.total));
    expect(tournaments.items.some((item) => item.tournamentId === tournamentId)).toBe(true);
    expect(schedules.items.some((item) => item.tournamentId === tournamentId)).toBe(true);
    expect(stageTables.items.some((item) => item.tableId === tableId)).toBe(true);
    expect(playerTables.items.length).toBeGreaterThanOrEqual(1);
    expect(
      playerTables.items.every((item) =>
        item.seats.some((seat) => seat.playerId === larryPlayerId),
      ),
    ).toBe(true);

    for (const status of new Set(stageTables.items.map((item) => item.status))) {
      const filteredTables = await postApi<ListEnvelope<TournamentTableEntry>>(
        request,
        'tournamentstagetablesapi',
        {
          query: { limit: 20, offset: 0, status },
          stageId,
          tournamentId,
        },
      );

      expect(filteredTables.items.every((item) => item.status === status)).toBe(true);
    }

    await page.goto('/public');
    await page.getByRole('button', { name: /俱乐部名录/ }).click();
    await expect(page.getByText(clubs.items[0].name).first()).toBeVisible();
    await page.getByRole('button', { name: /赛事大厅/ }).click();
    await expect(page.getByRole('heading', { name: '公开赛程' })).toBeVisible();
    await expectNoCriticalText(page);

    await page.goto(`/public/clubs/${clubs.items[0].clubId}`);
    await expect(page.getByText(clubs.items[0].name).first()).toBeVisible();
    await expectNoCriticalText(page);
    await expectNoHorizontalOverflow(page);

    await page.goto(`/public/tournaments/${tournamentId}`);
    await expect(page.getByText('家庭纪念日大赛').first()).toBeVisible();
    for (const tabName of ['赛事概览', '规则说明', '参赛名单', '赛事牌桌']) {
      await page.getByRole('button', { name: tabName }).click();
      await expectNoCriticalText(page);
      await expectNoHorizontalOverflow(page);
    }

    await page.getByRole('button', { name: '赛事牌桌' }).click();
    const visibleTableLinks = page.getByRole('link', {
      name: /进入牌桌|查看牌谱/,
    });
    await expect(visibleTableLinks.first()).toBeVisible();
    expect(await visibleTableLinks.count()).toBeGreaterThanOrEqual(
      Math.min(1, stageTables.items.length),
    );

    for (const table of stageTables.items.slice(0, 2)) {
      await page.goto(`/tables/${table.tableId}`);
      await expect(page.locator('#root')).toBeVisible();
      await expectNoCriticalText(page);
      await expectNoHorizontalOverflow(page);
    }

    const paifuTableId = tablePaifus.items[0]?.tableId ?? tableId;
    const paifuPath =
      tablePaifus.items.length > 0
        ? `/tables/${paifuTableId}/paifu`
        : `/demo/tables/${tableId}/paifu`;
    await page.goto(paifuPath);
    await expectTileImagesLoaded(page);
    await expectNoCriticalText(page);
    await expectNoHorizontalOverflow(page);
    await expectPagePainted(page, testInfo, 'multi-entity-read-chain');
  });
});

interface ListEnvelope<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

interface PublicClubEntry {
  clubId: string;
  name: string;
}

interface ClubView {
  id: string;
  name: string;
}

type ClubRelationKind = 'Alliance' | 'Rivalry' | 'Neutral';

interface PublicClubDetailView {
  relations: Array<{
    targetClubId: string;
    relation: ClubRelationKind;
  }>;
}

interface PublicTournamentSummary {
  tournamentId: string;
  name: string;
  status: string;
}

interface PublicScheduleEntry {
  tournamentId: string;
}

interface TournamentTableEntry {
  tableId: string;
  status: string;
  seats: Array<{
    playerId: string;
  }>;
}

interface PaifuSummaryEntry {
  tableId: string;
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

async function enterGuest(page: Page) {
  await page.goto('/login');
  await page.getByRole('button', { name: '游客进入' }).click();
  await page.waitForURL(/\/public$/);
  await expect(page.getByText('赛事大厅')).toBeVisible();
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
  await expect(page.getByText(username)).toBeVisible();
}

async function ensureRelationTargetClub(request: APIRequestContext) {
  return postApi<ClubView>(request, 'createclubapi', {
    name: 'E2E Relation Target Club',
    creatorId: 'player-1fdbf5db',
  });
}

async function setClubRelationByApi(
  request: APIRequestContext,
  targetClubId: string,
  relation: ClubRelationKind,
) {
  await postApi<ClubView>(request, 'updateclubrelationapi', {
    clubId,
    operatorId: superAdminPlayerId,
    targetClubId,
    relation,
    note: 'playwright relation cleanup',
  });
}

async function submitClubRelationRequestInBrowser(
  page: Page,
  targetClubName: string,
  relationLabel: '联盟' | '对抗' | '中立',
  note: string,
) {
  await page.getByRole('button', { name: '申请关系调整' }).click();
  const dialog = page.getByRole('dialog');

  await expect(dialog.getByText('申请关系调整')).toBeVisible();
  await dialog.getByLabel('目标俱乐部').selectOption({ label: targetClubName });
  await dialog.getByLabel('关系').selectOption({ label: relationLabel });
  await dialog.getByLabel('备注').fill(note);
  await dialog.getByRole('button', { name: '提交申请' }).click();
  await expect(dialog).toHaveCount(0, { timeout: 15_000 });
}

async function updateClubRelationInBrowser(
  page: Page,
  targetClubName: string,
  relationLabel: '联盟' | '对抗' | '中立',
) {
  await page.getByRole('button', { name: '管理关系' }).click();
  const dialog = page.getByRole('dialog');

  await expect(dialog.getByText('管理俱乐部关系')).toBeVisible();
  await dialog.getByLabel('目标俱乐部').selectOption({ label: targetClubName });
  await dialog.getByLabel('关系').selectOption({ label: relationLabel });
  await dialog.getByRole('button', { name: '确认更新' }).click();
  await expect(dialog).toHaveCount(0, { timeout: 15_000 });
}

async function expectDirectRelationUpdateDenied(
  request: APIRequestContext,
  targetClubId: string,
) {
  const response = await request.post(`${apiBaseUrl}/updateclubrelationapi`, {
    data: {
      clubId,
      operatorId: larryPlayerId,
      targetClubId,
      relation: 'Alliance',
      note: 'ordinary club admin direct update should be denied',
    },
  });

  expect(response.ok()).toBe(false);
  expect([401, 403]).toContain(response.status());
}

async function expectRelationRequestNotification(
  request: APIRequestContext,
  targetClubId: string,
  relation: Exclude<ClubRelationKind, 'Neutral'>,
  note: string,
) {
  await expect
    .poll(
      async () => {
        const notifications = await postApi<
          Array<{
            notificationType: string;
            body: string;
            objects: Record<string, string>;
          }>
        >(request, 'listnotificationsapi', {
          operatorId: superAdminPlayerId,
          query: { limit: 100, offset: 0 },
        });

        return notifications.some(
          (notification) =>
            notification.notificationType === 'ClubRelationChangeRequested' &&
            notification.objects.sourceClubId === clubId &&
            notification.objects.targetClubId === targetClubId &&
            notification.objects.relation === relation &&
            notification.body.includes(note),
        );
      },
      {
        message: '普通俱乐部管理员提交关系调整申请后，超管应收到系统消息',
        timeout: 15_000,
      },
    )
    .toBe(true);
}

async function expectClubRelation(
  request: APIRequestContext,
  targetClubId: string,
  relation: Exclude<ClubRelationKind, 'Neutral'> | null,
) {
  await expect
    .poll(
      async () => {
        const detail = await postApi<PublicClubDetailView>(
          request,
          'getpublicclubapi',
          { clubId },
        );

        return (
          detail.relations.find((item) => item.targetClubId === targetClubId)
            ?.relation ?? null
        );
      },
      {
        message: '俱乐部关系应按浏览器操作写入后端',
        timeout: 15_000,
      },
    )
    .toBe(relation);
}

async function expectNoCriticalText(page: Page) {
  await expect(page.getByText('页面刚才崩了一下')).toHaveCount(0);
  await expect(page.getByText('路由加载失败')).toHaveCount(0);
  await expect(page.getByText('Unexpected Application Error')).toHaveCount(0);
  await expect(page.getByText('Failed to fetch dynamically imported module')).toHaveCount(0);

  const bodyText = await page.locator('body').innerText();
  expect(bodyText).not.toMatch(/\bRequest failed\b/);
  expect(bodyText).not.toMatch(/\bDismiss\b/);
  expect(bodyText).not.toMatch(/\bRefresh\b/);
  expect(bodyText).not.toMatch(/\bLine up submitted\b/i);
  expect(bodyText).not.toMatch(/\bPlayer dashboard updated\b/);
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

async function expectNoOverlap(first: Locator, second: Locator) {
  const [firstBox, secondBox] = await Promise.all([
    first.boundingBox(),
    second.boundingBox(),
  ]);

  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();

  if (!firstBox || !secondBox) {
    return;
  }

  const horizontalOverlap =
    firstBox.x < secondBox.x + secondBox.width &&
    firstBox.x + firstBox.width > secondBox.x;
  const verticalOverlap =
    firstBox.y < secondBox.y + secondBox.height &&
    firstBox.y + firstBox.height > secondBox.y;

  expect(horizontalOverlap && verticalOverlap).toBe(false);
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
