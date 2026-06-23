import { SeatWind } from '@/objects/tournament';

export const centerPointPositionClasses: Record<SeatWind, string> = {
  [SeatWind.East]: 'bottom-3 left-1/2 -translate-x-1/2',
  [SeatWind.South]: 'right-3 top-1/2 -translate-y-1/2 rotate-90',
  [SeatWind.West]: 'left-1/2 top-3 -translate-x-1/2',
  [SeatWind.North]: 'left-3 top-1/2 -translate-y-1/2 -rotate-90',
};
