import {
  getPaifuTileCode,
  isSamePaifuTile,
  type PaifuTile,
} from '@/objects';

export function getAddedTileIndex({
  afterTiles,
  beforeTiles,
  preferredTile,
}: {
  afterTiles: PaifuTile[];
  beforeTiles: PaifuTile[];
  preferredTile?: PaifuTile;
}) {
  const remainingBeforeCounts = beforeTiles.reduce<Record<string, number>>(
    (counts, tile) => ({
      ...counts,
      [getPaifuTileCode(tile)]: (counts[getPaifuTileCode(tile)] ?? 0) + 1,
    }),
    {},
  );

  const addedIndex = afterTiles.findIndex((tile) => {
    const tileCode = getPaifuTileCode(tile);
    const remainingCount = remainingBeforeCounts[tileCode] ?? 0;

    if (remainingCount > 0) {
      remainingBeforeCounts[tileCode] = remainingCount - 1;
      return false;
    }

    return !preferredTile || isSamePaifuTile(tile, preferredTile);
  });

  if (addedIndex >= 0) {
    return addedIndex;
  }

  const preferredIndex = preferredTile
    ? afterTiles.findIndex((tile) => isSamePaifuTile(tile, preferredTile))
    : -1;

  return preferredIndex >= 0 ? preferredIndex : afterTiles.length - 1;
}

export function removeFirstMatchingTile(tiles: PaifuTile[], tile?: PaifuTile) {
  if (!tile) {
    return [...tiles];
  }

  const index = tiles.findIndex((item) => isSamePaifuTile(item, tile));

  if (index < 0) {
    return [...tiles];
  }

  return tiles.filter((_, tileIndex) => tileIndex !== index);
}
