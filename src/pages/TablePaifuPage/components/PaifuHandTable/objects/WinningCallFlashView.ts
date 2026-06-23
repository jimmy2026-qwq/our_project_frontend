import type { SeatWind } from '@/objects/tournament';

export type WinningCallFlashView = {
  animationMs: number;
  key: number | string;
  label: string;
  seat: SeatWind;
  variant?: 'riichi' | 'win';
};
