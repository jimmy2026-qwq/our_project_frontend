import { getPaifuTileCode, MahjongMeldTypes, type SeatWind, type MahjongSeatView, type MahjongTableView, type PaifuTile } from '@/objects';
import type { MeldGroup } from '@/pages/TablePaifuPage/objects/MeldGroup';
import type { RiverDiscard } from '@/pages/TablePaifuPage/objects/RiverDiscard';

import { matchBoardSeatOrder } from '../objects/matchBoardSeatOrder';
import { removeFirstMatchingTile, removeFirstMatchingTileBy } from './removeFirstMatchingTile';

const ClaimRelations = {
  Upper: 'upper',
  Opposite: 'opposite',
  Lower: 'lower',
  Self: 'self',
} as const;

type ClaimRelation = (typeof ClaimRelations)[keyof typeof ClaimRelations];

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
    return {
      [ClaimRelations.Upper]: 0,
      [ClaimRelations.Opposite]: 1,
      [ClaimRelations.Lower]: 3,
      [ClaimRelations.Self]: undefined,
    }[relation];
  }

  return {
    [ClaimRelations.Upper]: 0,
    [ClaimRelations.Opposite]: 1,
    [ClaimRelations.Lower]: 2,
    [ClaimRelations.Self]: undefined,
  }[relation];
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
    return ClaimRelations.Upper;
  }

  if (relation === 2) {
    return ClaimRelations.Opposite;
  }

  return relation === 1 ? ClaimRelations.Lower : ClaimRelations.Self;
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
