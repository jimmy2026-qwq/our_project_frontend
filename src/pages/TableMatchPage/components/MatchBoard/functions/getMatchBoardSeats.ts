import {
  getPaifuTileCode,
  MahjongMeldTypes,
  type MahjongSeatView,
  type MahjongTableView,
  type PaifuTile,
  type SeatWind,
} from '@/objects';
import type {
  MeldGroup,
  RiverDiscard,
} from '@/pages/TablePaifuPage/objects/ReplaySnapshot.types';

import { matchBoardSeatOrder } from '../objects/matchBoardSeatOrder';
import {
  removeFirstMatchingTile,
  removeFirstMatchingTileBy,
} from './removeFirstMatchingTile';

type ClaimRelation = 'upper' | 'opposite' | 'lower' | 'self';

export function getMahjongSeatMap(
  mahjongTable: MahjongTableView,
  seatRotation: Record<SeatWind, SeatWind>,
) {
  return matchBoardSeatOrder.reduce(
    (seatMap, seat) => ({
      ...seatMap,
      [seat]:
        (mahjongTable.seats ?? []).find(
          (seatView) => seatRotation[seatView.seat] === seat,
        ) ?? null,
    }),
    {} as Record<SeatWind, MahjongSeatView | null>,
  );
}

export function getRivers(
  mahjongTable: MahjongTableView,
  seatRotation: Record<SeatWind, SeatWind>,
) {
  return createSeatRecord((displaySeat) => {
    const seatView = (mahjongTable.seats ?? []).find(
      (item) => seatRotation[item.seat] === displaySeat,
    );

    return (
      (seatView?.river ?? []).filter((discard) => !discard.calledBy).map(
        (discard): RiverDiscard => ({
          playerId: discard.playerId,
          sequenceNo: discard.sequenceNo,
          sideways: discard.riichiDeclared,
          tile: discard.tile,
        }),
      ) ?? []
    );
  });
}

export function getMelds(
  mahjongTable: MahjongTableView,
  seatRotation: Record<SeatWind, SeatWind>,
) {
  return createSeatRecord((displaySeat) => {
    const seatView = (mahjongTable.seats ?? []).find(
      (item) => seatRotation[item.seat] === displaySeat,
    );

    if (!seatView) {
      return [];
    }

    return (
      (seatView.melds ?? []).map((meld): MeldGroup => {
        const sourceTiles = meld.tiles ?? [];
        const claimedActualSeat = (mahjongTable.seats ?? []).find(
          (seat) => seat.playerId === meld.fromPlayer,
        )?.seat;
        const claimedDisplaySeat = claimedActualSeat
          ? seatRotation[claimedActualSeat]
          : undefined;
        const sidewaysIndex = getMeldSidewaysIndex({
          claimedSeat: claimedDisplaySeat,
          meldType: meld.meldType,
          seat: displaySeat,
          tileCount: sourceTiles.length,
        });
        const tiles = getMeldDisplaySourceTiles(meld, sidewaysIndex);

        return {
          actionType: meld.meldType,
          tiles: tiles.map((tile, index) => ({
            concealed:
              meld.closed && (index === 0 || index === tiles.length - 1),
            sideways: !meld.closed && index === sidewaysIndex,
            tile,
          })),
        };
      }) ?? []
    );
  });
}

function getMeldDisplaySourceTiles(
  meld: MahjongSeatView['melds'][number],
  sidewaysIndex?: number,
) {
  const tiles = meld.tiles ?? [];

  if (!meld.calledTile || sidewaysIndex === undefined) {
    return tiles;
  }

  const handTiles = removeFirstMatchingMeldTile(tiles, meld.calledTile);

  return [
    ...handTiles.slice(0, sidewaysIndex),
    meld.calledTile,
    ...handTiles.slice(sidewaysIndex),
  ];
}

function removeFirstMatchingMeldTile(tiles: PaifuTile[], tile: PaifuTile) {
  const exactMatch = removeFirstMatchingTile(tiles, tile);

  if (exactMatch.length !== tiles.length) {
    return exactMatch;
  }

  return removeFirstMatchingTileBy(
    tiles,
    (item) =>
      normalizeRedFiveForMeldMatch(item) === normalizeRedFiveForMeldMatch(tile),
  );
}

function normalizeRedFiveForMeldMatch(tile: PaifuTile) {
  return tile.rank === 0 ? `5${tile.suit}` : getPaifuTileCode(tile);
}

function getMeldSidewaysIndex({
  claimedSeat,
  meldType,
  seat,
  tileCount,
}: {
  claimedSeat?: SeatWind;
  meldType: string;
  seat: SeatWind;
  tileCount: number;
}) {
  if (meldType === MahjongMeldTypes.Chi) {
    return 0;
  }

  if (!claimedSeat) {
    return undefined;
  }

  return getSidewaysIndexByRelation(
    getClaimRelation(seat, claimedSeat),
    tileCount,
  );
}

function getSidewaysIndexByRelation(
  relation: ClaimRelation,
  tileCount: number,
) {
  if (tileCount >= 4) {
    return { upper: 0, opposite: 1, lower: 3, self: undefined }[relation];
  }

  return { upper: 0, opposite: 1, lower: 2, self: undefined }[relation];
}

function getClaimRelation(
  callerSeat: SeatWind,
  claimedSeat: SeatWind,
): ClaimRelation {
  const callerIndex = matchBoardSeatOrder.indexOf(callerSeat);
  const claimedIndex = matchBoardSeatOrder.indexOf(claimedSeat);
  const relation =
    (claimedIndex - callerIndex + matchBoardSeatOrder.length) %
    matchBoardSeatOrder.length;

  if (relation === 3) {
    return 'upper';
  }

  if (relation === 2) {
    return 'opposite';
  }

  return relation === 1 ? 'lower' : 'self';
}

function createSeatRecord<T>(factory: (seat: SeatWind) => T) {
  return matchBoardSeatOrder.reduce(
    (record, seat) => ({
      ...record,
      [seat]: factory(seat),
    }),
    {} as Record<SeatWind, T>,
  );
}
