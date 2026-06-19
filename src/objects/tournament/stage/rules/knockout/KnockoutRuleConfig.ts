import type { KnockoutSeedingPolicy } from './KnockoutSeedingPolicy';

export interface KnockoutRuleConfig {
  bracketSize: number | null;
  thirdPlaceMatch: boolean;
  seedingPolicy: KnockoutSeedingPolicy;
  repechageEnabled: boolean;
}
