export const PublicHallLeaderboardDisplayStatuses = {
  Active: 'PublicHallLeaderboardActive',
  Inactive: 'PublicHallLeaderboardInactive',
  Banned: 'PublicHallLeaderboardBanned',
} as const;

export type PublicHallLeaderboardDisplayStatus =
  (typeof PublicHallLeaderboardDisplayStatuses)[keyof typeof PublicHallLeaderboardDisplayStatuses];
