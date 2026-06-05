import { describe, expect, it } from 'vitest';

import {
  getTileImageSrc,
  maxTileImageRetryCount,
  preloadMahjongTileImages,
} from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileImagePreload';

describe('tile image preload helpers', () => {
  it('builds stable image URLs with encoded tile ids and retry suffixes', () => {
    expect(getTileImageSrc('1m')).toBe('/mahjong-soul/tiles/individual/1m.png');
    expect(getTileImageSrc('red five', 1)).toBe(
      '/mahjong-soul/tiles/individual/red%20five.png?retry=1',
    );
    expect(maxTileImageRetryCount).toBe(1);
  });

  it('resolves immediately in non-browser test environments', async () => {
    await expect(preloadMahjongTileImages()).resolves.toBeUndefined();
  });
});
