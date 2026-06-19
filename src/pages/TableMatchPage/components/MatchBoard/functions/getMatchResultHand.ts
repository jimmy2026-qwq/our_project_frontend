import type { AgariResult, MahjongSeatView } from '@/objects';

export function getResultDisplayHand({
  result,
  tile,
  winnerHand,
}: {
  result: AgariResult;
  tile?: string;
  winnerHand: string[];
}) {
  if (result.outcome === 'Tsumo' && tile) {
    return removeFirstTile(winnerHand, tile);
  }

  return winnerHand;
}

export function findWinningTileFromTarget(
  seats: MahjongSeatView[],
  target: string,
) {
  const targetSeat = seats.find((seat) => seat.playerId === target);

  return targetSeat?.river?.[targetSeat.river.length - 1]?.tile;
}

function removeFirstTile(tiles: string[], tile: string) {
  let removed = false;

  return tiles.filter((item) => {
    if (!removed && item === tile) {
      removed = true;
      return false;
    }

    return true;
  });
}
