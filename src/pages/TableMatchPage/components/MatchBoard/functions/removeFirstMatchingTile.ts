import { isSamePaifuTile, type PaifuTile } from '@/objects';

export function removeFirstMatchingTile(tiles: PaifuTile[], tile: PaifuTile) {
  let removed = false;

  return tiles.filter((item) => {
    if (!removed && isSamePaifuTile(item, tile)) {
      removed = true;
      return false;
    }

    return true;
  });
}

export function removeFirstMatchingTileBy(
  tiles: PaifuTile[],
  matches: (tile: PaifuTile) => boolean,
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
