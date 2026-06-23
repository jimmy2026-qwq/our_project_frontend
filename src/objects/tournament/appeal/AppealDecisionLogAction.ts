export const AppealDecisionLogActions = {
  Assigned: 'Assigned',
  Unassigned: 'Unassigned',
  Triaged: 'Triaged',
  UnderReview: 'UnderReview',
  Resolved: 'Resolved',
  Rejected: 'Rejected',
  Escalated: 'Escalated',
  Reopened: 'Reopened',
} as const;

export type AppealDecisionLogAction =
  (typeof AppealDecisionLogActions)[keyof typeof AppealDecisionLogActions];
