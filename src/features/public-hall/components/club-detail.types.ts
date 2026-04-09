import type { ClubApplicationView } from '@/domain/clubs';
import type { ClubPublicProfile } from '@/domain/public';

export interface ClubDetailWorkbenchState {
  profile: ClubPublicProfile;
  operatorId: string;
  isApplicationDialogOpen: boolean;
  isLineupDialogOpen: boolean;
  selectedLineupTournament: ClubPublicProfile['activeTournaments'][number] | null;
  isCurrentMember: boolean;
  isCurrentClubAdmin: boolean;
  clubMemberNames: string[];
  applicationInbox: ClubApplicationView[];
  isInboxLoading: boolean;
  isFeaturedMember: boolean;
  isClubMember: boolean;
  featuredPlayerNames: string[];
  canApply: boolean;
  actionableTournaments: ClubPublicProfile['activeTournaments'];
  canManageLineup: boolean;
}
