import type { ClubActiveTournament } from '@/pages/shared_objects/club/ClubActiveTournament';

export interface ClubDetailDialogWorkbenchState {
  isLineupDialogOpen: boolean;
  isRelationDialogOpen: boolean;
  isRelationSubmitting: boolean;
  selectedLineupTournament: ClubActiveTournament | null;
}
