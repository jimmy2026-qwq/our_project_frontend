import { SeatWind } from '@/objects/tournament';

export const replaySeatOrder: SeatWind[] = [
  SeatWind.East,
  SeatWind.South,
  SeatWind.West,
  SeatWind.North,
];

export const replaySeatLabels: Record<SeatWind, string> = {
  [SeatWind.East]: '\u4e1c',
  [SeatWind.South]: '\u5357',
  [SeatWind.West]: '\u897f',
  [SeatWind.North]: '\u5317',
};
