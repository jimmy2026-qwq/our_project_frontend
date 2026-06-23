import { SeatWind } from '@/objects/tournament';

export const handPositionClasses: Record<SeatWind, string> = {
  [SeatWind.East]:
    'bottom-[20px] left-1/2 w-[min(94%,900px)] -translate-x-1/2 justify-center',
  [SeatWind.South]:
    'right-[22px] top-1/2 w-[min(70%,560px)] origin-center -translate-y-1/2 translate-x-[42%] rotate-90 justify-center',
  [SeatWind.West]:
    'left-1/2 top-[24px] w-[min(82%,720px)] -translate-x-1/2 justify-center',
  [SeatWind.North]:
    'left-[22px] top-1/2 w-[min(70%,560px)] origin-center -translate-x-[42%] -translate-y-1/2 -rotate-90 justify-center',
};
