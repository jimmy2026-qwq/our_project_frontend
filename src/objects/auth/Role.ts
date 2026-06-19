export const Roles = {
  Guest: 'Guest',
  RegisteredPlayer: 'RegisteredPlayer',
  ClubAdmin: 'ClubAdmin',
  TournamentAdmin: 'TournamentAdmin',
  SuperAdmin: 'SuperAdmin',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
