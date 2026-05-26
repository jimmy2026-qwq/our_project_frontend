import type { KnockoutSeedingPolicy } from './KnockoutSeedingPolicy';

export interface KnockoutRuleConfigView {
  bracketSize: number | null;
  thirdPlaceMatch: boolean;
  seedingPolicy: KnockoutSeedingPolicy;
  repechageEnabled: boolean;
}
