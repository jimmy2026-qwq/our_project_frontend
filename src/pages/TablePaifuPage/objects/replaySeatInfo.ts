import { SeatWinds, type SeatWind } from '@/objects/tournament';

export const replaySeatOrder: SeatWind[] = [
  SeatWinds.East,
  SeatWinds.South,
  SeatWinds.West,
  SeatWinds.North,
];

export const replaySeatLabels: Record<SeatWind, string> = {
  [SeatWinds.East]: '\u4e1c',
  [SeatWinds.South]: '\u5357',
  [SeatWinds.West]: '\u897f',
  [SeatWinds.North]: '\u5317',
};
