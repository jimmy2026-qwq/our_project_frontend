export const PlayerStatuses = {
  Active: 'Active',
  Suspended: 'Suspended',
  Banned: 'Banned',
} as const;

export type PlayerStatus = (typeof PlayerStatuses)[keyof typeof PlayerStatuses];
