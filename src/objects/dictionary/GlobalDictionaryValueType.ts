export const GlobalDictionaryValueTypes = {
  Integer: 'Integer',
  Decimal: 'Decimal',
  Weight: 'Weight',
  RatioVector: 'RatioVector',
  StageRuleTemplate: 'StageRuleTemplate',
  Metadata: 'Metadata',
} as const;

export type GlobalDictionaryValueType =
  (typeof GlobalDictionaryValueTypes)[keyof typeof GlobalDictionaryValueTypes];
