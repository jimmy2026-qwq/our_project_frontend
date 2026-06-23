import type { ClubActiveTournament } from './ClubActiveTournament';
import type { ClubLineupMember } from './ClubLineupMember';
import type { ClubRecentMatch } from './ClubRecentMatch';

export interface ClubPublicActivity {
  activeTournaments: ClubActiveTournament[];
  currentLineup?: ClubLineupMember[];
  recentMatches?: ClubRecentMatch[];
}
