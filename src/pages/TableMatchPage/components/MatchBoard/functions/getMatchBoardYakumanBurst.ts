import { HandOutcome, type AgariResult, type MahjongSeatView, type PaifuTile } from '@/objects';
import { getWinYaku, getResultWins, isWinOutcome } from '@/components/mahjong-result/functions/getMahjongResultSequence';
import { getFirstYakumanYaku } from '@/components/mahjong-result/functions/getFirstYakumanYaku';
import type { YakumanTileBurstView } from '@/pages/TablePaifuPage/components/PaifuHandTable/objects/YakumanTileBurstView';

import { removeFirstMatchingTile } from './removeFirstMatchingTile';

export function createMatchYakumanTileBurst({
  result,
  resultKey,
  resultYakumanBurstActiveKey,
  seats,
}: {
  result: AgariResult | null;
  resultKey: string | null;
  resultYakumanBurstActiveKey: string | null;
  seats: MahjongSeatView[];
}): YakumanTileBurstView | undefined {
  if (!resultKey || resultYakumanBurstActiveKey !== resultKey) {
    return undefined;
  }

  const burst = createMatchYakumanTileBurstData({ result, seats });

  if (!burst) {
    return undefined;
  }

  return {
    key: resultKey,
    ...burst,
  };
}

export function createMatchYakumanTileBurstData({
  result,
  seats,
}: {
  result: AgariResult | null;
  seats: MahjongSeatView[];
}): Omit<YakumanTileBurstView, 'key'> | undefined {
  if (!result || !isWinOutcome(result.outcome)) {
    return undefined;
  }

  for (const win of getResultWins(result)) {
    const yakumanYaku = getFirstYakumanYaku(getWinYaku(result, win));

    if (!yakumanYaku) {
      continue;
    }

    const winnerSeat = seats.find(
      (seatView) => seatView.playerId === win.winner,
    );
    const targetSeat = win.target
      ? seats.find((seatView) => seatView.playerId === win.target)
      : result.target
        ? seats.find((seatView) => seatView.playerId === result.target)
        : undefined;
    const featuredTile = getYakumanFeaturedTile({
      result,
      targetSeat,
      winnerSeat,
    });
    const tiles = getYakumanBurstTiles({
      featuredTile,
      winnerSeat,
    });

    if (tiles.length === 0) {
      return undefined;
    }

    return {
      featuredTile,
      tiles,
      yakuKind: yakumanYaku.kind,
    };
  }

  return undefined;
}

function getYakumanBurstTiles({
  featuredTile,
  winnerSeat,
}: {
  featuredTile?: PaifuTile;
  winnerSeat?: MahjongSeatView;
}) {
  const handTiles = winnerSeat?.handTiles ?? [];

  return featuredTile
    ? [featuredTile, ...removeFirstMatchingTile(handTiles, featuredTile)].slice(
        0,
        14,
      )
    : handTiles.slice(0, 14);
}

function getYakumanFeaturedTile({
  result,
  targetSeat,
  winnerSeat,
}: {
  result: AgariResult;
  targetSeat?: MahjongSeatView;
  winnerSeat?: MahjongSeatView;
}) {
  if (result.outcome === HandOutcome.Tsumo) {
    return winnerSeat?.drawTile ?? undefined;
  }

  if (result.outcome === HandOutcome.Ron) {
    return targetSeat?.river?.[targetSeat.river.length - 1]?.tile;
  }

  return undefined;
}
