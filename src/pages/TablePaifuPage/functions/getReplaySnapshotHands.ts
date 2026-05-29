export function getAddedTileIndex({
  afterTiles,
  beforeTiles,
  preferredTile,
}: {
  afterTiles: string[];
  beforeTiles: string[];
  preferredTile?: string;
}) {
  const remainingBeforeCounts = beforeTiles.reduce<Record<string, number>>(
    (counts, tile) => ({
      ...counts,
      [tile]: (counts[tile] ?? 0) + 1,
    }),
    {},
  );

  const addedIndex = afterTiles.findIndex((tile) => {
    const remainingCount = remainingBeforeCounts[tile] ?? 0;

    if (remainingCount > 0) {
      remainingBeforeCounts[tile] = remainingCount - 1;
      return false;
    }

    return !preferredTile || tile === preferredTile;
  });

  if (addedIndex >= 0) {
    return addedIndex;
  }

  const preferredIndex = preferredTile
    ? afterTiles.findIndex((tile) => tile === preferredTile)
    : -1;

  return preferredIndex >= 0 ? preferredIndex : afterTiles.length - 1;
}

export function removeFirstMatchingTile(tiles: string[], tile?: string) {
  if (!tile) {
    return [...tiles];
  }

  const index = tiles.findIndex((item) => item === tile);

  if (index < 0) {
    return [...tiles];
  }

  return tiles.filter((_, tileIndex) => tileIndex !== index);
}
