import { SeatWind } from '@/objects/tournament';

export const operationPositionClasses: Record<SeatWind, string> = {
  [SeatWind.East]: 'left-1/2 top-[calc(50%+116px)] -translate-x-1/2',
  [SeatWind.South]: 'left-[calc(50%+200px)] top-1/2 -translate-y-1/2',
  [SeatWind.West]: 'left-1/2 top-[calc(50%-174px)] -translate-x-1/2',
  [SeatWind.North]: 'left-[calc(50%-272px)] top-1/2 -translate-y-1/2',
};
