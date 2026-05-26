export const DictionaryNamespaceReviewStatuses = {
  Pending: 'Pending',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Revoked: 'Revoked',
} as const;

export type DictionaryNamespaceReviewStatus =
  (typeof DictionaryNamespaceReviewStatuses)[keyof typeof DictionaryNamespaceReviewStatuses];
