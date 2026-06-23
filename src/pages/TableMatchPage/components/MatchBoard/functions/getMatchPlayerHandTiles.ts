import { SeatWind, isSamePaifuTile, type PaifuTile } from '@/objects';
import { getDisplayTiles } from '@/pages/TablePaifuPage/components/PaifuHandTable/functions/getPaifuTableLayout';

export function getMatchDisplayHandTiles({
  drawTile,
  seat,
  tiles,
}: {
  drawTile?: PaifuTile | null;
  seat: SeatWind;
  tiles: PaifuTile[];
}) {
  if (!drawTile) {
    return getDisplayTiles(seat, tiles).map((tile) => ({
      isDrawnTile: false,
      tile,
    }));
  }

  const baseTiles = removeFirstMatchingTile(tiles, drawTile);
  const drawnDisplayTile = {
    isDrawnTile: true,
    tile: drawTile,
  };
  const baseDisplayTiles = getDisplayTiles(seat, baseTiles).map((tile) => ({
    isDrawnTile: false,
    tile,
  }));

  if (seat === SeatWind.South || seat === SeatWind.North) {
    return [drawnDisplayTile, ...baseDisplayTiles];
  }

  return [...baseDisplayTiles, drawnDisplayTile];
}

function removeFirstMatchingTile(tiles: PaifuTile[], tile: PaifuTile) {
  let removed = false;

  return tiles.filter((item) => {
    if (!removed && isSamePaifuTile(item, tile)) {
      removed = true;
      return false;
    }

    return true;
  });
}
