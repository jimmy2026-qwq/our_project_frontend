import { SeatWind } from '@/objects/tournament';

export const labelPositionClasses: Record<SeatWind, string> = {
  [SeatWind.East]: 'bottom-[132px] left-1/2 -translate-x-1/2 text-center',
  [SeatWind.South]:
    'right-[112px] top-1/2 -translate-y-[calc(50%+142px)] text-right',
  [SeatWind.West]: 'left-1/2 top-[130px] -translate-x-1/2 text-center',
  [SeatWind.North]:
    'left-[112px] top-1/2 -translate-y-[calc(50%+142px)] text-left',
};
