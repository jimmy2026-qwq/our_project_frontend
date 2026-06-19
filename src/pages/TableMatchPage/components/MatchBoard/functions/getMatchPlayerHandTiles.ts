import type { SeatWind } from '@/objects';
import { getDisplayTiles } from '@/pages/TablePaifuPage/components/PaifuHandTable/functions/getPaifuTableLayout';

export function getMatchDisplayHandTiles({
  drawTile,
  seat,
  tiles,
}: {
  drawTile?: string | null;
  seat: SeatWind;
  tiles: string[];
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

  if (seat === 'South' || seat === 'North') {
    return [drawnDisplayTile, ...baseDisplayTiles];
  }

  return [...baseDisplayTiles, drawnDisplayTile];
}

function removeFirstMatchingTile(tiles: string[], tile: string) {
  let removed = false;

  return tiles.filter((item) => {
    if (!removed && item === tile) {
      removed = true;
      return false;
    }

    return true;
  });
}
