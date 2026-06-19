export const KnockoutSeedingPolicies = {
  Rating: 'rating',
  Elo: 'elo',
  Ranking: 'ranking',
  Standings: 'standings',
} as const;

export type KnockoutSeedingPolicy =
  (typeof KnockoutSeedingPolicies)[keyof typeof KnockoutSeedingPolicies];
