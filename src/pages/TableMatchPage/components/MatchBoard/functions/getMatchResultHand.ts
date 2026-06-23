import { HandOutcome, isSamePaifuTile, type AgariResult, type MahjongSeatView, type PaifuTile } from '@/objects';

export function getResultDisplayHand({
  result,
  tile,
  winnerHand,
}: {
  result: AgariResult;
  tile?: PaifuTile;
  winnerHand: PaifuTile[];
}) {
  if (result.outcome === HandOutcome.Tsumo && tile) {
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

function removeFirstTile(tiles: PaifuTile[], tile: PaifuTile) {
  let removed = false;

  return tiles.filter((item) => {
    if (!removed && isSamePaifuTile(item, tile)) {
      removed = true;
      return false;
    }

    return true;
  });
}
