import type { ClubActiveTournament } from '@/pages/shared_objects/club/ClubActiveTournament';

export interface ClubDetailTournamentWorkbenchState {
  actionableTournaments: ClubActiveTournament[];
  canManageLineup: boolean;
}
