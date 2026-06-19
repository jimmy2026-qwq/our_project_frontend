export const AdvancementRuleTypes = {
  SwissCut: 'SwissCut',
  KnockoutElimination: 'KnockoutElimination',
  ScoreThreshold: 'ScoreThreshold',
  Custom: 'Custom',
} as const;

export type AdvancementRuleType =
  (typeof AdvancementRuleTypes)[keyof typeof AdvancementRuleTypes];
