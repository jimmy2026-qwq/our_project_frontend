import type { AdvancementRuleType } from '../AdvancementRuleType';
import type { KnockoutSeedingPolicy } from '../KnockoutSeedingPolicy';
import type { SwissPairingMethod } from '../SwissPairingMethod';
import type { TournamentFormat } from '../TournamentFormat';

export interface CreateTournamentStageRequest {
  id?: string;
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
  schedulingPoolSize?: number;
}

