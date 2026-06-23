import { SeatWind } from '@/objects/tournament';

export const meldPositionClasses: Record<SeatWind, string> = {
  [SeatWind.East]:
    'left-[calc(50%+192px)] top-[calc(50%+198px)] -translate-x-1/2',
  [SeatWind.South]:
    'right-[260px] top-[calc(50%-292px)] -translate-y-1/2 rotate-90',
  [SeatWind.West]:
    'left-[calc(50%+186px)] top-[calc(50%-262px)] -translate-x-1/2 rotate-180',
  [SeatWind.North]:
    'left-[calc(50%-452px)] top-[calc(50%+120px)] -translate-y-1/2 -rotate-90',
};
