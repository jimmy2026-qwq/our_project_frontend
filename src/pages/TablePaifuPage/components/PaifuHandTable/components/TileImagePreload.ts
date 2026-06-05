import { useEffect } from 'react';

const tileImageBasePath = '/mahjong-soul/tiles/individual';
export const maxTileImageRetryCount = 1;
const allTileCodes = [
  ...createTileCodes('m'),
  ...createTileCodes('p'),
  ...createTileCodes('s'),
  ...Array.from({ length: 7 }, (_, index) => `${index + 1}z`),
];
let preloadPromise: Promise<void> | null = null;

export function useMahjongTileImagePreload() {
  useEffect(() => {
    void preloadMahjongTileImages();
  }, []);
}

export function preloadMahjongTileImages() {
  if (preloadPromise) {
    return preloadPromise;
  }

  if (typeof Image === 'undefined') {
    preloadPromise = Promise.resolve();
    return preloadPromise;
  }

  preloadPromise = Promise.all(allTileCodes.map(loadTileImage)).then(
    () => undefined,
  );

  return preloadPromise;
}

export function getTileImageSrc(tile: string, retryNonce = 0) {
  const retrySuffix = retryNonce > 0 ? `?retry=${retryNonce}` : '';
  return `${tileImageBasePath}/${encodeURIComponent(tile)}.png${retrySuffix}`;
}

function createTileCodes(suit: 'm' | 'p' | 's') {
  return [
    ...Array.from({ length: 9 }, (_, index) => `${index + 1}${suit}`),
    `0${suit}`,
  ];
}

function loadTileImage(tile: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = getTileImageSrc(tile);
  });
}
