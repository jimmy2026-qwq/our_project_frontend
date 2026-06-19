import type { MahjongTableView, SeatWind } from '@/objects';

import { seatOrder } from './matchBoardSeats';

export function getSeatRotation(
  mahjongTable: MahjongTableView,
  operatorId: string,
): Record<SeatWind, SeatWind> {
  const viewerSeat =
    (mahjongTable.seats ?? []).find((seat) => seat.playerId === operatorId)
      ?.seat ?? 'East';

  return createSeatRotation(viewerSeat);
}

function createSeatRotation(viewerSeat: SeatWind): Record<SeatWind, SeatWind> {
  const viewerIndex = seatOrder.indexOf(viewerSeat);

  return seatOrder.reduce(
    (rotation, actualSeat, actualIndex) => ({
      ...rotation,
      [actualSeat]:
        seatOrder[(actualIndex - viewerIndex + seatOrder.length) % seatOrder.length],
    }),
    {} as Record<SeatWind, SeatWind>,
  );
}
