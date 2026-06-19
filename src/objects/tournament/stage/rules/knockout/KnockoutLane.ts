export const KnockoutLanes = {
  Championship: 'Championship',
  Bronze: 'Bronze',
  Repechage: 'Repechage',
} as const;

export type KnockoutLane = (typeof KnockoutLanes)[keyof typeof KnockoutLanes];
