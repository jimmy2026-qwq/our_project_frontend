import type { SeatWind } from '@/objects/tournament';

import type { PaifuRoundSummary, TablePaifuDetail } from '../../../types';
import { seatOrder } from '../../../functions/getReplay';

export function getInitialPerspectiveSeat(
  paifu: TablePaifuDetail,
  viewerPlayerId: string,
): SeatWind {
  const viewerSeat = paifu.metadata.seats?.find(
    (seat) => seat.playerId === viewerPlayerId,
  )?.seat;

  return viewerSeat ?? firstOccupiedSeat(paifu) ?? 'East';
}

export function getNextPerspectiveSeat(
  paifu: TablePaifuDetail,
  currentSeat: SeatWind,
): SeatWind {
  const occupiedSeats = seatOrder.filter((seat) =>
    paifu.metadata.seats?.some((item) => item.seat === seat),
  );
  const selectableSeats = occupiedSeats.length > 0 ? occupiedSeats : seatOrder;
  const currentIndex = selectableSeats.indexOf(currentSeat);

  return selectableSeats[
    (Math.max(0, currentIndex) + 1) % selectableSeats.length
  ];
}

export function createPerspectivePaifu(
  paifu: TablePaifuDetail,
  perspectiveSeat: SeatWind,
): TablePaifuDetail {
  const seatRotation = createSeatRotation(perspectiveSeat);

  return {
    ...paifu,
    metadata: {
      ...paifu.metadata,
      seats: paifu.metadata.seats?.map((seat) => ({
        ...seat,
        seat: seatRotation[seat.seat],
      })),
    },
    finalStandings: paifu.finalStandings.map((standing) => ({
      ...standing,
      seat: seatRotation[standing.seat],
    })),
  };
}

export function getPaifuRoundKey(round: PaifuRoundSummary) {
  return [
    round.descriptor.roundWind,
    round.descriptor.handNumber,
    round.descriptor.honba,
  ].join(':');
}

function firstOccupiedSeat(paifu: TablePaifuDetail) {
  return seatOrder.find((seat) =>
    paifu.metadata.seats?.some((item) => item.seat === seat),
  );
}

function createSeatRotation(viewerSeat: SeatWind): Record<SeatWind, SeatWind> {
  const viewerIndex = seatOrder.indexOf(viewerSeat);

  return seatOrder.reduce(
    (rotation, actualSeat, actualIndex) => ({
      ...rotation,
      [actualSeat]:
        seatOrder[
          (actualIndex - viewerIndex + seatOrder.length) % seatOrder.length
        ],
    }),
    {} as Record<SeatWind, SeatWind>,
  );
}
