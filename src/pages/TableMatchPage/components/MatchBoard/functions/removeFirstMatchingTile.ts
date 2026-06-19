export function removeFirstMatchingTile(tiles: string[], tile: string) {
  let removed = false;

  return tiles.filter((item) => {
    if (!removed && item === tile) {
      removed = true;
      return false;
    }

    return true;
  });
}

export function removeFirstMatchingTileBy(
  tiles: string[],
  matches: (tile: string) => boolean,
) {
  let removed = false;

  return tiles.filter((item) => {
    if (!removed && matches(item)) {
      removed = true;
      return false;
    }

    return true;
  });
}
