import type {
  KnockoutRuleConfig,
  SwissRuleConfig,
} from '@/objects/tournament';
import { KnockoutSeedingPolicies, SwissPairingMethod } from '@/objects/tournament';

export function describeSwissPairing(rule?: SwissRuleConfig | null) {
  return rule?.pairingMethod === SwissPairingMethod.Snake
    ? '蛇形分组'
    : '均衡 ELO';
}

export function describeKnockoutSeeding(rule?: KnockoutRuleConfig | null) {
  switch (rule?.seedingPolicy) {
    case KnockoutSeedingPolicies.Standings:
      return '按当前排名';
    case KnockoutSeedingPolicies.Ranking:
      return '按段位';
    case KnockoutSeedingPolicies.Elo:
    case KnockoutSeedingPolicies.Rating:
    default:
      return '按 ELO';
  }
}
