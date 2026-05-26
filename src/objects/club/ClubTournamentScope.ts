export const ClubTournamentScopes = {
  Recent: 'recent',
  Active: 'active',
  All: 'all',
} as const;

export type ClubTournamentScope = (typeof ClubTournamentScopes)[keyof typeof ClubTournamentScopes];
