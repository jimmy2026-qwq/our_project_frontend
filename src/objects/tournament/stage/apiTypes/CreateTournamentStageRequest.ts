import type { AdvancementRuleType } from '../rules/progression/AdvancementRuleType';
import type { KnockoutSeedingPolicy } from '../rules/knockout/KnockoutSeedingPolicy';
import type { SwissPairingMethod } from '../rules/swiss/SwissPairingMethod';
import type { TournamentFormat } from '../../competition/TournamentFormat';
import type { MahjongRuleset } from '../../mahjongcore/gamestate/MahjongRuleset';

export interface CreateTournamentStageRequest {
  name: string;
  format: TournamentFormat;
  order: number;
  roundCount: number;
  operatorId?: string;
  ruleTemplateKey?: string;
  advancementRuleType?: AdvancementRuleType;
  cutSize?: number;
  thresholdScore?: number;
  targetTableCount?: number;
  note?: string;
  pairingMethod?: SwissPairingMethod;
  carryOverPoints?: boolean;
  maxRounds?: number;
  bracketSize?: number;
  thirdPlaceMatch?: boolean;
  repechageEnabled?: boolean;
  seedingPolicy?: KnockoutSeedingPolicy;
  mahjongRuleset?: MahjongRuleset;
  schedulingPoolSize?: number;
}
