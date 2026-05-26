export const TournamentFormats = {
  Swiss: 'Swiss',
  Knockout: 'Knockout',
  RoundRobin: 'RoundRobin',
  Finals: 'Finals',
  Custom: 'Custom',
} as const;

export type TournamentFormat = (typeof TournamentFormats)[keyof typeof TournamentFormats];
