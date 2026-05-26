export const ClubApplicationStatuses = {
  Pending: 'Pending',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Withdrawn: 'Withdrawn',
} as const;

export type ClubApplicationStatus =
  (typeof ClubApplicationStatuses)[keyof typeof ClubApplicationStatuses];
