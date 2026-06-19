import type {
  KnockoutRuleConfig,
  SwissRuleConfig,
} from '@/objects/tournament';

export function describeSwissPairing(rule?: SwissRuleConfig | null) {
  return rule?.pairingMethod === 'snake' ? '蛇形分组' : '均衡 ELO';
}

export function describeKnockoutSeeding(rule?: KnockoutRuleConfig | null) {
  switch (rule?.seedingPolicy) {
    case 'standings':
      return '按当前排名';
    case 'ranking':
      return '按段位';
    case 'elo':
    case 'rating':
    default:
      return '按 ELO';
  }
}
