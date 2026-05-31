import type { AdvancementRuleType } from './AdvancementRuleType';

export interface AdvancementRule {
  ruleType: AdvancementRuleType;
  cutSize: number | null;
  thresholdScore: number | null;
  targetTableCount: number | null;
  templateKey: string | null;
  note: string | null;
}
