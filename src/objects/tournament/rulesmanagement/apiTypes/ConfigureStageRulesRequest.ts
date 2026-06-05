import type { AdvancementRuleType } from '../stageprogression/AdvancementRuleType';
import type { KnockoutSeedingPolicy } from '../knockout/KnockoutSeedingPolicy';
import type { SwissPairingMethod } from '../swiss/SwissPairingMethod';
import type { TournamentFormat } from '../../tournamentmanagement/TournamentFormat';
import type { MahjongRuleset } from '../../mahjongcore/gamestate/MahjongRuleset';

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
  mahjongRuleset?: MahjongRuleset;
  note?: string;
}
