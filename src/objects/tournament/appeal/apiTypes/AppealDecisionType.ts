export const AppealDecisionTypes = {
  Resolve: 'Resolve',
  Reject: 'Reject',
  Escalate: 'Escalate',
} as const;

export type AppealDecisionType = (typeof AppealDecisionTypes)[keyof typeof AppealDecisionTypes];
