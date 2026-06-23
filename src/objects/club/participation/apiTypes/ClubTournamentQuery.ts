import type { ClubTournamentScope } from '../ClubTournamentScope';

export interface ClubTournamentQuery {
  scope?: ClubTournamentScope;
  viewer?: string;
  limit?: number;
  offset?: number;
}
