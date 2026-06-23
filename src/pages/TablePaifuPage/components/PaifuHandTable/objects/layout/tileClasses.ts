import { SeatWind } from '@/objects/tournament';

export const tileSizeClasses: Record<SeatWind, string> = {
  [SeatWind.East]: 'w-[clamp(34px,5.1vw,58px)]',
  [SeatWind.South]: 'w-[clamp(24px,3.2vw,40px)]',
  [SeatWind.West]: 'w-[clamp(26px,3.4vw,42px)]',
  [SeatWind.North]: 'w-[clamp(24px,3.2vw,40px)]',
};

export const tileFaceClasses: Record<SeatWind, string> = {
  [SeatWind.East]: '',
  [SeatWind.South]: 'rotate-180',
  [SeatWind.West]: '',
  [SeatWind.North]: 'rotate-180',
};
