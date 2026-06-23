import { getPaifuTileCode, PaifuTileSuit, type NumberedPaifuTileSuit, type PaifuTileInput } from '@/objects';

const tileImageBasePath = '/mahjong-soul/tiles/individual';
export const maxTileImageRetryCount = 1;
const allTileCodes = [
  ...createTileCodes(PaifuTileSuit.Manzu),
  ...createTileCodes(PaifuTileSuit.Pinzu),
  ...createTileCodes(PaifuTileSuit.Souzu),
  ...Array.from(
    { length: 7 },
    (_, index) => `${index + 1}${PaifuTileSuit.Honor}`,
  ),
];
let preloadPromise: Promise<void> | null = null;

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

export function getTileImageSrc(tile: PaifuTileInput, retryNonce = 0) {
  const tileCode = getPaifuTileCode(tile);
  const retrySuffix = retryNonce > 0 ? `?retry=${retryNonce}` : '';
  return `${tileImageBasePath}/${encodeURIComponent(tileCode)}.png${retrySuffix}`;
}

function createTileCodes(suit: NumberedPaifuTileSuit) {
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
