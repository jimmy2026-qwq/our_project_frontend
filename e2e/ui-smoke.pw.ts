import {
  expect,
  test as base,
  type Locator,
  type Page,
  type TestInfo,
} from '@playwright/test';
import { PNG } from 'pngjs';

const clubId = process.env.E2E_CLUB_ID ?? 'club-6f2ba885';
const tournamentId =
  process.env.E2E_TOURNAMENT_ID ?? 'tournament-3c30af19';
const tableId = process.env.E2E_TABLE_ID ?? 'table-be548ec5';

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
});

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
