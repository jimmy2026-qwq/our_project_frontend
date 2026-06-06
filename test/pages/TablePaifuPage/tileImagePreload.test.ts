import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getTileImageSrc,
  maxTileImageRetryCount,
  preloadMahjongTileImages,
} from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileImagePreload';

describe('tile image preload helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

  it('preloads every tile image in browser-like environments and reuses the promise', async () => {
    const requestedSources: string[] = [];

    vi.resetModules();
    vi.stubGlobal(
      'Image',
      class FakeImage {
        decoding = '';
        onerror: (() => void) | null = null;
        onload: (() => void) | null = null;

        set src(value: string) {
          requestedSources.push(value);
          queueMicrotask(() => {
            this.onload?.();
          });
        }
      },
    );

    const { preloadMahjongTileImages: preload } = await import(
      '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileImagePreload'
    );
    const firstPreload = preload();
    const secondPreload = preload();

    expect(firstPreload).toBe(secondPreload);
    await expect(firstPreload).resolves.toBeUndefined();
    expect(requestedSources).toHaveLength(37);
    expect(requestedSources).toContain('/mahjong-soul/tiles/individual/1m.png');
    expect(requestedSources).toContain('/mahjong-soul/tiles/individual/0p.png');
    expect(requestedSources).toContain('/mahjong-soul/tiles/individual/7z.png');
  });
});
