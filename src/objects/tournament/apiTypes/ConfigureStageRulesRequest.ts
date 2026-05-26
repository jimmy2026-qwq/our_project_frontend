import type { AdvancementRuleType } from '../AdvancementRuleType';
import type { KnockoutSeedingPolicy } from '../KnockoutSeedingPolicy';
import type { SwissPairingMethod } from '../SwissPairingMethod';
import type { TournamentFormat } from '../TournamentFormat';

export interface ConfigureStageRulesRequest {
  operatorId: string;
  format?: TournamentFormat;
  roundCount?: number;
  advancementRuleType?: AdvancementRuleType;
  cutSize?: number;
  thresholdScore?: number;
  targetTableCount?: number;
  schedulingPoolSize?: number;
  ruleTemplateKey?: string;
  pairingMethod?: SwissPairingMethod;
  carryOverPoints?: boolean;
  maxRounds?: number;
  bracketSize?: number;
  thirdPlaceMatch?: boolean;
  repechageEnabled?: boolean;
  seedingPolicy?: KnockoutSeedingPolicy;
  note?: string;
}

