export const ClubPrivilegeCodes = {
  PriorityLineup: 'priority-lineup',
  ApproveRoster: 'approve-roster',
  ManageBank: 'manage-bank',
} as const;

export type ClubPrivilegeCode =
  (typeof ClubPrivilegeCodes)[keyof typeof ClubPrivilegeCodes];
