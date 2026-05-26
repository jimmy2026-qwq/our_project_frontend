export const AppealStatuses = {
  Open: 'Open',
  UnderReview: 'UnderReview',
  Resolved: 'Resolved',
  Rejected: 'Rejected',
  Escalated: 'Escalated',
} as const;

export type AppealStatus = (typeof AppealStatuses)[keyof typeof AppealStatuses];
