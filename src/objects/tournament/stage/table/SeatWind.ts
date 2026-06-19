export const SeatWinds = {
  East: 'East',
  South: 'South',
  West: 'West',
  North: 'North',
} as const;

export type SeatWind = (typeof SeatWinds)[keyof typeof SeatWinds];
