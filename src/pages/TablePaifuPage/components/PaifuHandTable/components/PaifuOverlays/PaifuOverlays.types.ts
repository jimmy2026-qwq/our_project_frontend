import type { SeatWind } from '@/objects/tournament';

export type ActiveOperation = {
  key: number | string;
  label: string;
  seat: SeatWind;
};

export type WinningCallFlashView = {
  animationMs: number;
  key: number | string;
  label: string;
  seat: SeatWind;
};
