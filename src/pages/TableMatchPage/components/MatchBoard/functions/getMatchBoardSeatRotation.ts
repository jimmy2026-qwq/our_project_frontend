import { SeatWinds, type MahjongTableView, type SeatWind } from '@/objects';

import { matchBoardSeatOrder } from '../objects/matchBoardSeatOrder';

export function getSeatRotation(
  mahjongTable: MahjongTableView,
  operatorId: string,
): Record<SeatWind, SeatWind> {
  const viewerSeat =
    (mahjongTable.seats ?? []).find((seat) => seat.playerId === operatorId)
      ?.seat ?? SeatWinds.East;

  return createSeatRotation(viewerSeat);
}

function createSeatRotation(viewerSeat: SeatWind): Record<SeatWind, SeatWind> {
  const viewerIndex = matchBoardSeatOrder.indexOf(viewerSeat);

  return matchBoardSeatOrder.reduce(
    (rotation, actualSeat, actualIndex) => ({
      ...rotation,
      [actualSeat]:
        matchBoardSeatOrder[
          (actualIndex - viewerIndex + matchBoardSeatOrder.length) %
            matchBoardSeatOrder.length
        ],
    }),
    {} as Record<SeatWind, SeatWind>,
  );
}
