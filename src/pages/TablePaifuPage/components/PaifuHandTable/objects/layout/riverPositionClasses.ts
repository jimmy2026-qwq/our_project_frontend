import { SeatWind } from '@/objects/tournament';

export const riverTileFaceClasses: Record<SeatWind, string> = {
  [SeatWind.East]: '',
  [SeatWind.South]: 'rotate-180',
  [SeatWind.West]: 'rotate-180',
  [SeatWind.North]: 'rotate-180',
};

export const riverPositionClasses: Record<SeatWind, string> = {
  [SeatWind.East]: 'left-1/2 top-[calc(50%+142px)] -translate-x-1/2',
  [SeatWind.South]:
    'left-[calc(50%+170px)] top-1/2 -translate-y-1/2 rotate-90',
  [SeatWind.West]: 'left-1/2 top-[calc(50%-218px)] -translate-x-1/2',
  [SeatWind.North]:
    'left-[calc(50%-350px)] top-1/2 -translate-y-1/2 -rotate-90',
};
